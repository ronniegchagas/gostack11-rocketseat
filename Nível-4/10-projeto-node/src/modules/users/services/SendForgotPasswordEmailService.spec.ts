import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokenRepository from '@modules/users/repositories/fakes/FakeUserTokenRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  // Deve ser capaz de criar um novo usuário
  it('should be able to recovery the password using the e-mail', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@exemple.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  // Não deve ser capaz de recuperar uma senha de usuário inexistente
  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@exemple.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Deve gerar um token de esquecimento de senha
  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@exemple.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
