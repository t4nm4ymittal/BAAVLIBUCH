// src/App.js

import React from 'react';
import './App.css';
import Form from './Components/Forms';
import UserList from './Components/UserList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Form />} />
        <Route path="/user-list" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
