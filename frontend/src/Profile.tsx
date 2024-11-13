import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
const Profile: React.FC = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("Profile must be used within an AuthProvider");
    }

    const { state, logout } = context;

    return (
        <div>
            {state.isAuthenticated ? (
                <div>
                    <h1>Welcome, {state.user?.name}!</h1>
                    <p>Email: {state.user?.email}</p>
                    <button onClick={logout}>Logout</button>
                </div>
            ) : (
                <h1>Please log in</h1>
            )}
        </div>
    );
};

export default Profile;
