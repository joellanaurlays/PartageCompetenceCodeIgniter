import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Intercepteur afin de gérer les erreurs
/*api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 4001) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);*/

export default api;