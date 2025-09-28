import { useState, useEffect, createContext } from 'react';
// import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthView from './pages/authView';
import Sidebar from './components/sidebar';
import Header from './components/header'
import Inbox from './components/inbox';
import FilterLabels from './pages/filterLabels';
import HomePage from './pages/homePage';
import Footer from './components/footer'
import './App.css'

const API_BASE_URL = 'http://localhost:5000/api/user'; 
const TOKEN_STORAGE_KEY = 'user_jwt_token'; 


export const MobileContext = createContext(false);

const useResponsiveLayout = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])
  return isMobile;
};

function App() {
   // --- 1. JWT Authentication State and Handlers ---
    const [token, setToken] = useState(null); 
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [authError, setAuthError] = useState('');
    const [userName, setUserName] = useState('')

    // Load token from local storage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedToken) {
            setToken(storedToken);
        }
        setIsCheckingAuth(false);
    }, []);

    // Handles both login and registration network calls
    const handleAuthAction = async (email, password, mode) => {
        setAuthError('');
        const endpoint = mode === 'login' ? 'login' : '';

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                const message = data.message || `Server error during ${mode}.`;
                setAuthError(message);
                return;
            }

            const jwt = data.token; 
            console.log(data)
            setUserName(data.name)
            
            if (jwt) {
                localStorage.setItem(TOKEN_STORAGE_KEY, jwt);
                setToken(jwt);
            } else {
                setAuthError('Authentication successful, but no token received from server.');
            }

        } catch (error) {
            console.error("Network or fetch error:", error);
            setAuthError('Could not connect to the authentication server.');
        }
    };

    // Logout Handler: Clears token and state
    const handleLogout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        console.log("clicked")
    };


    // --- 2. Application UI/Layout State (From your code) ---
    const isMobile = useResponsiveLayout();
    // Since we can't use react-router-dom in this environment, we'll simulate route state
    const [currentPage, setCurrentPage] = useState('Inbox');
    const [isGridClose, setIsGridClose] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleGridChange = () => { setIsGridClose(!isGridClose); };
    const handleRefresh = () => { setRefreshTrigger(prev => !prev); };
    const handleCloseSidebar = () => { setIsSidebarOpen(!isSidebarOpen); };
    const handleNavigation = (pageName) => {
        setCurrentPage(pageName);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    // --- 3. Conditional Render Logic ---
    if (isCheckingAuth) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-xl font-semibold text-indigo-600">Checking User Session...</div>
            </div>
        );
    }
    
    if (!token) {
        // If no token exists, show the login/register screen
        return <AuthView onAuthAction={handleAuthAction} authError={authError} />;
    }

    // If token exists, render the full protected application content
    const getPageElement = () => {
        switch (currentPage) {
            case 'Home':
                return <HomePage />;
            case 'Inbox':
            case 'Today':
            case 'Upcoming':
                return (
                    <Inbox 
                        isGridClose={isGridClose} 
                        page={currentPage} 
                        refreshTrigger={refreshTrigger}
                        searchQuery={searchQuery}
                        token={token}
                    />
                );
            case 'FilterLabels':
                return <FilterLabels />;
            default:
                return <HomePage />;
        }
    };

    return (
        // Note: BrowserRouter and Routes/Route have been removed and replaced 
        // with simple conditional rendering for this single-file environment.
        <MobileContext.Provider value={isMobile}>
            <div className="min-h-screen flex flex-col font-inter">
                <Header 
                    handleGridChange={handleGridChange} 
                    isGridClose={isGridClose}
                    refreshTrigger={handleRefresh}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    setIsSidebarOpen={setIsSidebarOpen}
                    onLogout={handleLogout} // Passed down to handle logout from header if needed
                />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar 
                        refreshTrigger={handleRefresh}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        handleCloseSidebar={handleCloseSidebar}
                        handleLogout={handleLogout} // Logout button placed in Sidebar
                        currentPage={currentPage}
                        onNavigate={handleNavigation}
                        token={token}
                        user={userName}
                    />
                    <main className="flex-1 overflow-y-auto bg-gray-100 transition-all duration-300">
                        {getPageElement()}
                        <Footer />
                    </main>
                </div>
            </div>
        </MobileContext.Provider>
    );
}

export default App;