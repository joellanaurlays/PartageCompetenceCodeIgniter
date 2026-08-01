import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    IconButton,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    CircularProgress,
    Alert,
    Badge,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import ReplyIcon from '@mui/icons-material/Reply';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';
import { notificationService, Notification } from '../services/notificationService';

const NotificationPage: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const response = await notificationService.getAll();
            setNotifications(response.data);
            setError(null);
        } catch (err) {
            setError("Erreur lors du chargement des notifications");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'à l\'instant';
        if (diff < 3600000) return `il y a ${Math.floor(diff / 60000)} min`;
        if (diff < 86400000) return `il y a ${Math.floor(diff / 3600000)} h`;
        if (diff < 604800000) return `il y a ${Math.floor(diff / 86400000)} j`;
        
        return date.toLocaleDateString('fr-FR');
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.lu) {
            try {
                await notificationService.marquerCommeLu(notification.id);
                setNotifications(prev =>
                    prev.map(n =>
                        n.id === notification.id ? { ...n, lu: true } : n
                    )
                );
            } catch (error) {
                console.error('Erreur lors du marquage de la notification', error);
            }
        }
        
        // Redirection selon le type de notification
        if (notification.type === 'reply') {
            // Pour les réponses, rediriger vers la publication
            navigate(`/commentaires?pubId=${notification.publicationId}`);
        } else {
            navigate(`/commentaires?pubId=${notification.publicationId}&userId=${notification.auteurId}`);
        }
    };

    const handleMarquerToutLu = async () => {
        try {
            await notificationService.marquerToutLu();
            setNotifications(prev => prev.map(n => ({ ...n, lu: true })));
        } catch (error) {
            console.error('Erreur lors du marquage de toutes les notifications', error);
        }
    };

    const nonLuCount = notifications.filter(n => !n.lu).length;

    // Fonction pour obtenir l'icône selon le type de notification
    const getIcon = (type: 'like' | 'comment' | 'reply') => {
        switch(type) {
            case 'like':
                return <FavoriteIcon sx={{ color: '#ff4565', fontSize: 20 }} />;
            case 'reply':
                return <ReplyIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
            case 'comment':
                return <CommentIcon sx={{ color: '#773399', fontSize: 20 }} />;
            default:
                return <CommentIcon sx={{ color: '#773399', fontSize: 20 }} />;
        }
    };

    // Fonction pour obtenir le message selon le type de notification
    const getNotificationMessage = (type: 'like' | 'comment' | 'reply') => {
        switch(type) {
            case 'like':
                return 'a aimé votre publication';
            case 'reply':
                return 'a répondu à votre commentaire';
            case 'comment':
                return 'a commenté votre publication';
            default:
                return 'a interagi avec votre publication';
        }
    };

    const getAvatarUrl = (photo_profil: string | null, pseudo: string) => {
        return photo_profil
            ? `http://localhost:8080/uploads/${photo_profil}?t=${Date.now()}`
            : '/icons/green.jpg';
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress sx={{ color: '#773399' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Box display="flex" alignItems="center">
                        <IconButton onClick={() => navigate('/profil')} sx={{ mr: 2 }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Badge badgeContent={nonLuCount} color="error" sx={{ mr: 2 }}>
                            <NotificationsIcon sx={{ color: '#773399' }} />
                        </Badge>
                        <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                            Notifications
                        </Typography>
                    </Box>
                    {notifications.length > 0 && nonLuCount > 0 && (
                        <Button
                            startIcon={<DoneAllIcon />}
                            onClick={handleMarquerToutLu}
                            size="small"
                            sx={{
                                borderRadius: 45,
                                color: '#773399',
                                '&:hover': { backgroundColor: 'rgba(119, 51, 153, 0.04)' }
                            }}
                        >
                            Tout marquer comme lu
                        </Button>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {notifications.length === 0 ? (
                    <Box textAlign="center" py={4}>
                        <NotificationsIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                        <Typography color="text.secondary">
                            Aucune notification pour le moment
                        </Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {notifications.map((notification, index) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    onClick={() => handleNotificationClick(notification)}
                                    sx={{
                                        cursor: 'pointer',
                                        bgcolor: notification.lu ? 'transparent' : 'rgba(119, 51, 153, 0.05)',
                                        borderRadius: 2,
                                        mb: 1,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(119, 51, 153, 0.1)',
                                            transform: 'translateX(5px)'
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            color="error"
                                            variant="dot"
                                            invisible={notification.lu}
                                            overlap="circular"
                                        >
                                            <Avatar src={getAvatarUrl(notification.photo_profil, notification.pseudo)} />
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" flexWrap="wrap" gap={0.5}>
                                                <Typography variant="subtitle2" component="span" fontWeight={600}>
                                                    @{notification.pseudo}
                                                </Typography>
                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                    {getIcon(notification.type)}
                                                    <Typography variant="body2" component="span" color="text.secondary">
                                                        {getNotificationMessage(notification.type)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {formatDate(notification.date)}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default NotificationPage;