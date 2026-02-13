import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
    user: any | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    login: (token: string, userData: any) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
            setFirebaseUser(fUser);

            if (fUser) {
                // If we have a firebase user, restore the local user data from secondary storage if available
                const storedUser = localStorage.getItem('admin_user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } else {
                setUser(null);
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (token: string, userData: any) => {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = async () => {
        await auth.signOut();
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
