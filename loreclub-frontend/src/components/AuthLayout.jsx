import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from './Input';
import Button from './Button';
import { User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = ({ onTogglePage }) => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
        } catch (err) {
            console.error("Falha no login (AuthLayout):", err);
            setError(err.message || "Usuário ou senha inválidos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                Login da Guilda
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <Input
                        id="username"
                        type="text"
                        label="Nome de Herói"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={User}
                    />
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                    >
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-300"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </Input>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <Button type="submit" loading={loading}>
                        <LogIn className="h-5 w-5 mr-2" />
                        Entrar na Missão
                    </Button>
                </form>
                <p className="mt-10 text-center text-sm text-gray-400">
                    Não é um membro?{' '}
                    <button onClick={onTogglePage} className="font-semibold leading-6 text-lore-pink hover:text-lore-pink-lg">
                        Junte-se à guilda
                    </button>
                </p>
            </div>
        </div>
    );
};

const RegisterPage = ({ onTogglePage }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register(username, email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-white">
                Junte-se à Guilda
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-8" onSubmit={handleSubmit}>
                    <Input
                        id="username"
                        type="text"
                        label="Nome de Herói"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        icon={User}
                    />
                    <Input
                        id="email"
                        type="email"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={User}
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Senha Secreta"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={Lock}
                    />
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <Button type="submit" loading={loading}>
                        Registrar
                    </Button>
                </form>
                <p className="mt-10 text-center text-sm text-gray-400">
                    Já é um membro?{' '}
                    <button onClick={onTogglePage} className="font-semibold leading-6 text-lore-pink hover:text-lore-pink-lg">
                        Faça seu login
                    </button>
                </p>
            </div>
        </div>
    );
};

const AuthLayout = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-lore-bg-light bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-lore-border">
                <h1 className="font-title text-center text-4xl font-bold leading-9 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-lore-purple-lg to-lore-pink-lg mb-4">
                    LoreClub
                </h1>
                {isLogin ?
                    <LoginPage onTogglePage={() => setIsLogin(false)} /> :
                    <RegisterPage onTogglePage={() => setIsLogin(true)} />
                }
            </div>
        </div>
    );
};

export default AuthLayout;
