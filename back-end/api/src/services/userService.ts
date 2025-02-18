import { getAllUsersFromDb, getLockedUserByUserName, getUserDetailsByUsername, lockAccountInDB, resetFailedAttemptsInDb, unLockAccountInDB, updateFailedAttemptsInDb, User } from "../models/userModel";

export class UserService{

    constructor(){

    }
    async getUserByUsername(username:string){
       try {
        const userDetails=await getUserDetailsByUsername(username).then((user)=>{
            if(user)
            return{
                username:user.username,
                locked:user.locked,
                role:user.role,
                failed_attempts:user.failed_attempts,
                id:user.id,
                mobileNumber:user.mobileNumber
            }
            return null;
        })
        
        return userDetails
       } catch (error) {
        console.error("getUserDetailsByUsername",error)
         return ""
       }
    }
    async updateFailedAttempts(username: string, attempts: number){
        try {
            await updateFailedAttemptsInDb(username,attempts)
        } catch (error) {
            console.error("Error in updateFailedAttemptsInDb", error)
        }
    }
    async lockAccount(username:string){
        try {            
            const user =await this.getUserByUsername(username)
            if(user && user.id){
                await  lockAccountInDB(user.id.toString())
            }
           
        } catch (error) {
            console.error("Error in lockAccountInDB", error)
        }
        
    }
    async unLockAccount(username:string){
        try {            
            const user =await this.getUserByUsername(username)
            if(user && user.id){
                await  unLockAccountInDB(user.id.toString())
            }else{
                throw new Error("User Not Found")
            }
           
        } catch (error) {
            console.error("Error in lockAccountInDB", error)
        }
        
    }

    async resetFailedAttempts(username:string){
        try {
            await resetFailedAttemptsInDb(username)
        } catch (error) {
            console.error("Error in resetFailedAttemptsInDb", error)
        }
    }

    async getAllUsers():Promise<User[]>{
        try {
            return await getAllUsersFromDb()
        } catch (error) {
            console.error("Error in getAllUsersFromDb")
            throw error
        }
    }

    async getLockedUserByUserName(username:string){
        try {
            const user=await getLockedUserByUserName(username);
            return user
        } catch (error) {
            console.error("Error in getLockedUserByUserName",error)
            throw error
        }
    }
}

