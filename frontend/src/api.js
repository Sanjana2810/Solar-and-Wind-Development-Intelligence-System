const BASE_URL = 'http://127.0.0.1:8000'; 

export const register = async (userData) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error("Registration failed");
    return await response.json();
};

export const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    
    if (!response.ok) throw new Error("Login failed");
    return await response.json();
};

const api = { login, register }; 
export default api;