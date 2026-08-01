import axios from 'axios';

const api = axios.create({
    // En développement, le proxy CRA transmet /api à CodeIgniter. Pour un
    // déploiement séparé, définir REACT_APP_API_URL (ex. https://api.example.com/api).
    baseURL: process.env.REACT_APP_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
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
