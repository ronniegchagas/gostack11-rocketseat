import { Request, Response, Router } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

const sessionsRouter = Router();

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

sessionsRouter.post('/', async (request: Request, response: Response) => {
  const { email, password } = request.body;

  const authenticateUser = container.resolve(AuthenticateUserService);

  // Utiliza uma nova interface para poder deletar a senha
  const { user, token }: IUserMapView = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
