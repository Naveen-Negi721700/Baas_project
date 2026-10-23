"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import api from "@/app/lib/api";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = useCallback(async () => {
        try {
            const response = await api.get("/currentUser");

            const currentUser = response.data.data;

            setUser(currentUser);
            return currentUser;
        } catch (error) {
            if (error.response?.status === 401) {
                setUser(null);
                return null;
            }

            console.error(
                "Could not fetch current user:",
                error.response?.data || error.message
            );

            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    useEffect(() => {
        const handleAuthExpired = () => {
            setUser(null);
            setLoading(false);
        };

        window.addEventListener("auth-expired", handleAuthExpired);

        return () => {
            window.removeEventListener(
                "auth-expired",
                handleAuthExpired
            );
        };
    }, []);

    return (
        <authContext.Provider
            value={{
                user,
                setUser,
                loading,
                getCurrentUser,
            }}
        >
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(authContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};