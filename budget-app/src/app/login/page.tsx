import LoginForm from '../../components/auth/loginForm';
import Navbar from '../../components/layout/Navbar';

const LoginPage: React.FC = () => {
    return (
        <div>
            <Navbar />
            <LoginForm />
        </div>
    );
};

export default LoginPage;