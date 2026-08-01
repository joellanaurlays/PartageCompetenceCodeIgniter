import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Alert, CircularProgress, InputAdornment, IconButton, useMediaQuery, useTheme } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { utilisateurService } from '../services/utilisateurService';

// Styles réutilisables
const textFieldSx = {
    '& .MuiInputBase-root': {
        height: '37px',
        backgroundColor: '#a9a9a9',
        borderRadius: '15px',
        '& fieldset': { border: 'none' }
    },
    '& .MuiInputBase-input': { 
        padding: '0 45px 0 15px', 
        fontFamily: 'Poppins', 
        fontSize: '14px', 
        color: '#333' 
    }
};

const buttonSx = {
    width: { xs: '100%', sm: '238px' },
    height: '50px',
    background: 'linear-gradient(0deg, #01111d 0%, #773399 100%)',
    borderRadius: '45px',
    fontWeight: 800,
    fontSize: '20px',
    color: 'white',
    margin: '15px auto',
    display: 'block',
    '&:hover': { 
        opacity: 0.9, 
        transform: 'translateY(-2px)' 
    }
};

const linkSx = {
    color: '#333',
    textDecoration: 'none',
    '&:hover': { color: '#773399' }
};

const MdpOublie: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState({ new: false, confirm: false });
    const [form, setForm] = useState({ email: '', nouveauMotDePasse: '', confirmationMotDePasse: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(null);
        setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!form.email || !form.nouveauMotDePasse || !form.confirmationMotDePasse) {
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        if (form.nouveauMotDePasse !== form.confirmationMotDePasse) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        
        if (form.nouveauMotDePasse.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        
        setLoading(true);
        
        try {
            await utilisateurService.modifierMotDePasse(form.email, form.nouveauMotDePasse, form.confirmationMotDePasse);
            setSuccess('Mot de passe modifié avec succès ! Redirection...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors de la modification');
        } finally {
            setLoading(false);
        }
    };

    // Position du logo responsive
    const getLogoPosition = () => {
        if (isMobile || isTablet) return { left: '50%', top: '10px', transform: 'translateX(-50%)' };
        return { left: '28px', top: '0' };
    };

    // Taille de l'illustration responsive
    const getIllustrationSize = () => {
        if (isMobile) return { display: 'none' };
        if (isTablet) return { left: '50%', top: '15%', transform: 'translateX(-50%)', width: '250px', height: '250px' };
        return { left: '135px', top: '192px', width: '400px', height: '400px' };
    };

    // Position du formulaire responsive
    const getFormPosition = () => {
        if (isMobile) return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '90%' };
        if (isTablet) return { left: '50%', top: '55%', transform: 'translateX(-50%)', width: '80%' };
        return { left: '715px', top: '120px', width: '379px' };
    };

    const logoPosition = getLogoPosition();
    const illustrationSize = getIllustrationSize();
    const formPosition = getFormPosition();

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(180deg, #ffffff 1%, #cfcfcf 43%, #999999 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            position: 'relative',
            p: { xs: 2, sm: 3 }
        }}>
            {/* Logo responsive */}
            <Box sx={{ position: 'absolute', ...logoPosition }}>
                <img 
                    src="/Icons/logo.png" 
                    alt="Logo" 
                    style={{ 
                        width: isMobile ? '120px' : 'auto', 
                        height: isMobile ? 'auto' : 'auto' 
                    }} 
                />
            </Box>
            
            {/* Illustration responsive */}
            {!isMobile && (
                <Box sx={{ position: 'absolute', ...illustrationSize }}>
                    <img 
                        src="/Icons/register.png" 
                        alt="Illustration" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </Box>
            )}
            
            {/* Formulaire responsive */}
            <Box sx={{ position: 'absolute', ...formPosition }}>
                <Typography variant="h4" sx={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 800, 
                    fontSize: { xs: '28px', sm: '32px' }, 
                    background: 'linear-gradient(34deg, #000204 0%, #773399 100%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    textAlign: 'center', 
                    mb: '30px' 
                }}>
                    Changer le mot de passe
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                
                <form onSubmit={handleSubmit}>
                    {/* Champ Email */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#333', mb: '8px' }}>
                            Email
                        </Typography>
                        <TextField 
                            fullWidth 
                            name="email" 
                            type="email" 
                            placeholder="Votre email" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                            sx={textFieldSx} 
                            slotProps={{ 
                                input: { 
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <EmailIcon sx={{ color: '#666' }} />
                                        </InputAdornment>
                                    ) 
                                } 
                            }} 
                        />
                    </Box>
                    
                    {/* Champ Nouveau mot de passe */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#333', mb: '8px' }}>
                            Nouveau mot de passe
                        </Typography>
                        <TextField 
                            fullWidth 
                            name="nouveauMotDePasse" 
                            type={showPasswords.new ? 'text' : 'password'} 
                            placeholder="Votre nouveau mot de passe" 
                            value={form.nouveauMotDePasse} 
                            onChange={handleChange} 
                            required 
                            sx={textFieldSx} 
                            slotProps={{ 
                                input: { 
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} edge="end">
                                                {showPasswords.new ? <VisibilityIcon sx={{ color: '#666' }} /> : <VisibilityOffIcon sx={{ color: '#666' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ) 
                                } 
                            }} 
                        />
                    </Box>
                    
                    {/* Champ Confirmation */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#333', mb: '8px' }}>
                            Confirmer le mot de passe
                        </Typography>
                        <TextField 
                            fullWidth 
                            name="confirmationMotDePasse" 
                            type={showPasswords.confirm ? 'text' : 'password'} 
                            placeholder="Confirmer votre mot de passe" 
                            value={form.confirmationMotDePasse} 
                            onChange={handleChange} 
                            required 
                            sx={textFieldSx} 
                            slotProps={{ 
                                input: { 
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} edge="end">
                                                {showPasswords.confirm ? <VisibilityIcon sx={{ color: '#666' }} /> : <VisibilityOffIcon sx={{ color: '#666' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ) 
                                } 
                            }} 
                        />
                    </Box>
                    
                    {/* Bouton */}
                    <Button type="submit" disabled={loading} sx={buttonSx}>
                        {loading ? <CircularProgress size={28} /> : 'RÉINITIALISER'}
                    </Button>
                    
                    {/* Lien retour */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography component="a" href="/login" sx={linkSx}>
                            Retour à la connexion
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default MdpOublie;