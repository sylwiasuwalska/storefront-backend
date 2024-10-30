import { cleanupDatabase } from '../../cleanupDatabase';
import { User, UserStore } from '../users';

const store = new UserStore();

describe('User Model', () => {
  afterAll(async () => {
    await cleanupDatabase();
  });

  it('should have an index method', () => {
    expect(store.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(store.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(store.create).toBeDefined();
  });

  it('create method should add a user', async () => {
    const userMock: Omit<User, 'id' | 'password'> = {
      first_name: 'Lilla',
      last_name: 'Purple',
    };
    const result = await store.create({ ...userMock, password: 'password' });
    expect(result.id).toBeDefined();
    expect(result.id).toBeInstanceOf(Number);
    expect(result.first_name).toEqual(userMock.first_name);
    expect(result.last_name).toEqual(userMock.last_name);
    expect(result.password_digest).toBeInstanceOf(String);
  });

  it('index method should return a list of users', async () => {
    const user1: Omit<User, 'id' | 'password'> = {
      first_name: 'Jack',
      last_name: 'Blue',
    };
    const createdUser1 = await store.create({
      ...user1,
      password: 'password1',
    });
    const user2: Omit<User, 'id' | 'password'> = {
      first_name: 'Tom',
      last_name: 'Yellow',
    };
    const createdUser2 = await store.create({
      ...user2,
      password: 'password2',
    });
    const result = await store.index();
    expect(result).toContain({
      id: createdUser1.id,
      ...user1,
    });
    expect(result).toContain({
      id: createdUser2.id,
      ...user2,
    });
  });

  it('show method should return the correct user', async () => {
    const user: Omit<User, 'id' | 'password'> = {
      first_name: 'Amy',
      last_name: 'White',
    };
    const createdUser = await store.create({ ...user, password: 'password' });
    const result = await store.show(createdUser.id!);
    expect(result).toEqual({
      id: createdUser.id,
      ...user,
    });
  });
});
