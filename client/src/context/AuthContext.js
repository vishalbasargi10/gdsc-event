import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from "react-router-dom"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded); // Set user data based on decoded token
            } catch (e) {
                console.error("Failed to decode token:", e);
                setUser(null); 
            }
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        setUser(null); 
        navigate('/'); 
    };

    const isAuthenticated = () => {
        if (!token) return false;
        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 > Date.now(); 
        } catch (e) {
            return false;
        }
    };

    const userRole = user?.role || "user"; // Ensure this returns user role

    return (
        <AuthContext.Provider value={{ login, logout, isAuthenticated, user, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
