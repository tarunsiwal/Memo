import { useState } from 'react';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from './components/sidebar';
import Inbox from './pages/inbox';
import Today from './pages/today';
import Update from './pages/update';
import FilterLabels from './pages/filterLabels';

function App() {
  return (
      <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/today" element={<Today />} />
        <Route path="/updates" element={<Update />} />
        <Route path="/filterLabels" element={<FilterLabels />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
