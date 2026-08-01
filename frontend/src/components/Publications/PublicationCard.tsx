import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Card, CardContent, CardHeader, Typography, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import LikeButton from '../Likes/LikeButton';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { publicationService } from '../../services/publicationService';
import { Publication } from '../../types';

// Styles constants
const CARD_SX = {
    mb: 2,
    borderRadius: 3,
    overflow: 'hidden',
    mx: { xs: 0, sm: 1, md: 2 }
} as const;

const TEXT_FIELD_SX = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#773399',
            borderWidth: '2px'
        }
    }
} as const;

const IMAGE_BOX_SX = {
    width: 180,
    height: 270,
    flexShrink: 0,
    bgcolor: '#f5f5f5',
    borderRadius: 2,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
} as const;

const EDIT_IMAGE_BOX_SX = {
    ...IMAGE_BOX_SX,
    position: 'relative',
    cursor: 'pointer',
    flexDirection: 'column',
    mr: 2
} as const;

const OK_BUTTON_SX = {
    borderRadius: 45,
    background: 'linear-gradient(34deg, #000204 0%, #773399 100%)',
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 12,
    color: 'white',
    textTransform: 'uppercase',
    '&:hover': { transform: 'scale(1.02)' }
} as const;

const CANCEL_BUTTON_SX = {
    borderRadius: 45,
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#773399',
    borderColor: '#773399',
    '&:hover': { backgroundColor: 'rgba(119, 51, 153, 0.1)' }
} as const;

const CARD_HEADER_SX = {
    px: { xs: 1, sm: 1.5, md: 2 },
    pt: 1,
    pb: 0.5
} as const;

const CARD_CONTENT_SX = {
    px: { xs: 1, sm: 1.5, md: 2 },
    py: 0.5
} as const;

const BOTTOM_CARD_CONTENT_SX = {
    px: { xs: 1, sm: 1.5, md: 2 },
    pt: 0,
    pb: 1
} as const;

const TEXT_BOX_SX = {
    flex: 1,
    mx: 2,
    my: 1
} as const;

const TYPOGRAPHY_SX = {
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontSize: '0.9rem'
} as const;

const EDIT_ICON_SX = {
    color: '#773399',
    '&:hover': { color: '#5a2a7a' }
} as const;

const DELETE_ICON_SX = {
    color: '#999',
    '&:hover': { color: '#ff4565' }
} as const;

const COMMENT_BOX_SX = {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    cursor: 'pointer'
} as const;

const AVATAR_SX = { width: 48, height: 48 };

interface PublicationCardProps {
    publication: Publication;
    currentUserId: number;
    onPublicationDeleted?: () => void;
    onPublicationUpdated?: () => void;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ 
    publication, 
    currentUserId, 
    onPublicationDeleted,
    onPublicationUpdated
}) => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editContenu, setEditContenu] = useState(publication.contenu);
    const [editPhoto, setEditPhoto] = useState<File | null>(null);
    const [editPreview, setEditPreview] = useState<string | null>(
        publication.photo_publier ? `http://localhost:8080/uploads/${publication.photo_publier}` : null
    );
    const [loading, setLoading] = useState(false);

    const isOwner = publication.utilisateur_id === currentUserId;
    
    const avatarUrl = publication.photo_profil
        ? `http://localhost:8080/uploads/${publication.photo_profil}`
        : '/icons/green.jpg';

    const photoUrl = publication.photo_publier
        ? `http://localhost:8080/uploads/${publication.photo_publier}`
        : null;

    const handleDelete = async () => {
        if (window.confirm('Voulez-vous vraiment supprimer cette publication ?')) {
            try {
                await publicationService.delete(publication.id);
                onPublicationDeleted?.();
            } catch (error) {
                console.error('Erreur lors de la suppression de la publication', error);
            }
        }
    };

    const handleEditClick = () => setIsEditing(true);

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditContenu(publication.contenu);
        setEditPreview(photoUrl);
        setEditPhoto(null);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setEditPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        if (!editContenu.trim() && !editPhoto) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('contenu', editContenu);
        if (editPhoto) formData.append('photo_publier', editPhoto);

        try {
            await publicationService.update(publication.id, formData);
            setIsEditing(false);
            onPublicationUpdated?.();
        } catch (error) {
            console.error('Erreur lors de la modification', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={CARD_SX}>
            <CardHeader
                avatar={<Avatar src={avatarUrl} sx={AVATAR_SX} />}
                title={`@${publication.pseudo}`}
                subheader={formatDistanceToNow(new Date(publication.date), { addSuffix: true, locale: fr })}
                action={
                    isOwner && !isEditing && (
                        <>
                            <IconButton onClick={handleEditClick} sx={EDIT_ICON_SX}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleDelete} sx={DELETE_ICON_SX}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    )
                }
                sx={CARD_HEADER_SX}
            />

            <CardContent sx={CARD_CONTENT_SX}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    {/* Texte */}
                    <Box sx={TEXT_BOX_SX}>
                        {isEditing ? (
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                value={editContenu}
                                onChange={(e) => setEditContenu(e.target.value)}
                                variant="outlined"
                                size="small"
                                autoFocus
                                sx={TEXT_FIELD_SX}
                            />
                        ) : (
                            publication.contenu && (
                                <Typography variant="body1" sx={TYPOGRAPHY_SX}>
                                    {publication.contenu}
                                </Typography>
                            )
                        )}
                    </Box>

                    {/* Image */}
                    {isEditing ? (
                        <Box sx={EDIT_IMAGE_BOX_SX}>
                            <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} id={`photo-input-${publication.id}`} />
                            <label htmlFor={`photo-input-${publication.id}`} style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
                                {editPreview ? (
                                    <img src={editPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Box sx={{ textAlign: 'center', color: '#999' }}>
                                        <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                                        <Typography sx={{ fontFamily: 'Poppins', fontSize: 12 }}>Changer la photo</Typography>
                                    </Box>
                                )}
                            </label>
                        </Box>
                    ) : (
                        photoUrl && (
                            <Box sx={IMAGE_BOX_SX}>
                                <img src={photoUrl} alt="Publication" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </Box>
                        )
                    )}
                </Box>
            </CardContent>

            <CardContent sx={BOTTOM_CARD_CONTENT_SX}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <LikeButton 
                            userId={currentUserId} 
                            publicationId={publication.id} 
                            initialCount={publication.nombre_like} 
                            initialLiked={publication.liked} 
                        />
                        <Box sx={COMMENT_BOX_SX} onClick={() => navigate(`/commentaires?pubId=${publication.id}&userId=${currentUserId}`)}>
                            <CommentIcon sx={{ color: '#666', fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                                {publication.nombre_commentaire}
                            </Typography>
                        </Box>
                    </Box>

                    {isEditing && (
                        <Box display="flex" gap={1}>
                            <Button variant="contained" onClick={handleUpdate} disabled={loading} size="small" sx={OK_BUTTON_SX}>
                                {loading ? <CircularProgress size={16} color="inherit" /> : 'OK'}
                            </Button>
                            <Button variant="outlined" onClick={handleCancelEdit} size="small" sx={CANCEL_BUTTON_SX}>
                                ANNULER
                            </Button>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default PublicationCard;