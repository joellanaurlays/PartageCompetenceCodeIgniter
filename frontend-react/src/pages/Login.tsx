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
    Paper,
    useMediaQuery,
    useTheme
} from '@mui/material';
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
        padding: '0 15px',
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
    fontFamily: 'Poppins',
    fontWeight: 800,
    fontSize: '20px',
    color: 'white',
    margin: '15px auto 25px auto',
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

const Login: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Veuillez remplir tous les champs');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await utilisateurService.connexion(email, password);
            
            sessionStorage.setItem('userId', response.data.utilisateurId.toString());
            sessionStorage.setItem('utilisateur', JSON.stringify({
                id: response.data.utilisateurId,
                pseudo: response.data.pseudo,
                email: response.data.email,
                photo_profil: response.data.photo_profil
            }));
            
            navigate('/profil');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    // Taille de l'illustration responsive
    const getIllustrationSize = () => {
        if (isMobile) return { width: '150px', height: '150px', left: '50%', top: '20%', transform: 'translateX(-50%)' };
        if (isTablet) return { width: '250px', height: '250px', left: '50%', top: '15%', transform: 'translateX(-50%)' };
        return { width: '400px', height: '400px', left: '135px', top: '192px' };
    };

    // Position du formulaire responsive
    const getFormPosition = () => {
        if (isMobile) return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '90%' };
        if (isTablet) return { left: '50%', top: '55%', transform: 'translateX(-50%)', width: '80%' };
        return { left: '715px', top: '203px', width: '379px' };
    };

    // Taille du logo responsive
    const getLogoPosition = () => {
        if (isMobile) return { left: '50%', top: '10px', transform: 'translateX(-50%)' };
        if (isTablet) return { left: '50%', top: '10px', transform: 'translateX(-50%)' };
        return { left: '28px', top: '0' };
    };

    const illustrationSize = getIllustrationSize();
    const formPosition = getFormPosition();
    const logoPosition = getLogoPosition();

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
                    src="/icons/logo.png" 
                    alt="Booklovers logo" 
                    style={{ 
                        width: isMobile ? '120px' : 'auto', 
                        height: isMobile ? 'auto' : 'auto' 
                    }} 
                />
            </Box>
            
            {/* Illustration responsive */}
            {!isMobile && (
                <Box sx={{ 
                    position: 'absolute',
                    ...illustrationSize,
                    display: { xs: 'none', sm: 'block' }
                }}>
                    <img 
                        src="/icons/auth.png" 
                        alt="Illustration" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                </Box>
            )}
            
            {/* Formulaire responsive */}
            <Paper elevation={0} sx={{
                position: 'absolute',
                ...formPosition,
                padding: '20px 0',
                background: 'transparent',
                boxShadow: 'none'
            }}>
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
                    Login
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                
                <form onSubmit={handleSubmit}>
                    {/* Champ Email */}
                    <Box sx={{ mb: '25px' }}>
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#333', mb: '8px' }}>
                            Email
                        </Typography>
                        <TextField
                            fullWidth
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
                        <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: '#333', mb: '8px' }}>
                            Mot de passe
                        </Typography>
                        <TextField
                            fullWidth
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

                    {/* Bouton de connexion */}
                    <Button type="submit" disabled={loading} sx={buttonSx}>
                        {loading ? <CircularProgress size={28} /> : 'CONNECTER'}
                    </Button>

                    {/* Liens */}
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        width: '100%',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1, sm: 0 },
                        textAlign: 'center'
                    }}>
                        <Typography component="a" href="/inscription" sx={linkSx}>
                            Créer un compte
                        </Typography>
                        <Typography component="a" href="/mdpOublie" sx={linkSx}>
                            Mot de passe oublié
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;