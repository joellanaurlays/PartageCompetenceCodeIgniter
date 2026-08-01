import React, { useState } from 'react';
import { likeService } from '../../services/likeService';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { IconButton, Typography, Box } from '@mui/material';

interface LikeButtonProps {
    userId: number;
    publicationId: number;
    initialCount: number;
    initialLiked?: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({
    userId,
    publicationId,
    initialCount, 
    initialLiked = false
}) => {
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const handleLike = async () => {
        if(loading) return;
        setLoading(true);

        // Mise à jour optimiste
        setLiked(!liked);
        setCount(prev => liked ? prev - 1 : prev + 1);

        try {
            const response = await likeService.toggle(userId, publicationId);
            setCount(response.data.nombre_like_actuel);
            setLiked(response.data.liked);
        } catch (error) {
            // Restauration en cas d'erreur
            setLiked(liked);
            setCount(initialCount);
            console.error('Erreur dans l\'ajout/suppression de like', error);      
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box display="flex" alignItems='center' gap={0.5}>
            <IconButton onClick={handleLike} disabled={loading} sx={{color: liked ? '#ff4565' : '#666'}}>
                {liked ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
            </IconButton>
            <Typography variant='body2' color="text.secondary">
                {count}
            </Typography>
        </Box>
    )
}

export default LikeButton;