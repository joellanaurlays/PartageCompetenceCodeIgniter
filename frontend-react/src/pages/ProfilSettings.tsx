import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    IconButton,
    Box,
    Avatar,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { utilisateurService } from '../services/utilisateurService';

// Styles réutilisables
const textFieldFocusStyles = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': { borderColor: '#773399' },
        '&:hover fieldset': { borderColor: '#773399' }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': { color: '#773399' }
    }
};

const buttonStyles = {
    borderRadius: 45,
    borderColor: '#773399',
    color: '#773399',
    '&:hover': {
        borderColor: '#5a2a7a',
        color: '#5a2a7a',
        backgroundColor: 'rgba(119, 51, 153, 0.04)'
    }
};

const containedButtonStyles = {
    borderRadius: 45,
    backgroundColor: '#773399',
    '&:hover': { backgroundColor: '#5a2a7a' }
};

const dangerButtonStyles = {
    borderRadius: 45,
    borderColor: '#f44336',
    color: '#f44336',
    '&:hover': {
        borderColor: '#d32f2f',
        color: '#d32f2f',
        backgroundColor: 'rgba(244, 67, 54, 0.04)'
    }
};

const dialogTextFieldStyles = {
    mt: 2,
    '& .MuiOutlinedInput-root': {
        '&:hover fieldset': { borderColor: '#773399' },
        '&.Mui-focused fieldset': { borderColor: '#773399' }
    },
    '& .MuiInputLabel-root': {
        '&.Mui-focused': { color: '#773399' }
    }
};

interface UtilisateurType {
    id: number;
    pseudo: string;
    email: string;
    photo_profil: string | null;
}

const ProfilSettings: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [utilisateur, setUtilisateur] = useState<UtilisateurType | null>(null);
    
    // États d'édition
    const [isEditingPseudo, setIsEditingPseudo] = useState(false);
    const [newPseudo, setNewPseudo] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    
    // États de suppression
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    
    // États mot de passe
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState({
        nouveauMotDePasse: '',
        confirmationMotDePasse: ''
    });

    // Charger l'utilisateur depuis sessionStorage
    useEffect(() => {
        const storedUser = sessionStorage.getItem('utilisateur');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(storedUser);
        setUtilisateur(user);
        setNewPseudo(user.pseudo);
    }, [navigate]);

    // Mise à jour de sessionStorage
    const updateSessionUser = (updates: Partial<UtilisateurType>) => {
        if (!utilisateur) return;
        const updatedUser = { ...utilisateur, ...updates };
        sessionStorage.setItem('utilisateur', JSON.stringify(updatedUser));
        setUtilisateur(updatedUser);
    };

    // Gestion des messages
    const showMessage = (message: string, isError = false) => {
        isError ? setError(message) : setSuccess(message);
        setTimeout(() => {
            setError(null);
            setSuccess(null);
        }, 3000);
    };

    // Gestion de la photo
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Mise à jour du pseudo
    const handleUpdatePseudo = async () => {
        if (!newPseudo.trim() || !utilisateur) return;
        
        setLoading(true);
        try {
            await utilisateurService.modifierUtilisateur(utilisateur.id, { pseudo: newPseudo });
            updateSessionUser({ pseudo: newPseudo });
            showMessage("Pseudo modifié avec succès");
            setIsEditingPseudo(false);
        } catch (err: any) {
            showMessage(err.response?.data?.error || "Erreur lors de la modification du pseudo", true);
        } finally {
            setLoading(false);
        }
    };

    // Mise à jour de la photo
    const handleUpdatePhoto = async () => {
        if (!selectedPhoto || !utilisateur) return;
        
        setLoading(true);
        const formData = new FormData();
        formData.append('photo_profil', selectedPhoto);
        
        try {
            const response = await utilisateurService.modifierPhotoProfil(utilisateur.id, formData);
            updateSessionUser({ photo_profil: response.data.photo_profil });
            setPhotoPreview(null);
            setSelectedPhoto(null);
            showMessage("Photo de profil modifiée avec succès");
        } catch (err: any) {
            showMessage(err.response?.data?.error || "Erreur lors de la modification de la photo", true);
        } finally {
            setLoading(false);
        }
    };

    // Mise à jour du mot de passe
    const handleUpdatePassword = async () => {
        if (!utilisateur) return;
        
        if (passwordData.nouveauMotDePasse !== passwordData.confirmationMotDePasse) {
            showMessage("Les mots de passe ne correspondent pas", true);
            return;
        }
        
        if (passwordData.nouveauMotDePasse.length < 6) {
            showMessage("Le mot de passe doit contenir au moins 6 caractères", true);
            return;
        }
        
        setLoading(true);
        try {
            await utilisateurService.modifierMotDePasse(
                utilisateur.email,
                passwordData.nouveauMotDePasse,
                passwordData.confirmationMotDePasse
            );
            showMessage("Mot de passe modifié avec succès");
            setShowPasswordForm(false);
            setPasswordData({ nouveauMotDePasse: '', confirmationMotDePasse: '' });
        } catch (err: any) {
            showMessage(err.response?.data?.error || "Erreur lors de la modification du mot de passe", true);
        } finally {
            setLoading(false);
        }
    };

    // Suppression du compte avec message de succès avant redirection
    const handleDeleteAccount = async () => {
        if (!utilisateur) return;
        
        setLoading(true);
        try {
            await utilisateurService.supprimerUtilisateur(utilisateur.id);
            
            // Fermer le dialogue de confirmation
            setOpenDeleteDialog(false);
            
            // Afficher le message de succès
            showMessage("Compte supprimé avec succès");
            
            // Attendre 2 secondes pour que l'utilisateur voie le message
            setTimeout(() => {
                sessionStorage.clear();
                navigate('/login');
            }, 2000);
            
        } catch (err: any) {
            showMessage(err.response?.data?.error || "Erreur lors de la suppression du compte", true);
            setOpenDeleteDialog(false);
            setLoading(false);
        }
    };

    if (!utilisateur) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress sx={{ color: '#773399' }} />
            </Box>
        );
    }

    const avatarUrl = utilisateur.photo_profil
        ? `http://localhost:8080/uploads/${utilisateur.photo_profil}`
        : '/icons/green.jpg';

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                {/* En-tête */}
                <Box display="flex" alignItems="center" mb={3}>
                    <IconButton onClick={() => navigate('/profil')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                        Paramètres du profil
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

                {/* Photo de profil */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                    <Box sx={{ position: 'relative' }}>
                        <Avatar src={photoPreview || avatarUrl} sx={{ width: 120, height: 120, border: '3px solid #773399' }} />
                        <label htmlFor="photo-upload">
                            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                            <IconButton component="span" sx={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#773399', color: 'white', '&:hover': { backgroundColor: '#5a2a7a' } }}>
                                <PhotoCameraIcon />
                            </IconButton>
                        </label>
                    </Box>
                    {selectedPhoto && (
                        <Button onClick={handleUpdatePhoto} disabled={loading} variant="contained" size="small" sx={{ mt: 2, ...containedButtonStyles }}>
                            {loading ? <CircularProgress size={20} /> : 'Enregistrer la photo'}
                        </Button>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Pseudo */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1 }}>Pseudo</Typography>
                    {isEditingPseudo ? (
                        <Box display="flex" gap={1}>
                            <TextField fullWidth size="small" value={newPseudo} onChange={(e) => setNewPseudo(e.target.value)} sx={textFieldFocusStyles} />
                            <IconButton onClick={handleUpdatePseudo} disabled={loading} sx={{ color: '#773399', '&:hover': { color: '#5a2a7a' } }}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => setIsEditingPseudo(false)} sx={{ color: '#f44336', '&:hover': { color: '#d32f2f' } }}>
                                <CancelIcon />
                            </IconButton>
                        </Box>
                    ) : (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body1">@{utilisateur.pseudo}</Typography>
                            <IconButton onClick={() => setIsEditingPseudo(true)} size="small" sx={{ color: '#773399', '&:hover': { color: '#5a2a7a' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Email */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1 }}>Email</Typography>
                    <Typography variant="body1">{utilisateur.email}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Mot de passe */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1 }}>Mot de passe</Typography>
                    {showPasswordForm ? (
                        <Box>
                            <TextField 
                                fullWidth 
                                type="password" 
                                label="Nouveau mot de passe" 
                                size="small" 
                                value={passwordData.nouveauMotDePasse} 
                                onChange={(e) => setPasswordData({ ...passwordData, nouveauMotDePasse: e.target.value })} 
                                sx={{ mb: 2, ...textFieldFocusStyles }} 
                            />
                            <TextField 
                                fullWidth 
                                type="password" 
                                label="Confirmation" 
                                size="small" 
                                value={passwordData.confirmationMotDePasse} 
                                onChange={(e) => setPasswordData({ ...passwordData, confirmationMotDePasse: e.target.value })} 
                                sx={{ mb: 2, ...textFieldFocusStyles }} 
                            />
                            <Box display="flex" gap={1}>
                                <Button variant="contained" onClick={handleUpdatePassword} disabled={loading} sx={containedButtonStyles}>
                                    {loading ? <CircularProgress size={20} /> : 'Enregistrer'}
                                </Button>
                                <Button variant="outlined" onClick={() => { setShowPasswordForm(false); setPasswordData({ nouveauMotDePasse: '', confirmationMotDePasse: '' }); }} sx={buttonStyles}>
                                    Annuler
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Button variant="outlined" onClick={() => setShowPasswordForm(true)} sx={buttonStyles}>
                            Changer le mot de passe
                        </Button>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Suppression du compte */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins', fontWeight: 600, color: '#f44336', mb: 1 }}>Zone dangereuse</Typography>
                    <Button variant="outlined" startIcon={<DeleteForeverIcon />} onClick={() => setOpenDeleteDialog(true)} sx={dangerButtonStyles}>
                        Supprimer mon compte
                    </Button>
                </Box>
            </Paper>

            {/* Dialogue de confirmation de suppression */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>Supprimer définitivement le compte ?</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontFamily: 'Poppins' }}>
                        Cette action est irréversible. Toutes vos publications et commentaires seront supprimés.
                        <br /><br />
                        Tapez <strong>{utilisateur.pseudo}</strong> pour confirmer :
                    </DialogContentText>
                    <TextField 
                        fullWidth 
                        size="small" 
                        value={deleteConfirmText} 
                        onChange={(e) => setDeleteConfirmText(e.target.value)} 
                        sx={dialogTextFieldStyles}
                        label="Confirmer le pseudo"
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)} sx={buttonStyles}>Annuler</Button>
                    <Button 
                        onClick={handleDeleteAccount} 
                        disabled={deleteConfirmText !== utilisateur.pseudo || loading} 
                        color="error" 
                        variant="contained"
                    >
                        {loading ? <CircularProgress size={24} /> : 'Supprimer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfilSettings;