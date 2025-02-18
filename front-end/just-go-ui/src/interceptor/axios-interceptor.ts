import axios from "axios";
import { AuthService } from "../service/auth-service";


const axiosHttp = axios.create();

axiosHttp.interceptors.request.use(
  async (config: any) => {
    console.log("interceptors")
    const token = await new AuthService().getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosHttp;
