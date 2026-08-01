import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { publicationService } from '../../services/publicationService';

// Styles constants
const RIGHT_PANEL_SX = {
    width: 280,
    background: 'linear-gradient(180deg, #ffffff 1%, #cfcfcf 43%, #999999 100%)',
    height: '100vh',
    position: 'sticky',
    top: 0,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
    padding: '20px 0'
} as const;

const CARD_STYLE = {
    width: 222,
    height: 222,
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
} as const;

const FORM_STYLE = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 25
} as const;

const TEXT_FIELD_SX = {
    '& .MuiInputBase-root': {
        alignItems: 'center'
    }
} as const;

const PUBLISH_BUTTON_SX = {
    width: 151,
    height: 42,
    borderRadius: 45,
    background: 'linear-gradient(34deg, #000204 0%, #773399 100%)',
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: 18,
    color: 'white',
    boxShadow: '0 8px 20px rgba(119, 51, 153, 0.4)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase'
} as const;

const TEXT_FIELD_INPUT_SX = {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: 500,
    color: '#333',
    textAlign: 'center',
    '& .MuiInputBase-input': {
        padding: 2,
        textAlign: 'center'
    }
} as const;

interface RightPanelProps {
    userId: number;
    onPublicationCreated: () => void;
    disabled?: boolean;
}

const RightPanel: React.FC<RightPanelProps> = ({ userId, onPublicationCreated, disabled = false }) => {
    const [contenu, setContenu] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (disabled) return;
        if (!contenu.trim() && !photo) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('contenu', contenu);
        if (photo) formData.append('photo_publier', photo);

        try {
            await publicationService.create(userId, formData);
            setContenu('');
            setPhoto(null);
            setPreview(null);
            onPublicationCreated();
        } catch (error) {
            console.error('Erreur lors de la création de la publication', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setContenu('');
        setPhoto(null);
        setPreview(null);
    };

    return (
        <Box sx={RIGHT_PANEL_SX}>
            <form onSubmit={handleSubmit} style={FORM_STYLE}>
                {/* Zone d'upload photo */}
                <label style={{
                    ...CARD_STYLE,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                    opacity: disabled ? 0.6 : 1
                }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                        disabled={disabled}
                    />
                    {preview ? (
                        <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                    ) : (
                        <Box sx={{ textAlign: 'center', color: '#999' }}>
                            <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                            <Typography sx={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, textTransform: 'uppercase' }}>
                                Importer une photo
                            </Typography>
                        </Box>
                    )}
                </label>

                {/* Zone de texte */}
                <Box sx={CARD_STYLE}>
                    <TextField
                        placeholder="ÉCRIRE QUELQUE CHOSE..."
                        value={contenu}
                        onChange={(e) => setContenu(e.target.value)}
                        multiline
                        fullWidth
                        variant="standard"
                        disabled={disabled}
                        InputProps={{ disableUnderline: true, sx: TEXT_FIELD_INPUT_SX }}
                        sx={TEXT_FIELD_SX}
                    />
                </Box>

                {/* Bouton publier */}
                <Button
                    type="submit"
                    disabled={loading || disabled}
                    sx={{
                        ...PUBLISH_BUTTON_SX,
                        '&:hover': {
                            transform: disabled ? 'none' : 'scale(1.08)',
                            boxShadow: disabled ? 'none' : '0 12px 25px rgba(119, 51, 153, 0.5)'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'PUBLIER'}
                </Button>
            </form>
        </Box>
    );
};

export default RightPanel;