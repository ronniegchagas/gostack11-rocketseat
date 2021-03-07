import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  // Deve ser capaz de atualizar o avatar
  it('should be able to update avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const imageUpload = 'avatar.jpg';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: imageUpload,
    });

    expect(user.avatar).toBe(imageUpload);
  });

  // Não deve ser capaz de atualizar o avatar de um usuário não existente
  it('should not be able to update avatar from non existing user', async () => {
    const imageUpload = 'avatar.jpg';

    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFileName: imageUpload,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  // Deve deletar o avatar antigo ao atualizar o novo
  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const fileUpload = 'avatar1.jpg';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: fileUpload,
    });

    const newFileUpload = 'avatar2.jpg';

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: newFileUpload,
    });

    expect(deleteFile).toHaveBeenCalledWith(fileUpload);
    expect(user.avatar).toBe(newFileUpload);
  });
});
