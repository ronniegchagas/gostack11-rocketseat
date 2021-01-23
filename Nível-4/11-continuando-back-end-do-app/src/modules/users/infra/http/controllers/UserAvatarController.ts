import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

interface IUserView {
  name: string;
  email: string;
  password?: string; // acerta valor para não obrigatório para poder deletar
}

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user: IUserView = await updateUserAvatarService.execute({
      // eslint-disable-next-line camelcase
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
}
