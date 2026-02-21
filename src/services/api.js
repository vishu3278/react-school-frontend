import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchEvents = async () => {
    const response = await api.get('/events/getall');
    return response.data.events || [];
};

export const fetchAnnouncements = async () => {
    const response = await api.get('/announcements/getall');
    return response.data.announcements || [];
};

export const fetchPerformance = async () => {
    const response = await api.get('/performance/getall');
    return response.data.performance || [];
};

export const fetchStudents = async () => {
    const response = await api.get('/students/getall');
    return response.data.students || [];
};

export const fetchClasses = async () => {
    const response = await api.get('/class/getall');
    return response.data.classes || [];
};

export const createStudent = async (studentData) => {
    const response = await api.post('/students', studentData);
    return response.data;
};

export const updateStudent = async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
};

export const fetchTeachers = async () => {
    const response = await api.get('/teachers/getall');
    return response.data.teachers || [];
};

export const createTeacher = async (teacherData) => {
    const response = await api.post('/teachers', teacherData);
    return response.data;
};

export const updateTeacher = async (id, teacherData) => {
    const response = await api.put(`/teachers/${id}`, teacherData);
    return response.data;
};

export const fetchSubjects = async () => {
    const response = await api.get('/subjects/getall');
    return response.data.subjects || [];
};

export const createSubject = async (subjectData) => {
    const response = await api.post('/subjects', subjectData);
    return response.data;
};

export const loginAdmin = async (email, password) => {
    const response = await api.post('/register/signin', { email, password });
    return response;
};

export const registerAdmin = async (email, password) => {
    const response = await api.post('/register/admin', { email, password });
    return response;
};

export default api;
