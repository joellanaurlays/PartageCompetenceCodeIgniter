import React, { useState, useEffect, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LeftMenu from '../components/Layout/LeftMenu';
import RightPanel from '../components/Layout/RightPanel';
import Header from '../components/Layout/Header';
import PublicationCard from '../components/Publications/PublicationCard';
import { publicationService } from '../services/publicationService';
import { Publication } from '../types';

interface Utilisateur {
    id: number;
    pseudo: string;
    email: string;
    photo_profil: string | null;
}

// Styles constants
const SEARCH_RESULT_BOX_SX = {
    px: { xs: 2, sm: 3 },
    py: 1,
    bgcolor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0'
} as const;

const PUBLICATIONS_CONTAINER_SX = {
    flex: 1,
    overflowY: 'auto',
    padding: { xs: '10px', sm: '10px 20px' }
} as const;

const PUBLICATIONS_LIST_SX = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
} as const;

const EMPTY_STATE_SX = {
    textAlign: 'center',
    py: 4,
    color: '#999'
} as const;

const Profil: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
    const [publications, setPublications] = useState<Publication[]>([]);
    const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
    const [activeView, setActiveView] = useState<'actualites' | 'mes_publications'>('actualites');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedUser = sessionStorage.getItem('utilisateur');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUtilisateur(JSON.parse(storedUser));
        setLoading(false);
    }, [navigate]);

    const loadPublications = useCallback(async () => {
        if (!utilisateur) return;
        
        setLoading(true);
        try {
            let response;
            if (activeView === 'actualites') {
                response = await publicationService.getAll();
            } else {
                response = await publicationService.getUserPublications(utilisateur.id);
            }
            
            if (Array.isArray(response.data)) {
                setPublications(response.data);
                setFilteredPublications(response.data);
            } else {
                setPublications([]);
                setFilteredPublications([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des publications', error);
            setPublications([]);
            setFilteredPublications([]);
        } finally {
            setLoading(false);
        }
    }, [activeView, utilisateur]);

    // Filtre des publications par pseudo
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPublications(publications);
        } else {
            const filtered = publications.filter(pub =>
                pub.pseudo.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPublications(filtered);
        }
    }, [searchTerm, publications]);

    useEffect(() => {
        if (utilisateur) {
            loadPublications();
        }
    }, [utilisateur, activeView, loadPublications]);

    const handlePublicationCreated = () => {
        loadPublications();
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleViewChange = (view: 'actualites' | 'mes_publications') => {
        setActiveView(view);
        // Réinitialisation de la recherche quand on change de vue
        setSearchTerm('');
    };

    const getEmptyStateMessage = () => {
        if (searchTerm) return `Aucune publication trouvée pour "${searchTerm}"`;
        return activeView === 'actualites' ? 'Aucune publication' : 'Vous n\'avez pas encore de publications';
    };

    if (loading || !utilisateur) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress sx={{ color: '#773399' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ 
            display: 'flex', 
            width: '100%', 
            height: '100vh',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            flexDirection: { xs: 'column', md: 'row' }
        }}>
            {/* LeftMenu - caché sur mobile (à gérer avec un drawer) */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <LeftMenu
                    utilisateur={utilisateur}
                    activeView={activeView}
                    onViewChange={handleViewChange}
                />
            </Box>

            {/* Zone centrale */}
            <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                overflow: 'hidden',
                height: '100vh'
            }}>
                {/* Cacher la barre de recherche quand on est sur "Mes publications" */}
                <Header 
                    title={activeView === 'actualites' ? 'Actualités' : 'Mes publications'}
                    onSearch={activeView === 'actualites' ? handleSearch : undefined}
                />

                {/* Message de recherche - uniquement en mode Actualités */}
                {activeView === 'actualites' && searchTerm && (
                    <Box sx={SEARCH_RESULT_BOX_SX}>
                        <Typography variant="body2" color="text.secondary">
                            Résultats pour : "{searchTerm}" ({filteredPublications.length} publication{filteredPublications.length > 1 ? 's' : ''})
                        </Typography>
                    </Box>
                )}

                {/* Liste des publications */}
                <Box sx={PUBLICATIONS_CONTAINER_SX}>
                    <Box sx={PUBLICATIONS_LIST_SX}>
                        {filteredPublications.length === 0 ? (
                            <Typography sx={EMPTY_STATE_SX}>
                                {getEmptyStateMessage()}
                            </Typography>
                        ) : (
                            filteredPublications.map((pub) => (
                                <PublicationCard
                                    key={pub.id}
                                    publication={pub}
                                    currentUserId={utilisateur.id}
                                    onPublicationDeleted={handlePublicationCreated}
                                    onPublicationUpdated={handlePublicationCreated}
                                />
                            ))
                        )}
                    </Box>
                </Box>
            </Box>

            {/* RightPanel - caché sur mobile */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
                <RightPanel 
                    userId={utilisateur.id} 
                    onPublicationCreated={handlePublicationCreated}
                />
            </Box>
        </Box>
    );
};

export default Profil;
