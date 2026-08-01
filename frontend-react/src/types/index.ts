export interface Utilisateur {
    id: number;
    pseudo: string;
    email: string;
    photo_profil: string | null;
}

export interface Publication {
    id: number;
    contenu: string;
    photo_publier: string | null;
    date: string;
    nombre_like: number;
    nombre_commentaire: number;
    pseudo: string;
    photo_profil: string | null;
    utilisateur_id: number;
    liked?: boolean;
}

export interface Commentaire {
    id: number;
    texte: string;
    date: string;
    pseudo: string;
    photo_profil: string | null;
    utilisateur_id: number;
    publication_id: number;
    parent_id?: number | null;
}

export interface LikeResponse {
    message: string;
    action: string;
    liked: boolean;
    nombre_like_actuel: number;
}

export interface Notification {
    id: number;
    type: 'like' | 'comment' | 'reply';
    message: string;
    date: string;
    lu: boolean;
    publicationId: number;
    auteurId: number;
    pseudo: string;
    photo_profil: string | null;
    commentaireId?: number;
}