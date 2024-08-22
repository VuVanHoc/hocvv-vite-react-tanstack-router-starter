// import { secureStorage } from "@/utils/secureStorage";
// import axios from "axios";
// import { SecureStorageEnum } from "@/enums/secureStorage";
// import { RoutesEnum } from "@/enums/routers";
// import { ErrorsEnum } from "@/enums/errors";

// let isRefreshing = false;
// let failedQueue: Array<{
// 	resolve: (value?: unknown) => void;
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	reject: (reason?: any) => void;
// }> = [];

// export const getIsRefreshing = () => isRefreshing;
// export const setIsRefreshing = (val: boolean) => {
// 	isRefreshing = val;
// };

// const accessToken = secureStorage
// 	.getItem(SecureStorageEnum.twdPortalSourcing)
// 	?.replace(/^"(.*)"$/, "$1");

// const AXIOS = axios.create({
// 	baseURL: import.meta.env.VITE_APP_BASE_BE_DOMAIN,
// 	headers: {
// 		Authorization: `Bearer ${accessToken}`,
// 		"Content-Type": "application/json",
// 	},
// 	timeout: 60000,
// });

// AXIOS.interceptors.request.use((config) => {
// 	// Use latest 'accessToken' in auth header when reference is expired
// 	const latestAccessToken = secureStorage
// 		.getItem(SecureStorageEnum.accessToken)
// 		?.replace(/^"(.*)"$/, "$1");

// 	if (latestAccessToken && config.headers) {
// 		config.headers.Authorization = `Bearer ${latestAccessToken}`;
// 	}

// 	return config;
// });

// const refreshToken = async () => {
// 	try {
// 		const refreshToken = secureStorage.getItem(
// 			SecureStorageEnum.refreshToken
// 		);
// 		const response = await fetch(
// 			`${
// 				import.meta.env.VITE_APP_BASE_BE_DOMAIN
// 			}/auth/token/refresh?refreshToken=${refreshToken}`,
// 			{
// 				method: "GET",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 			}
// 		);

// 		if (!response.ok) {
// 			throw new Error("Failed to refresh token");
// 		}

// 		const data = await response.json();
// 		const newAccessToken = data.accessToken;
// 		secureStorage.setItem(SecureStorageEnum.accessToken, newAccessToken);
// 		return newAccessToken;
// 	} catch (error) {
// 		console.error("Error refreshing token:", error);
// 		throw error;
// 	}
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const processQueue = (error: any, token: string | null = null) => {
// 	failedQueue.forEach((prom) => {
// 		if (error) {
// 			prom.reject(error);
// 		} else {
// 			prom.resolve(token);
// 		}
// 	});

// 	failedQueue = [];
// };

// AXIOS.interceptors.response.use(
// 	(response) => {
// 		if (response.status === 200 || response.status === 201) {
// 			return response.data;
// 		}
// 		return response;
// 	},
// 	async (error) => {
// 		const originalRequest = error.config;

// 		if (
// 			error.response.status === 401 &&
// 			error.response.data.message === ErrorsEnum.TOKEN_EXPRIED
// 		) {
// 			if (!isRefreshing) {
// 				isRefreshing = true;
// 				try {
// 					const newAccessToken = await refreshToken();
// 					isRefreshing = false;
// 					processQueue(null, newAccessToken);
// 					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
// 					return AXIOS(originalRequest);
// 				} catch (refreshError) {
// 					processQueue(refreshError, null);
// 					secureStorage.removeItem(SecureStorageEnum.accessToken);
// 					secureStorage.removeItem(
// 						SecureStorageEnum.twdPortalSourcing
// 					);
// 					window.open(RoutesEnum.LOGIN, "_self");
// 					return Promise.reject(refreshError);
// 				}
// 			}

// 			return new Promise((resolve, reject) => {
// 				failedQueue.push({ resolve, reject });
// 			})
// 				.then((token) => {
// 					originalRequest.headers.Authorization = `Bearer ${token}`;
// 					return AXIOS(originalRequest);
// 				})
// 				.catch((err) => {
// 					return Promise.reject(err);
// 				});
// 		}

// 		return Promise.reject(error);
// 	}
// );

// export default AXIOS;
