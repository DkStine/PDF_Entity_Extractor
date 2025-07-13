import axios from 'axios';

// Create reusable API instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 3000000000000000, // 30 seconds timeout
});

export const processDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Processing failed');
  }
};
