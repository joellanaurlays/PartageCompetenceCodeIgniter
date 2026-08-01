import api from './api';

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

export const notificationService = {
    getAll: () => api.get<Notification[]>('/notifications'),
    getNonLuCount: () => api.get<{ count: number }>('/notifications/non-lu/count'),
    marquerCommeLu: (notificationId: number) => api.put(`/notifications/${notificationId}/lu`),
    marquerToutLu: () => api.put('/notifications/lu/tout')
};