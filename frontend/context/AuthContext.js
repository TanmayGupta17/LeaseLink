"use client";
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'
import { Cookie } from 'next/font/google';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status from localStorage or cookies
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwtDecode(token);
        setIsAuthenticated(true);
        setUser(decodedToken);
    }
  }, []);

  const login = (userData) => {
    Cookies.remove('uuid'); // Remove old token from cookies
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', userData.token); // Save token to localStorage
  };

  const logout = () => {
    Cookies.remove('token'); // Remove token from cookies
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};