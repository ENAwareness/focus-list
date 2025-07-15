import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', // 使用环境变量或相对路径
  timeout: 5000 // 请求超时时间
});

// 请求拦截器：在每个请求发送前，检查 localStorage 中是否有 token，并将其添加到请求头中
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
