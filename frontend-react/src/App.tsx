import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MdpOublie from './pages/MdpOublie';
import CommentairesPage from './pages/Commentaires';
import Profil from './pages/Profile';
import ProfilSettings from './pages/ProfilSettings';
import NotificationPage from './pages/Notification';

// Composant de protection des routes - utilise sessionStorage
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userId = sessionStorage.getItem('userId');
    return userId ? <>{children}</> : <Navigate to="/login" replace />;
};

// Composant pour les routes publiques - utilise sessionStorage
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const userId = sessionStorage.getItem('userId');
    return userId ? <Navigate to="/profil" replace /> : <>{children}</>;
};

function App() {
    return (
        <Routes>
            {/* Route par défaut : redirige vers login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Routes publiques */}
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />
            <Route path="/inscription" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />
            <Route path="/mdpOublie" element={
                <PublicRoute>
                    <MdpOublie />
                </PublicRoute>
            } />
            
            {/* Routes privées */}
            <Route path="/profil" element={
                <PrivateRoute>
                    <Profil />
                </PrivateRoute>
            } />
            <Route path="/commentaires" element={
                <PrivateRoute>
                    <CommentairesPage />
                </PrivateRoute>
            } />
            
            <Route path="/profil/settings" element={
                <PrivateRoute>
                    <ProfilSettings />
                </PrivateRoute>
            } />

            <Route path="/notifications" element={
                <PrivateRoute>
                    <NotificationPage/>
                </PrivateRoute>
            }/>

            {/* Route 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;