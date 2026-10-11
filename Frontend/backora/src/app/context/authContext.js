
"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import axios from "axios";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = useCallback(async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_FETCH_URI}/currentUser`,
                { withCredentials: true }
            );

            setUser(response.data.data);
            return response.data.data;
        } catch (error) {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

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

export const useAuth = () => useContext(authContext);