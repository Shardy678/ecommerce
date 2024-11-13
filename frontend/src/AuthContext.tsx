import React, { createContext, useState, ReactNode } from "react";

interface AuthState {
    isAuthenticated: boolean;
    user: { name: string; email: string } | null;
}

interface AuthContextType {
    state: AuthState;
    login: (user: { name: string; email: string }) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>(() => {
        const savedUser = localStorage.getItem("user");
        return {
            isAuthenticated: savedUser !== null,
            user: savedUser ? JSON.parse(savedUser) : null,
        };
    });

    const login = (user: { name: string; email: string }) => {
        setState({ isAuthenticated: true, user });
        localStorage.setItem("user", JSON.stringify(user)); 
    };

    const logout = () => {
        setState({ isAuthenticated: false, user: null });
        localStorage.removeItem("user"); 
    };

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export { AuthContext, AuthProvider };
