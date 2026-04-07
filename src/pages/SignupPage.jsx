import SignUpForm from "../components/SignupForm";
import "./SignupPage.css";

function SignUpPage() {
    return (
        <div className="signup-page">
            <div className="signup-card">
                <div className="signup-form">
                    <h2>Sign Up</h2>
                    <SignUpForm />
                    <p>Already have an account? <a href="/login">Login</a></p>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;