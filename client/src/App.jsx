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
  return (
      <BrowserRouter>
      <Sidebar />
      <Header />
      <Routes>
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/today" element={<Today />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/filterLabels" element={<FilterLabels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
