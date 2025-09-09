import { useState, uaeEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/sidebar';
import Header from './components/ui/header'
import Inbox from './components/inbox';
import Today from './pages/today';
import Upcoming from './pages/upcoming';
import FilterLabels from './pages/filterLabels';
import './App.css'


function App() {
  const [isGridClose, setIsGridClose] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  const handleGridChange = () =>{
    setIsGridClose(!isGridClose)
  }
  const handleRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };
  return (
    <BrowserRouter>
      <Sidebar refreshTrigger={handleRefresh}/>
      <Header handleGridChange={handleGridChange} isGridClose={isGridClose}/>
      <Routes>
        <Route path="/inbox" element={
          <Inbox 
          isGridClose={isGridClose} 
          page={'Inbox'} 
          refreshTrigger={refreshTrigger}
          handleRefresh={handleRefresh}
          />} />
        <Route path="/today" element={<Inbox isGridClose={isGridClose} page={'Today'}/>} />
        <Route path="/upcoming" element={<Inbox isGridClose={isGridClose} page={'Upcoming'}/>} />
        <Route path="/filterLabels" element={<FilterLabels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
