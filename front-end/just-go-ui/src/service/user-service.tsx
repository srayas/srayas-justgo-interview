import { constants } from "../constants/constants";
import { LoginFormType } from "../types/login-form";
import { User } from "../model/user";
import axiosHttp from "../interceptor/axios-interceptor";
import { convertUtcToIst } from "../utils/convertUtcToIst";

export class UserService {
  
  private baseUrl = constants.apiBaseUrl;
  async validateToken() {
    try {
      const response = await axiosHttp.get(`${this.baseUrl}/secured/me`);
      const user = new User().bindUserData(response.data.user);
      return user;
    } catch (error) {
      localStorage.setItem("token", "");
      console.error("Token is Expired", error);
      throw new Error("Token validation failed");
    }
  }

  async authenticateUser(loginForm: LoginFormType) {
    return axiosHttp
      .post(`${this.baseUrl}/auth/login`, loginForm)
      .then(async (response) => {
        if (response.data.token) {
          const token = response.data.token;
          await localStorage.setItem("token", token);
          await this.validateToken();
        }
        return response.data;
      })
      .catch((error) => {
        console.error("Error in authentication", error);
      });
  }

  async getServerTime(){
   try {
     const response= await axiosHttp.get(`${this.baseUrl}/secured/time`)
     const time = convertUtcToIst(response.data.currentTime??'')??'';
     return time;
   } catch (error) {
        console.log("Error in getting time from server",error)
   }
  }

  async getAllUsers(){
    try {
     const response = await axiosHttp.get(`${this.baseUrl}/secured/users`);
      const user= new User().bindUserListData(response.data.userList);
      return user;
    } catch (error) {
        console.log("Errorn in getAllUsers",error)
    }
  }

  async kickOut(user: User) {
    try {
        const response = await axiosHttp.post(`${this.baseUrl}/secured/kickout`,{user})
         return response;
       } catch (error) {
           console.log("Errorn in kickOut of and user",error)
       }
  }
}
