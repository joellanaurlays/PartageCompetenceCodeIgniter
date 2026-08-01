import api from './api';
import { Commentaire } from '../types';

export const commentaireService = {
    getByPublicationId: (publicationId: number) =>
        api.get<Commentaire[]>(`/commentaires/${publicationId}`),
    
    getNombre: (publicationId: number) =>
        api.get<number>(`/commentaires/nombre/${publicationId}`),

    ajouter: (utilisateurId: number, publicationId: number, texte: string, parentId?: number) =>
        api.post<{message: string; commentaire: Commentaire}>(`/commentaires/${utilisateurId}/${publicationId}`, { 
            texte,
            parent_id: parentId || null 
        }),

    modifier: (commentaireId: number, texte: string) =>
        api.put<{message: string; commentaire: Commentaire}>(`/commentaires/${commentaireId}`, { texte }),
 
    supprimer: (commentaireId: number) =>
        api.delete<void>(`/commentaires/${commentaireId}`)
};