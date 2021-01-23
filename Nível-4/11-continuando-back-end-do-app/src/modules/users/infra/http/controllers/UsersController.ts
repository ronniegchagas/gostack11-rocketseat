import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

interface IUserView {
  name: string;
  email: string;
  password?: string; // acerta valor para não obrigatório para poder deletar
}

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    // Utiliza uma nova interface para poder deletar a senha
    const user: IUserView = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  }
}
