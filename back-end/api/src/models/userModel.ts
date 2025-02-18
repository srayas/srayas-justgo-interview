import pool from '../utils/db';

export interface User {
  id?:number
  username: string;
  password?: string;
  failed_attempts: number;
  locked: boolean;
  role:string;
  mobileNumber:string;
}

export const getUserDetailsByUsername = async (username: string): Promise<User | null> => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 OR mobile_number = $2', [username, username]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getUserDetailsByUsername", error);
    throw error;
  }
};

export const updateFailedAttemptsInDb = async (username: string, attempts: number): Promise<void> => {
  try {
    await pool.query('UPDATE users SET failed_attempts = $1 WHERE username = $2', [attempts, username]);
  } catch (error) {
    console.error("updateFailedAttemptsInDb",error)
    throw error
  }
};

export const lockAccountInDB = async (id: string): Promise<void> => {
  try {
    await pool.query('UPDATE users SET locked = TRUE WHERE id = $1', [id]);
  } catch (error) {
    console.error("Error in lockAccountInDB",error)
    throw error
  }
};
export const unLockAccountInDB =async (id: string): Promise<void> => {
  try {
    await pool.query('UPDATE users SET locked = FALSE WHERE id = $1', [id]);
  } catch (error) {
    console.error("Error in unLockAccountInDB",error)
    throw error
  }
};

export const resetFailedAttemptsInDb = async (username: string): Promise<void> => {
 try {
   await pool.query('UPDATE users SET failed_attempts = 0 WHERE username = $1', [username]);
 } catch (error) {
  console.error("resetFailedAttemptsInDb",error);
  throw error
 }
};

export const getAllUsersFromDb = async (): Promise<User[]> => {
  try {
    const result = await pool.query('SELECT * FROM users ');
    if (result && result.rows) {
      return result.rows.map((user:User)=>{
        return{
          id:user.id,
          username:user.username,
          mobileNumber:user.mobileNumber,
          role:user.role,
          locked:user.locked,
          failed_attempts:user.failed_attempts
        }
      });
    } else {
      return [];
    }
  } catch (error) {
    console.error("getAllUsersFromDb", error);
   throw error
  }
};

export const getLockedUserByUserName=async(username:string)=>{
  try {
    const result = await pool.query('SELECT FROM users WHERE locked= TRUE AND  username = $1', [username])
    return result.rows[0] || null;
  } catch (error) {
    console.error("getLockedUserByUserName", error);
    throw error
  }
}

