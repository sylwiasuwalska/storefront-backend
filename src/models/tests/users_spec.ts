import { User, UserStore } from '../users';

const store = new UserStore();

const userMock: Omit<User, 'id'> = {
  firstName: 'Lilla',
  lastName: 'Purple',
  password: 'hashedPassword',
};

describe('User Model', () => {
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
    const result = await store.create(userMock);
    expect(result).toEqual({
      id: 1,
      ...userMock,
    });
  });

  it('index method should return a list of users', async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        ...userMock,
      },
    ]);
  });

  it('show method should return the correct user', async () => {
    const result = await store.show('1');
    expect(result).toEqual({
      id: 1,
      ...userMock,
    });
  });
});
