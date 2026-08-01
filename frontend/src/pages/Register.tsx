import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
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
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
        color: '#333'
    }
};

const buttonSx = {
    width: { xs: '100%', sm: '238px' },
    height: '50px',
    background: 'linear-gradient(0deg, #01111d 0%, #773399 100%)',
    borderRadius: '45px',
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 800,
    fontSize: '20px',
    color: 'white',
    margin: '15px auto 25px auto',
    display: 'block',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(119, 51, 153, 0.3)',
    '&:hover': {
        opacity: 0.9,
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 20px rgba(119, 51, 153, 0.4)'
    },
    '&:active': { transform: 'scale(0.98)' }
};

const linkSx = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '14px',
    color: '#333',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    '&:hover': {
        color: '#773399',
        textDecoration: 'underline'
    }
};

const Register: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pseudo || !email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await utilisateurService.inscription({ pseudo, email, mot_de_passe: password });

            sessionStorage.setItem('userId', response.data.utilisateurId.toString());
            sessionStorage.setItem('utilisateur', JSON.stringify({
                id: response.data.utilisateurId,
                pseudo: pseudo,
                email: email,
                photo_profil: null
            }));
            navigate('/profil');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
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
        return { left: '715px', top: '150px', width: '379px' };
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
                    alt="Booklovers logo" 
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
                    fontFamily: 'Poppins, sans-serif', 
                    fontWeight: 800, 
                    fontSize: { xs: '28px', sm: '32px' }, 
                    background: 'linear-gradient(34deg, #000204 0%, #773399 100%)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    textAlign: 'center', 
                    mb: '30px' 
                }}>
                    Créer un compte
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '5px' }}>{error}</Alert>}
                
                <form onSubmit={handleSubmit}>
                    {/* Champ Pseudo */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography component="label" sx={{ display: 'block', fontFamily: 'Poppins, sans-serif', fontWeight: 200, fontSize: '14px', color: '#333', mb: '8px' }}>
                            Pseudo
                        </Typography>
                        <TextField
                            fullWidth
                            name="pseudo"
                            type="text"
                            placeholder="Votre pseudo"
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            required
                            sx={textFieldSx}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <PersonIcon sx={{ color: '#666', width: '31px' }} />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>

                    {/* Champ Email */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography component="label" sx={{ display: 'block', fontFamily: 'Poppins, sans-serif', fontWeight: 200, fontSize: '14px', color: '#333', mb: '8px' }}>
                            Email
                        </Typography>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            placeholder="Votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            sx={textFieldSx}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <EmailIcon sx={{ color: '#666', width: '29px' }} />
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>

                    {/* Champ Mot de passe */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography component="label" sx={{ display: 'block', fontFamily: 'Poppins, sans-serif', fontWeight: 200, fontSize: '14px', color: '#333', mb: '8px' }}>
                            Mot de passe
                        </Typography>
                        <TextField
                            fullWidth
                            name="mot_de_passe"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Votre mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            sx={textFieldSx}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ padding: 0 }}>
                                                {showPassword ? (
                                                    <VisibilityIcon sx={{ color: '#666', width: '31px' }} />
                                                ) : (
                                                    <VisibilityOffIcon sx={{ color: '#666', width: '31px' }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            }}
                        />
                    </Box>

                    {/* Bouton de création */}
                    <Button type="submit" disabled={loading} sx={buttonSx}>
                        {loading ? <CircularProgress size={28} color="inherit" /> : 'Créer'}
                    </Button>

                    {/* Lien connexion */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component="a" href="/login" sx={linkSx}>
                            Déjà un compte ? Se connecter
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default Register;