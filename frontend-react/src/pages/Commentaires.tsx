import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CommentList from '../components/Comments/CommentList';

const CommentairesPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const publicationId = parseInt(searchParams.get('pubId') || '0');
    const userId = parseInt(searchParams.get('userId') || '0');

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton onClick={() => navigate('/profil')} sx={{ mr: 2 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5">
                        Commentaires
                    </Typography>
                </Box>
                <CommentList 
                    publicationId={publicationId} 
                    currentUserId={userId} 
                />
            </Paper>
        </Container>
    );
};

export default CommentairesPage;