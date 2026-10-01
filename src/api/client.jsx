import axios from 'axios';

const API_BASE_URLS = [
  'http://localhost:5135/api'
];

const apiClient = axios.create({
  baseURL: API_BASE_URLS[0],
});
apiClient.interceptors.request.use((config) =>
{
  const token = localStorage.getItem('token');
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    const currentIndex = config?.__apiBaseUrlIndex ?? 0;

    if (error.code === 'ERR_NETWORK' && config && currentIndex < API_BASE_URLS.length - 1) {
      config.__apiBaseUrlIndex = currentIndex + 1;
      config.baseURL = API_BASE_URLS[currentIndex + 1];
      return apiClient.request(config);
    }

    return Promise.reject(error);
  },
);

export default apiClient;