import axios from 'axios';
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/login`;

const login = (loginData) => {
  const request = axios.post(baseUrl, loginData);
  return request.then((response) => response.data);
};

export default { login };
