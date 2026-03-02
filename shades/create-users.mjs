// Create users table and admin user in Supabase
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

const supabase = createClient(supabaseUrl, supabaseKey);

// The existing hash from users.json
const existingHash = '$2b$10$gE9n2kbQdrO9rkHIheiCXuj91ggSAZOdMUElcQaMqxNAk39TOXe8u';

async function createUsersTable() {
     console.log('Creating users table...');

     // Try to insert user - will fail if table doesn't exist
     try {
          const { data, error } = await supabase
               .from('users')
               .insert([{
                    id: 1,
                    username: 'admin',
                    email: 'admin@cshades.com',
                    password_hash: existingHash,
                    role: 'admin'
               }])
               .select();

          if (error) {
               console.log('Error inserting user:', error.message);
               if (error.message.includes('relation') || error.message.includes('table')) {
                    console.log('\nPlease run this SQL in Supabase SQL Editor:');
                    console.log(`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
                `);
               }
          } else {
               console.log('Admin user created:', data);
          }
     } catch (err) {
          console.log('Error:', err.message);
     }
}

createUsersTable();
