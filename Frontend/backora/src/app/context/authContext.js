
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

    const API_URL = process.env.NEXT_PUBLIC_FETCH_URI;

    const getCurrentUser = useCallback(async () => {
        try {
            console.log("Step 1: Checking current user...");

            // First, check whether the access token works
            const response = await axios.get(
                `${API_URL}/currentUser`,
                {
                    withCredentials: true,
                }
            );

            console.log("Step 2: Current user fetched successfully");

            setUser(response.data.data);
            return response.data.data;

        } catch (error) {
            console.log(
                "Current user request failed:",
                error.response?.status
            );

            // Refresh only when the access token is unauthorized
            if (error.response?.status !== 401) {
                setUser(null);
                return null;
            }

            try {
                console.log("Step 3: Trying to refresh token...");

                // Ask the backend to refresh the access token
                const refreshResponse = await axios.post(
                    `${API_URL}/refreshAccessToken`,
                    {},
                    {
                        withCredentials: true,
                    }
                );

                console.log(
                    "Step 4: Refresh response:",
                    refreshResponse.status
                );

                // Try currentUser again with the refreshed cookie
                const userResponse = await axios.get(
                    `${API_URL}/currentUser`,
                    {
                        withCredentials: true,
                    }
                );

                console.log("Step 5: Session restored successfully");

                setUser(userResponse.data.data);
                return userResponse.data.data;

            } catch (refreshError) {
                console.error(
                    "Refresh/session restoration failed:",
                    refreshError.response?.status,
                    refreshError.response?.data || refreshError.message
                );

                setUser(null);
                return null;
            }

        } finally {
            setLoading(false);
        }
    }, [API_URL]);

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
