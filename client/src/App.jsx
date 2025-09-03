import { useState, uaeEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/sidebar';
import Header from './components/ui/header'
import Inbox from './pages/inbox';
import Today from './pages/today';
import Upcoming from './pages/upcoming';
import FilterLabels from './pages/filterLabels';
import './App.css'

function App() {
  const [isGridClose, setIsGridClose] = useState(true)
  const handleGridChange = () =>{
    setIsGridClose(!isGridClose)
    console.log('clicked', isGridClose)
  }
  return (
      <BrowserRouter>
      <Sidebar />
      <Header handleGridChange={handleGridChange} isGridClose={isGridClose}/>
      <Routes>
        <Route path="/inbox" element={<Inbox isGridClose={isGridClose} page={'Inbox'}/>} />
        <Route path="/today" element={<Inbox isGridClose={isGridClose} page={'Today'}/>} />
        <Route path="/upcoming" element={<Inbox isGridClose={isGridClose} page={'Upcoming'}/>} />
        <Route path="/filterLabels" element={<FilterLabels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
