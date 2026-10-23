import axios from "axios";

const URI = process.env.NEXT_PUBLIC_FETCH_URI;

const api = axios.create({
    baseURL: URI,
    withCredentials: true,
});

let refreshing = null;

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const original = error.config;

        if (!original || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const url = original.url || "";

        // Never refresh authentication requests.
        const isAuthCall =
            /refreshAccessToken|login|signin|register|signup|logout|signout/i.test(url);

        if (isAuthCall || original._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            if (!refreshing) {
                refreshing = axios
                    .post(
                        `${URI}/refreshAccessToken`,
                        {},
                        { withCredentials: true }
                    )
                    .finally(() => {
                        refreshing = null;
                    });
            }

            await refreshing;

            return api(original);
        } catch (refreshError) {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("auth-expired"));
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;