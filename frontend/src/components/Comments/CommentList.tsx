import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    CircularProgress,
    Alert,
    Divider,
    Paper,
    Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { commentaireService } from '../../services/commentaireService';
import { Commentaire } from '../../types';

// Styles constants
const TEXT_FIELD_FOCUS_SX = {
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': {
            borderColor: '#773399',
            borderWidth: '2px'
        }
    }
};

const SEND_BUTTON_SX = {
    minWidth: 80,
    borderRadius: 45,
    backgroundColor: '#773399',
    fontFamily: 'Poppins',
    fontWeight: 700,
    fontSize: 14,
    color: 'white',
    boxShadow: '0 4px 10px rgba(119, 51, 153, 0.3)',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    '&:hover': {
        backgroundColor: '#5a2a7a',
        transform: 'scale(1.05)',
        boxShadow: '0 6px 15px rgba(119, 51, 153, 0.4)'
    }
};

const OK_BUTTON_SX = {
    borderRadius: 45,
    backgroundColor: '#773399',
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 12,
    color: 'white',
    textTransform: 'uppercase',
    '&:hover': { backgroundColor: '#5a2a7a' }
};

const CANCEL_BUTTON_SX = {
    borderRadius: 45,
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#773399',
    border: '1px solid #773399',
    '&:hover': { backgroundColor: 'rgba(119, 51, 153, 0.1)' }
};

const PAPER_SX = { p: 2, mt: 2 };
const DIVIDER_SX = { mb: 2 };
const LOADING_BOX_SX = { display: 'flex', justifyContent: 'center', py: 4 };
const EMPTY_TEXT_SX = { color: 'text.secondary', textAlign: 'center', py: 4 };
const FORM_BOX_SX = { display: 'flex', gap: 1, mb: 3 };
const REPLY_FORM_BOX_SX = { display: 'flex', gap: 1, mt: 1, mb: 1, ml: 6 };
const CHILD_COMMENT_SX = { ml: 6, mt: 1, borderLeft: '2px solid #e0e0e0', pl: 2 };

interface CommentListProps {
    publicationId: number;
    currentUserId: number;
}

interface CommentWithReplies extends Commentaire {
    replies: CommentWithReplies[];
    showReplies: boolean;
    showReplyForm: boolean;
    level?: number;
}

const CommentList: React.FC<CommentListProps> = ({ publicationId, currentUserId }) => {
    const [comments, setComments] = useState<CommentWithReplies[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [sending, setSending] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [sendingReply, setSendingReply] = useState<number | null>(null);

    const isEditing = editingId !== null;

    // Organiser les commentaires en arborescence
    const organizeComments = (commentsList: Commentaire[]): CommentWithReplies[] => {
        const commentMap = new Map<number, CommentWithReplies>();
        const rootComments: CommentWithReplies[] = [];

        // Créer un map de tous les commentaires
        commentsList.forEach(comment => {
            commentMap.set(comment.id, { 
                ...comment, 
                replies: [], 
                showReplies: false, 
                showReplyForm: false,
                level: 0
            });
        });

        // Organiser les relations parent-enfant
        commentsList.forEach(comment => {
            const commentWithReplies = commentMap.get(comment.id)!;
            if (comment.parent_id && commentMap.has(comment.parent_id)) {
                const parent = commentMap.get(comment.parent_id)!;
                if (!parent.replies) parent.replies = [];
                commentWithReplies.level = (parent.level || 0) + 1;
                parent.replies.push(commentWithReplies);
            } else {
                rootComments.push(commentWithReplies);
            }
        });

        // Trier les commentaires par date
        const sortByDate = (items: CommentWithReplies[]) => {
            items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            items.forEach(item => {
                if (item.replies && item.replies.length > 0) {
                    sortByDate(item.replies);
                }
            });
        };
        sortByDate(rootComments);

        return rootComments;
    };

    const loadComments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await commentaireService.getByPublicationId(publicationId);
            const commentsList = Array.isArray(response.data) ? response.data : [];
            const organizedComments = organizeComments(commentsList);
            setComments(organizedComments);
            setError(null);
        } catch (err) {
            setError("Erreur lors du chargement des commentaires");
            console.error(err);
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [publicationId]);

    useEffect(() => {
        loadComments();
    }, [publicationId, loadComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        
        setSending(true);
        try {
            await commentaireService.ajouter(currentUserId, publicationId, newComment);
            setNewComment('');
            await loadComments();
        } catch (err) {
            setError("Erreur lors de l'ajout du commentaire");
        } finally {
            setSending(false);
        }
    };

    const handleAddReply = async (parentId: number) => {
        const replyTextValue = replyText[parentId];
        if (!replyTextValue || !replyTextValue.trim()) return;
        
        setSendingReply(parentId);
        try {
            await commentaireService.ajouter(currentUserId, publicationId, replyTextValue, parentId);
            setReplyText(prev => ({ ...prev, [parentId]: '' }));
            setReplyingTo(null);
            await loadComments();
        } catch (err) {
            setError("Erreur lors de l'ajout de la réponse");
        } finally {
            setSendingReply(null);
        }
    };

    const handleEdit = async (commentId: number) => {
        if (!editText.trim()) return;
        
        try {
            await commentaireService.modifier(commentId, editText);
            setEditingId(null);
            setEditText('');
            await loadComments();
        } catch (err) {
            setError("Erreur lors de la modification");
        }
    };

    const handleDelete = async (commentId: number) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
            try {
                await commentaireService.supprimer(commentId);
                await loadComments();
            } catch (err) {
                setError("Erreur lors de la suppression");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const toggleReplies = (commentId: number) => {
        setComments(prevComments => {
            const updateCommentReplies = (comments: CommentWithReplies[]): CommentWithReplies[] => {
                return comments.map(comment => {
                    if (comment.id === commentId) {
                        return { ...comment, showReplies: !comment.showReplies };
                    }
                    if (comment.replies && comment.replies.length > 0) {
                        return { ...comment, replies: updateCommentReplies(comment.replies) };
                    }
                    return comment;
                });
            };
            return updateCommentReplies(prevComments);
        });
    };

    const toggleReplyForm = (commentId: number) => {
        setReplyingTo(replyingTo === commentId ? null : commentId);
        setReplyText(prev => ({ ...prev, [commentId]: '' }));
    };

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

    const getAvatarUrl = (photo_profil: string | null) => 
        photo_profil ? `http://localhost:8080/uploads/${photo_profil}` : '/icons/green.jpg';

    const countTotalComments = (commentsList: CommentWithReplies[]): number => {
        let total = commentsList.length;
        commentsList.forEach(comment => {
            if (comment.replies && comment.replies.length > 0) {
                total += countTotalComments(comment.replies);
            }
        });
        return total;
    };

    const renderComment = (comment: CommentWithReplies) => {
        const isOwner = comment.utilisateur_id === currentUserId;
        const isCommentEditing = editingId === comment.id;
        const hasReplies = comment.replies && comment.replies.length > 0;
        const isReplying = replyingTo === comment.id;
        const isSending = sendingReply === comment.id;
        const level = comment.level || 0;
        const marginLeft = Math.min(level * 4, 8); // Max margin-left de 8

        return (
            <React.Fragment key={comment.id}>
                <ListItem
                    alignItems="flex-start"
                    sx={{ ml: marginLeft }}
                    secondaryAction={
                        isOwner && !isCommentEditing && (
                            <Box>
                                <IconButton
                                    edge="end"
                                    onClick={() => {
                                        setEditingId(comment.id);
                                        setEditText(comment.texte);
                                    }}
                                    size="small"
                                    sx={{ color: '#773399' }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDelete(comment.id)}
                                    size="small"
                                    color="error"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )
                    }
                >
                    <ListItemAvatar>
                        <Avatar src={getAvatarUrl(comment.photo_profil)} />
                    </ListItemAvatar>
                    
                    {isCommentEditing ? (
                        <Box sx={{ flex: 1, display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                autoFocus
                                sx={TEXT_FIELD_FOCUS_SX}
                            />
                            <Button size="small" variant="contained" onClick={() => handleEdit(comment.id)} sx={OK_BUTTON_SX}>
                                OK
                            </Button>
                            <Button size="small" onClick={handleCancelEdit} sx={CANCEL_BUTTON_SX}>
                                Annuler
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ flex: 1 }}>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle2" component="span">
                                        @{comment.pseudo}
                                        <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                            {formatDate(comment.date)}
                                        </Typography>
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.primary">
                                        {comment.texte}
                                    </Typography>
                                }
                            />
                            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Button
                                    size="small"
                                    startIcon={<ReplyIcon sx={{ fontSize: 16 }} />}
                                    onClick={() => toggleReplyForm(comment.id)}
                                    sx={{
                                        color: '#773399',
                                        fontFamily: 'Poppins',
                                        fontSize: 12,
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: 'rgba(119, 51, 153, 0.1)' }
                                    }}
                                >
                                    Répondre
                                </Button>
                                {hasReplies && (
                                    <Button
                                        size="small"
                                        startIcon={comment.showReplies ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        onClick={() => toggleReplies(comment.id)}
                                        sx={{
                                            color: '#666',
                                            fontFamily: 'Poppins',
                                            fontSize: 12,
                                            textTransform: 'none'
                                        }}
                                    >
                                        {comment.showReplies ? 'Masquer' : `Voir ${comment.replies!.length} réponse${comment.replies!.length > 1 ? 's' : ''}`}
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </ListItem>

                {/* Formulaire de réponse */}
                {isReplying && (
                    <Box sx={{ ...REPLY_FORM_BOX_SX, ml: marginLeft + 6 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={`Répondre à @${comment.pseudo}...`}
                            value={replyText[comment.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                            autoFocus
                            disabled={isSending}
                            sx={TEXT_FIELD_FOCUS_SX}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleAddReply(comment.id)}
                            disabled={isSending || !replyText[comment.id]?.trim()}
                            sx={SEND_BUTTON_SX}
                        >
                            {isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        </Button>
                    </Box>
                )}

                {/* Réponses imbriquées */}
                {hasReplies && comment.showReplies && (
                    <Collapse in={comment.showReplies}>
                        <Box sx={{ ...CHILD_COMMENT_SX, ml: marginLeft }}>
                            <List sx={{ p: 0 }}>
                                {comment.replies!.map(reply => renderComment(reply))}
                            </List>
                        </Box>
                    </Collapse>
                )}
                <Divider variant="inset" component="li" />
            </React.Fragment>
        );
    };

    const totalComments = countTotalComments(comments);

    return (
        <Paper sx={PAPER_SX}>
            <Typography variant="h6" gutterBottom>
                Commentaires ({totalComments})
            </Typography>
            
            <Divider sx={DIVIDER_SX} />
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            
            {/* Formulaire d'ajout principal */}
            <Box sx={FORM_BOX_SX}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={isEditing ? "Terminez votre modification avant d'ajouter un commentaire..." : "Écrire un commentaire..."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isEditing && handleAddComment()}
                    disabled={sending || isEditing}
                    sx={TEXT_FIELD_FOCUS_SX}
                />
                <Button
                    variant="contained"
                    onClick={handleAddComment}
                    disabled={sending || !newComment.trim() || isEditing}
                    sx={SEND_BUTTON_SX}
                >
                    {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                </Button>
            </Box>
            
            {/* Liste des commentaires */}
            {loading ? (
                <Box sx={LOADING_BOX_SX}>
                    <CircularProgress />
                </Box>
            ) : comments.length === 0 ? (
                <Typography sx={EMPTY_TEXT_SX}>
                    Aucun commentaire pour cette publication
                </Typography>
            ) : (
                <List sx={{ p: 0 }}>
                    {comments.map(comment => renderComment(comment))}
                </List>
            )}
        </Paper>
    );
};

export default CommentList;