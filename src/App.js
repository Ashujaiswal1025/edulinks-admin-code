import React from 'react';
import { BrowserRouter as Router, Route,Navigate, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import AdminPanel from './components/AdminPanel';
import CheckPage from './components/CheckPage';
import LeadsGenerated from './components/LeadsGenerated';
import AddNews from './components/AddNews';
import PublishNews from './components/PublishNews';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen" >
        {/* Fixed Header */}
        <div className="header">
          <Header />
        </div>

        {/* Main Content Area */}
        <div className='flex-grow bg-eduTheme'>
          <Routes>
            <Route path="/" element={<Navigate to="/admin-panel" />} />
            <Route path="/admin-panel" element={<AdminPanel/>}></Route>
            <Route path="/check-page" element={<CheckPage/>}></Route>
            <Route path="/check-page/leads-generated" element={<LeadsGenerated/>}></Route>
            <Route path="/check-page/add-news" element={<AddNews/>}></Route>
            <Route path="/check-page/add-news/publish-news" element={<PublishNews/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
