const API_BASE = 'http://localhost:3001/api';

export async function fetchProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE}/products${queryString ? '?' + queryString : ''}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
}

export async function fetchProduct(id) {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
}

export async function fetchBestsellers() {
    const response = await fetch(`${API_BASE}/products/featured/bestsellers`);
    if (!response.ok) throw new Error('Failed to fetch best sellers');
    return response.json();
}

export async function fetchNewArrivals() {
    const response = await fetch(`${API_BASE}/products/featured/new`);
    if (!response.ok) throw new Error('Failed to fetch new arrivals');
    return response.json();
}

export async function fetchCategories() {
    const response = await fetch(`${API_BASE}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
}

export async function createOrder(orderData) {
    const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
}

export async function fetchOrder(orderNumber) {
    const response = await fetch(`${API_BASE}/orders/${orderNumber}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
}

export async function subscribe(email) {
    const response = await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Failed to subscribe');
    return response.json();
}

export async function sendContact(formData) {
    const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
}
