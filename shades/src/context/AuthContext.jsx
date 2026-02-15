import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    deleteUser
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    emailVerified: firebaseUser.emailVerified
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const register = async (email, password) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    const resetPassword = async (email) => {
        await sendPasswordResetEmail(auth, email);
    };

    const deleteAccount = async () => {
        if (user) {
            try {
                await deleteUser(auth.currentUser);
                setUser(null);
                return { success: true };
            } catch (error) {
                console.error('Error deleting account:', error);
                return { success: false, error: error.message };
            }
        }
        return { success: false, error: 'No user logged in' };
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};
