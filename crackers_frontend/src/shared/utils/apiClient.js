import axios from "axios";

// 🔑 Helper to get session from localStorage
export const getSession = () => {
	const tenantId = localStorage.getItem("tenantId");
	const organizationId = localStorage.getItem("organizationId");
	const token = localStorage.getItem("accessToken");

	if (!tenantId || !organizationId || !token) {
		console.error("❌ Missing authentication/session data");
		return null;
	}

	return { tenantId, organizationId, token };
};

// 🌐 Axios instance
const apiClient = axios.create({
	baseURL: import.meta.env.VITE_CRACKERS_SERVER, // e.g. http://localhost:3000/api/v1
	withCredentials: true,
});

// 🔧 Add Authorization header automatically
apiClient.interceptors.request.use((config) => {
	const session = getSession();
	if (session?.token) {
		config.headers.Authorization = `Bearer ${session.token}`;
	}
	return config;
});

// 🖼️ Helper: Image base URL
// Strip `/api/v1` from the API server URL → so you get the real host for static files
export const IMAGE_BASE_URL = import.meta.env.VITE_CRACKERS_SERVER + "/uploads/";

// 🌍 You can export more constants if needed later (logos, other assets, etc.)
export default apiClient;
