import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import BusinessProfilePage from './pages/BusinessProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import EditBusinessProfilePage from './pages/EditBusinessProfilePage';
import CreateBusinessProfilePage from './pages/CreateBusinessProfilePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DirectoryPage from './pages/DirectoryPage';
import BusinessDirectoryPage from './pages/BusinessDirectoryPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/business/:id" element={<BusinessProfilePage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/business/:id/edit" element={<EditBusinessProfilePage />} />
        <Route path="/business/create" element={<CreateBusinessProfilePage />} />
        
        {/* Update directory route to use BusinessDirectoryPage */}
        <Route path="/directory" element={<BusinessDirectoryPage />} />
        
      </Routes>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </BrowserRouter>
  );
}

export default App;
