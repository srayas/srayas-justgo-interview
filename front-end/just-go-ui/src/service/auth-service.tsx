import { User } from "../model/user";
import { UserService } from "./user-service";

const userSvc = new UserService();
export class AuthService {
  async getToken() {
    return (await localStorage.getItem("token"))
      ? localStorage.getItem("token")?.replaceAll('"', "")
      : null;
  }
  appInit() {
    return new Promise<User>(async (resolve, reject) => {
      const token = await this.getToken();
      if (!token) {
        reject("No token found");
        return;
      }
      try {
        const user = await userSvc.validateToken();
        resolve(user);
      } catch (error) {
        console.error(error);
        reject("Token validation failed");
      }
    });
  }
}
