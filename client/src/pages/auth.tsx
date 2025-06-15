import useAuth from '../hooks/use-auth';
import { useState } from 'react';

export default function AuthPage() {

    const { isAuthenticated, user, login, logout } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            // Call login API
            const result = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await result.json();
            if (data.success) {
                login(data.user, data.token);
            } else {
                alert(data.message);
            }
        } else {
            // Call register API
            const result = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await result.json();
            if (data.success) {
                login(data.user, data.token);
            } else {
                alert(data.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
                    {isLogin ? 'Login' : 'Register'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
                <p
                    className="mt-4 text-center text-sm text-gray-600 cursor-pointer hover:underline"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
                </p>
                {isAuthenticated && user && (
                    <div className="mt-6 text-center">
                        <h2 className="text-lg font-semibold text-green-700">Welcome, {user.username}!</h2>
                        <button
                            onClick={logout}
                            className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}