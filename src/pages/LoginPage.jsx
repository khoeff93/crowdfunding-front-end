import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

function LoginPage() {
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-form">
                    <h2>Login</h2>
                    <LoginForm />
                    <p>Don't have an account? <a href="/signup">Register</a></p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;