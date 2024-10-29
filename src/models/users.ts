import Client from '../database';

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const connection = await Client.connect();

      const sql = 'SELECT * from users';

      const result = await connection.query(sql);

      connection.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Cannot get users: ${error}.`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT id, firstName, lastName FROM users WHERE id=($1)';

      const connection = await Client.connect();

      const result = await connection.query(sql, [id]);

      connection.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find User ${id}. Error: ${err}`);
    }
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const sql =
        'INSERT INTO users (firstName, lastName, password ) VALUES($1, $2, $3, $4) RETURNING *';

      const connection = await Client.connect();

      const result = await connection.query(sql, [
        user.firstName,
        user.lastName,
        user.password,
      ]);

      const createdUser = result.rows[0] as User;

      connection.release();

      return createdUser;
    } catch (err) {
      throw new Error(
        `Could not add new user ${user.firstName} ${user.lastName}. Error: ${err}`
      );
    }
  }
}
