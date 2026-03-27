import LoginForm from "../components/LoginForm";

function LoginPage() {
    return (
        <div>
            <h1>Login</h1>
            <LoginForm />
            <p>Don't have an account? <a href="/signup">Register</a></p>
        </div>
    );
}

export default LoginPage;