import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

const Login: React.FC = () => {
    const context = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    if (!context) {
        throw new Error("Login must be used within an AuthProvider");
    }

    const { login } = context;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ name, email });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
