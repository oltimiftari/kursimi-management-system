export const BASE_URL = "https://kursimi-management-system-1.onrender.com/api/v1.0";
const CLOUDINARY_CLOUD_NAME = "dxwutrlly";



export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
}