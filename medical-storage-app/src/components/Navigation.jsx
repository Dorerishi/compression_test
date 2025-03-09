import { useAuth } from "../Authentication";
import { useNavigate } from "react-router-dom";

function Navigation(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <nav>
            <h2>Home</h2>
            {user ? (
                <>
                    <span>Welcome, {user.email}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button onClick={() => navigate("/signup")}>Sign Up</button>
                </>
            )}
            </nav>
        </div>
    );
}

export default Navigation;