import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../utils/axiosinstance';
import { API_PATHS } from '../utils/apipaths';


export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const clearUser = useCallback(() => {
        setUser(null);
        localStorage.removeItem('Token');
        localStorage.removeItem('token');
    }, []);

    const updateUser = useCallback((userData) => {
        setUser(userData);
        if (userData.token) {
            localStorage.setItem('Token', userData.token);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if(user) return;
        const accessToken = localStorage.getItem('Token');
        if(!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(response.data);
            }
            catch (error) {
                console.error('User not authenticated:', error);
                clearUser();
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [user, clearUser]);
    return ( 
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider> 
    );
};

export default UserProvider;