import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

interface IUserView {
  id: string;
  name: string;
  password?: string; // acerta valor para não obrigatório para poder deletar
  email: string;
  created_at: Date;
  updated_at: Date;
}

interface IUserMapView {
  user: IUserView;
  token: string;
}

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    // Utiliza uma nova interface para poder deletar a senha
    const { user, token }: IUserMapView = await authenticateUser.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  }
}
