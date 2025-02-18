import pool from '../utils/db';

export interface Token {
  user_id: string;
  token: string;
  expires_at: Date;
}

export const createToken = async (user_id: string, token: string, expiresAt: Date): Promise<void> => {
 try {
   await pool.query('INSERT INTO tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [user_id, token, expiresAt]);
 } catch (error) {
    console.error("Error in createToken",error)
    throw error
 }
};

export const getTokenByTokenValueFromDb = async (token: string): Promise<Token | null> => {
  try {
    const result = await pool.query('SELECT * FROM tokens WHERE token = $1', [token]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getTokenByTokenValueFromDb",error)
    throw error
  }
};

export const getTokenByTokenValueFromDbByUserId = async (user_id: string): Promise<Token | null> => {
  try {
    const result = await pool.query('SELECT * FROM tokens WHERE user_id = $1', [user_id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("getTokenByTokenValueFromDb",error)
    throw error
  }
};


export const deleteToken = async (user_id: string): Promise<void> => {
  try {
    await pool.query('DELETE FROM tokens WHERE user_id = $1', [user_id]);
  } catch (error) {
    console.error("Error in deleteToken",error);
    throw error
  }
};
