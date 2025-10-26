import { useState } from 'react';
import Spinner from './helper/spinner';
import { X, Eye, EyeClosed } from 'lucide-react';
import '../assets/css/auth.css';
// ----------------------------------------------------------------------
// Auth Views (Login/Register)
// ----------------------------------------------------------------------

const AuthView = ({ onAuthAction, authError, setAuthError }) => {
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = authMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAuthAction(userName, email, password, authMode);
    setLoading(false);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-header">
          {isLogin ? 'Sign In to Memo' : 'Create Your Account'}
        </h2>
        <p className="auth-subtext">
          {isLogin ? 'Need an account? ' : 'Already have an account? '}
          <button
            onClick={() => setAuthMode(isLogin ? 'register' : 'login')}
            className="auth-switch-button"
            disabled={loading}
          >
            {isLogin ? 'Register Here' : 'Login Here'}
          </button>
        </p>

        {authError && (
          <div className="auth-error ">
            {authError}
            <X onClick={() => setAuthError('')} style={{ cursor: 'pointer' }} />
          </div>
        )}

        <form className="form-group" onSubmit={handleSubmit}>
          <div>
            {isLogin ? null : (
              <>
                <label htmlFor="text" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="input"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="input-field"
                  placeholder="Jhon"
                />
              </>
            )}
          </div>
          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Your password"
                style={{ paddingRight: '30px' }}
              />
              <button
                onClick={togglePasswordVisibility}
                type="button"
                className="eye-icon"
              >
                {showPassword ? <Eye /> : <EyeClosed />}
              </button>
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`submit-button 
                            ${
                              loading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
            >
              {loading ? <Spinner /> : isLogin ? 'Sign In' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
