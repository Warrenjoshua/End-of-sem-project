import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
                        <Route path="/groups/create" element={<PrivateRoute><CreateGroup /></PrivateRoute>} />
                        <Route path="/groups/:id" element={<PrivateRoute><GroupDetails /></PrivateRoute>} />
                        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;