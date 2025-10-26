import { useState, useEffect, createContext, useCallback } from 'react';

import AuthView from './components/authView';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Inbox from './components/inbox';
import Footer from './components/footer';
import Spinner from './components/helper/spinner';

import './App.css';

const apiUrl = import.meta.env.VITE_APP_API_URL;
const USER_API_BASE_URL = `${apiUrl}/user`;
console.log(USER_API_BASE_URL, apiUrl);
const TOKEN_STORAGE_KEY = 'user_jwt_token';

export const MobileContext = createContext(false);
export const TokenContext = createContext(null);
export const UserContext = createContext(null);
export const ApiUrlContext = createContext(null);

const useResponsiveLayout = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);
  return isMobile;
};

function App() {
  // --- 1. JWT Authentication State and Handlers ---
  const [token, setToken] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState('');
  const [userName, setUserName] = useState('');
  const [networkError, setNetworkError] = useState(null);
  // Load token from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setToken(storedToken);
    }
    const shouldValidate = storedToken;
    const validateToken = async () => {
      if (!shouldValidate) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const responce = await fetch(`${USER_API_BASE_URL}/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        });
        setNetworkError(null);
        if (responce.ok) {
          setToken(storedToken);
          const data = await responce.json();
          setUserName(data.name);
          setIsCheckingAuth(false);
        } else {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken(null);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        if (error instanceof TypeError || error.message.includes('ENOTFOUND')) {
          setNetworkError('You are not connected!');
          setAuthError('You are not connected!');
          // Do not set authError here, as it's a connection issue, not an authentication issue
        } else {
          // Fallback for other errors
          setAuthError('An unexpected error occurred during validation.');
          setNetworkError(null);
        }
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    validateToken();
  }, []);

  const handleAuthAction = async (name, email, password, mode) => {
    setAuthError('');
    const endpoint = mode === 'login' ? 'login' : '';
    try {
      const response = await fetch(`${USER_API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          endpoint === 'login'
            ? { email, password }
            : { name, email, password },
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        const message = data.message || `Server error during ${mode}.`;
        setAuthError(message);
        return;
      }

      const jwt = data.token;
      setUserName(data.name);

      if (jwt) {
        localStorage.setItem(TOKEN_STORAGE_KEY, jwt);
        setToken(jwt);
      } else {
        setAuthError(
          'Authentication successful, but no token received from server.',
        );
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      setAuthError('Could not connect to the authentication server.');
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  });

  // --- 2. Application UI/Layout State ---
  const isMobile = useResponsiveLayout();
  const [currentPage, setCurrentPage] = useState('Inbox');
  const [isGridClose, setIsGridClose] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGridChange = () => {
    setIsGridClose(!isGridClose);
  };
  const handleRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };
  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  });
  const handleNavigation = useCallback((pageName) => {
    setCurrentPage(pageName);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  });

  // --- 3. Conditional Render Logic ---
  if (isCheckingAuth) {
    return (
      <div className="main-message-container">
        <Spinner />
        <div className="isChecking">Checking User Session...</div>
      </div>
    );
  }

  if (!token) {
    return (
      <AuthView
        onAuthAction={handleAuthAction}
        authError={authError}
        setAuthError={setAuthError}
      />
    );
  }

  const getPageElement = () => {
    switch (currentPage) {
      case 'Inbox':
      case 'Today':
      case 'Upcoming':
      case 'FilterLabels':
        return (
          <Inbox
            isGridClose={isGridClose}
            page={currentPage}
            refreshTrigger={refreshTrigger}
            handleRefresh={handleRefresh}
            searchQuery={searchQuery}
          />
        );
      default:
        return (
          <Inbox
            isGridClose={isGridClose}
            page={'Inbox'}
            refreshTrigger={refreshTrigger}
            handleRefresh={handleRefresh}
            searchQuery={searchQuery}
          />
        );
    }
  };

  return (
    <UserContext.Provider value={userName}>
      <MobileContext.Provider value={isMobile}>
        <TokenContext.Provider value={token}>
          <ApiUrlContext.Provider value={apiUrl}>
            <div className="min-h-screen flex flex-col font-inter">
              <Header
                handleGridChange={handleGridChange}
                isGridClose={isGridClose}
                refreshTrigger={handleRefresh}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setIsSidebarOpen={setIsSidebarOpen}
                onLogout={handleLogout}
              />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar
                  refreshTrigger={handleRefresh}
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  handleCloseSidebar={handleCloseSidebar}
                  handleLogout={handleLogout}
                  currentPage={currentPage}
                  onNavigate={handleNavigation}
                  user={userName}
                />
                <main className="flex-1 overflow-y-auto bg-gray-100 transition-all duration-300">
                  {getPageElement()}
                  <Footer />
                </main>
              </div>
            </div>
          </ApiUrlContext.Provider>
        </TokenContext.Provider>
      </MobileContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
