import { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/sidebar';
import Header from './components/ui/header'
import Inbox from './components/inbox';
import FilterLabels from './pages/filterLabels';
import HomePage from './pages/homePage';
import Footer from './components/ui/footer'
import './App.css'

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
  
  const isMobile = useResponsiveLayout();
  const [isGridClose, setIsGridClose] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleGridChange = () =>{
    setIsGridClose(!isGridClose)
  }
  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };
  const handleCloseSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen)
  };
  return (
    <BrowserRouter>
      <MobileContext.Provider value={isMobile}>
      <Sidebar 
        refreshTrigger={handleRefresh}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleCloseSidebar={handleCloseSidebar}
       />
      <Header 
      handleGridChange={handleGridChange} 
      isGridClose={isGridClose}
      refreshTrigger={handleRefresh}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      setIsSidebarOpen={setIsSidebarOpen}
      />
        <div className='main'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inbox" element={
              <Inbox 
              isGridClose={isGridClose} 
              page={'Inbox'} 
              refreshTrigger={refreshTrigger}
              handleRefresh={handleRefresh}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              />} />
            <Route path="/today" element={
              <Inbox 
              isGridClose={isGridClose} 
              page={'Today'} 
              refreshTrigger={refreshTrigger}
              handleRefresh={handleRefresh}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              />} />
            <Route path="/upcoming" element={
              <Inbox 
              isGridClose={isGridClose} 
              page={'Upcoming'} 
              refreshTrigger={refreshTrigger}
              handleRefresh={handleRefresh}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              />} />
            <Route path="/filterLabels" element={<FilterLabels />} />
          </Routes>
          <Footer />
        </div>
      </MobileContext.Provider>
    </BrowserRouter>
  );
}

export default App
