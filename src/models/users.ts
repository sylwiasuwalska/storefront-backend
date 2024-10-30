import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password: string;
};

export type CreatedUser = {
  id?: number;
  first_name: string;
  last_name: string;
  password_digest: string;
};

const pepper = process.env.PEPPER;
const saltRounds = parseInt(process.env.SALT_ROUNDS ?? '10');

export class UserStore {
  async index(): Promise<Omit<User, 'password'>[]> {
    try {
      const connection = await Client.connect();

      const sql = 'SELECT id, first_name, last_name from users';

      const result = await connection.query(sql);

      connection.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get users: ${error}.`);
    }
  }

  async show(id: number): Promise<Omit<User, 'password'>> {
    try {
      const sql = 'SELECT id, first_name, last_name FROM users WHERE id=($1)';

      const connection = await Client.connect();

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`);
    }
  }

  async create(user: Omit<User, 'id'>): Promise<CreatedUser> {
    try {
      const sql =
        'INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING *';

      const connection = await Client.connect();
      const hash = bcrypt.hashSync(user.password + pepper, saltRounds);
      const result = await connection.query<CreatedUser>(sql, [
        user.first_name,
        user.last_name,
        hash,
      ]);
      const createdUser = result.rows[0] as CreatedUser;

      connection.release();

      return createdUser;
    } catch (err) {
      throw new Error(
        `Could not add new user ${user.first_name} ${user.last_name}. Error: ${err}`
      );
    }
  }
}
