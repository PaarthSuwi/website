import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: `${API_BASE}/api`,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
});

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Validation
export const uploadValidation = (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/validation/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const getValidationHistory = () => api.get('/validation/history');
export const downloadSampleCSV = () => `${API_BASE}/api/validation/sample`;

// Meetings
export const uploadMeeting = (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/meetings/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const getMeetings = () => api.get('/meetings');
export const getMeeting = (id) => api.get(`/meetings/${id}`);

// Minutes
export const generateMinutes = (meetingId) => api.post('/minutes/generate', { meetingId });
export const getMinutes = (meetingId) => api.get(`/minutes/${meetingId}`);

// Intelligence
export const getIntelligenceInsights = () => api.get('/intelligence/insights');

// Contact
export const submitContact = (data) => api.post('/contact', data);

export default api;
