import { useState } from "react";
// ----------------------------------------------------------------------
// Auth Views (Login/Register)
// ----------------------------------------------------------------------

const AuthView = ({ onAuthAction, authError }) => {
    const [authMode, setAuthMode] = useState('login'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isLogin = authMode === 'login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onAuthAction(email, password, authMode);
        setLoading(false);
    };

    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <div className="flex justify-center items-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 shadow-2xl rounded-xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
                    {isLogin ? 'Sign In to Your App' : 'Create Your Account'}
                </h2>
                <p className="text-center text-sm text-gray-600 mb-6">
                    {isLogin ? "Need an account? " : "Already have an account? "}
                    <button 
                        onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none transition duration-150 ease-in-out"
                        disabled={loading}
                    >
                        {isLogin ? 'Register Here' : 'Login Here'}
                    </button>
                </p>

                {authError && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                        {authError}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-200 ease-in-out
                            ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                        >
                            {loading ? <LoadingSpinner /> : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthView;
