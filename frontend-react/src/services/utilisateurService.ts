import api from './api';
import { Utilisateur } from '../types';

export const utilisateurService = {
    // Inscription
    inscription: (utilisateur: { pseudo: string; email: string; mot_de_passe: string }) =>
        api.post<{ message: string; utilisateurId: number }>('/utilisateurs/inscription', utilisateur),
    
    // Connexion
    connexion: (email: string, mot_de_passe: string) =>
        api.post<{ message: string; utilisateurId: number; pseudo: string; email:string; photo_profil: string | null }>('/utilisateurs/connexion', { email, mot_de_passe }),
    
    // Déconnexion
    deconnexion: () => api.post('/utilisateurs/deconnexion'),
    
    // Modifier utilisateur
    modifierUtilisateur: (id: number, utilisateur: Partial<Utilisateur>) =>
        api.put<Utilisateur>(`/utilisateurs/${id}`, utilisateur),
    
    // Modifier mot de passe
    modifierMotDePasse: (email: string, nouveauMotDePasse: string, confirmationMotDePasse: string) =>
        api.post('/utilisateurs/modifier-mot-de-passe', { email, nouveauMotDePasse, confirmationMotDePasse }),
    
    // Modifier pdp
    modifierPhotoProfil: (id: number, formData: FormData) =>
        api.put<{message: string; photo_profil: string}>(`/utilisateurs/${id}/photo`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }),

    // Supprimer utilisateur
    supprimerUtilisateur: (id: number) => api.delete(`/utilisateurs/${id}`)
};