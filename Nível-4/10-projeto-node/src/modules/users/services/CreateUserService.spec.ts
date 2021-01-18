import AppError from '@shared/errors/AppError';
import FakeusersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  // Deve ser capaz de criar um novo usuário
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeusersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  // Não deve ser capaz de criar um novo usuário com um e-mail já registrado
  it('should not be able to create a new user with an email already registered', async () => {
    const fakeUsersRepository = new FakeusersRepository();
    const createUser = new CreateUserService(fakeUsersRepository);

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@exemple.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
