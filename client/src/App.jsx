import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/sidebar';
import Header from './components/ui/header'
import Inbox from './components/inbox';
import FilterLabels from './pages/filterLabels';
import HomePage from './pages/homePage';
import './App.css'


function App() {
  const [isGridClose, setIsGridClose] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGridChange = () =>{
    setIsGridClose(!isGridClose)
  }
  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <BrowserRouter>
      <Sidebar 
        refreshTrigger={handleRefresh}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
       />
      <Header handleGridChange={handleGridChange} isGridClose={isGridClose}/>
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
    </BrowserRouter>
  );
}

export default App
