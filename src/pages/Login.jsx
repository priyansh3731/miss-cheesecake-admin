import { useState } from "react";
import { auth } from "../config"; // Ensure the import path matches your file structure
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const clickHandler = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log(userCredential.user);
            navigate("/");
        } catch (error) {
            console.error("Login failed: ", error.message);
            alert("Invalid email or password. Please try again.");
        }
    };

    return (
        <div className="main-conatainer">
            <div className="login-container">
            <form className="login-form" onSubmit={clickHandler}>
                <h1>Log In</h1>
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
        </div>
    );
};

export default Login;
