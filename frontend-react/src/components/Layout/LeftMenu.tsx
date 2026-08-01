import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, Badge } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import { utilisateurService } from '../../services/utilisateurService';
import { notificationService } from '../../services/notificationService';

// Types
interface LeftMenuProps {
    utilisateur: {
        id: number;
        pseudo: string;
        photo_profil: string | null;
    };
    activeView: 'actualites' | 'mes_publications';
    onViewChange: (view: 'actualites' | 'mes_publications') => void;
}

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

// Styles constants
const MENU_ITEM_STYLES = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    mb: 1,
    '&:hover': {
        background: 'rgba(119, 51, 153, 0.15)',
        transform: 'translateX(5px)'
    },
    '&:hover .menu-icon': { transform: 'scale(1.1)' },
    '&:hover .menu-text': { color: '#773399' }
} as const;

const LOGOUT_HOVER_STYLES = {
    '&:hover': {
        background: 'rgba(119, 51, 153, 0.15)',
        transform: 'translateX(5px)'
    },
    '&:hover .logout-icon': { color: '#773399' },
    '&:hover .logout-text': { color: '#773399' }
} as const;

const AVATAR_HOVER_STYLES = {
    '&:hover .avatar': {
        transform: 'scale(1.05)',
        boxShadow: '0 6px 15px rgba(119, 51, 153, 0.3)'
    },
    '&:hover .pseudo': {
        color: '#773399',
        textDecoration: 'underline'
    }
} as const;

const BUTTON_STYLES = {
    borderRadius: 45,
    borderColor: '#773399',
    color: '#773399',
    '&:hover': {
        borderColor: '#5a2a7a',
        color: '#5a2a7a',
        backgroundColor: 'rgba(119, 51, 153, 0.04)'
    }
} as const;

const CONTAINED_BUTTON_STYLES = {
    borderRadius: 45,
    backgroundColor: '#773399',
    '&:hover': { backgroundColor: '#5a2a7a' }
} as const;

// Composant MenuItem
const MenuItem: React.FC<MenuItemProps> = ({ icon, label, isActive, onClick }) => (
    <Box onClick={onClick} sx={{
        ...MENU_ITEM_STYLES,
        background: isActive ? 'rgba(119, 51, 153, 0.2)' : 'transparent',
        borderLeft: isActive ? '3px solid #773399' : '3px solid transparent'
    }}>
        <Box className="menu-icon" sx={{
            width: 32, height: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isActive ? '#773399' : '#666',
            transition: 'transform 0.3s ease'
        }}>
            {icon}
        </Box>
        <Typography className="menu-text" sx={{
            ml: 2, fontFamily: 'Poppins',
            fontWeight: isActive ? 700 : 600, fontSize: 16,
            color: isActive ? '#773399' : '#333',
            transition: 'color 0.3s ease'
        }}>
            {label}
        </Typography>
    </Box>
);

// Composant principal
const LeftMenu: React.FC<LeftMenuProps> = ({ utilisateur: initialUser, activeView, onViewChange }) => {
    const navigate = useNavigate();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [nonLuCount, setNonLuCount] = useState(0);
    const [currentUser, setCurrentUser] = useState(initialUser);

    // Mettre à jour l'utilisateur local quand les props changent
    useEffect(() => {
        setCurrentUser(initialUser);
    }, [initialUser]);

    // Surveiller les changements dans sessionStorage
    useEffect(() => {
        const checkForUpdates = () => {
            const storedUser = sessionStorage.getItem('utilisateur');
            if (storedUser) {
                const updatedUser = JSON.parse(storedUser);
                if (updatedUser.photo_profil !== currentUser.photo_profil || 
                    updatedUser.pseudo !== currentUser.pseudo) {
                    setCurrentUser(updatedUser);
                }
            }
        };

        // Vérifier toutes les secondes
        const interval = setInterval(checkForUpdates, 1000);
        
        // Écouter l'événement de mise à jour personnalisé
        const handleUserUpdate = () => {
            checkForUpdates();
        };
        
        window.addEventListener('userUpdate', handleUserUpdate);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('userUpdate', handleUserUpdate);
        };
    }, [currentUser.photo_profil, currentUser.pseudo]);

    // Récupérer le nombre de notifications non lues
    useEffect(() => {
        const fetchNonLuCount = async () => {
            try {
                const response = await notificationService.getNonLuCount();
                setNonLuCount(response.data.count);
            } catch (error) {
                console.error('Erreur lors du chargement du nombre de notifications', error);
            }
        };
        fetchNonLuCount();
        const interval = setInterval(fetchNonLuCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await utilisateurService.deconnexion();
            sessionStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        } finally {
            setLoading(false);
            setLogoutDialogOpen(false);
        }
    };

    const avatarUrl = currentUser.photo_profil
        ? `http://localhost:8080/uploads/${currentUser.photo_profil}`
        : '/icons/green.jpg';

    const menuItems = [
        { icon: <HomeIcon />, label: 'Actualités', key: 'actualites' as const },
        { 
            icon: (
                <Badge badgeContent={nonLuCount} color="error">
                    <NotificationsIcon />
                </Badge>
            ), 
            label: 'Notification', 
            key: 'notification' as const, 
            action: () => navigate('/notifications') 
        },
        { icon: <ArticleIcon />, label: 'Mes publications', key: 'mes_publications' as const }
    ];

    return (
        <>
            <Box sx={{
                width: 280,
                background: 'linear-gradient(180deg, #ffffff 1%, #cfcfcf 43%, #999999 100%)',
                height: '100vh', position: 'sticky', top: 0,
                flexShrink: 0, display: 'flex', flexDirection: 'column'
            }}>
                {/* Logo */}
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 2 }}>
                    <img src="/icons/logo.png" alt="Logo" style={{ width: 199, height: 122 }} />
                </Box>

                {/* Profil cliquable */}
                <Box onClick={() => navigate('/profil/settings')} sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    mt: 2, mb: 2, cursor: 'pointer', transition: 'all 0.3s ease',
                    ...AVATAR_HOVER_STYLES
                }}>
                    <Avatar 
                        key={currentUser.photo_profil} // Force le re-rendu quand la photo change
                        src={avatarUrl} 
                        className="avatar" 
                        sx={{
                            width: 86, height: 88, border: '3px solid white',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s ease'
                        }} 
                    />
                    <Typography className="pseudo" sx={{
                        fontFamily: 'Poppins', fontWeight: 600, fontSize: 16,
                        color: '#333', textAlign: 'center', mt: 2,
                        transition: 'all 0.3s ease'
                    }}>
                        @{currentUser.pseudo}
                    </Typography>
                </Box>

                {/* Menu items */}
                <Box sx={{ flex: 1, px: 3, mt: 2 }}>
                    {menuItems.map(item => (
                        <MenuItem
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeView === item.key}
                            onClick={() => item.action ? item.action() : onViewChange(item.key)}
                        />
                    ))}
                </Box>

                {/* Déconnexion */}
                <Box sx={{ px: 3, pb: 4, mt: 'auto' }}>
                    <Box onClick={() => setLogoutDialogOpen(true)} sx={{
                        display: 'flex', alignItems: 'center', cursor: 'pointer',
                        padding: '8px 12px', borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        ...LOGOUT_HOVER_STYLES
                    }}>
                        <LogoutIcon className="logout-icon" sx={{
                            width: 32, height: 32, color: '#666',
                            transition: 'color 0.3s ease'
                        }} />
                        <Typography className="logout-text" sx={{
                            ml: 2, fontFamily: 'Poppins', fontWeight: 600,
                            fontSize: 16, color: '#333', transition: 'color 0.3s ease'
                        }}>
                            Se déconnecter
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Dialogue de confirmation */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
                <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>Déconnexion</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: 'Poppins' }}>
                        Êtes-vous sûr de vouloir vous déconnecter ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)} sx={BUTTON_STYLES}>Annuler</Button>
                    <Button onClick={handleLogout} disabled={loading} variant="contained" sx={CONTAINED_BUTTON_STYLES}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Se déconnecter'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LeftMenu;