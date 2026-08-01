import api from './api';
import {Publication} from '../types';

export const publicationService = {
    getAll: () => api.get<Publication[]>('/publications/toutes'),

    getUserPublications: (userId: number) => 
        api.get<Publication[]>(`/publications/utilisateur/${userId}`),

    create: (userId: number, formData: FormData) =>
        api.post(`/publications/creer/${userId}`, formData, {
            headers: {'Content-Type': 'multipart/formData'}
        }),
    
    update: (publicationId: number, formData: FormData ) => 
        api.put(`/publications/${publicationId}`, formData, {
            headers: {'Content-Type': 'multipart/form-Data'}
        }),
    
    delete: (publicationId: number) => 
        api.delete(`/publications/${publicationId}`)
};