import { Request, Response, Router } from 'express';

import AuthenticateUserService from '../services/authenticateUserService';

const sessionsRouter = Router();

interface UserView {
  id: string;
  name: string;
  password?: string; // acerta valor para não obrigatório para poder deletar
  email: string;
  created_at: Date;
  updated_at: Date;
}

interface UserMapView {
  user: UserView;
  token: string;
}

sessionsRouter.post('/', async (request: Request, response: Response) => {
  const { email, password } = request.body;

  const authenticateUser = new AuthenticateUserService();

  // Utiliza uma nova interface para poder deletar a senha
  const { user, token }: UserMapView = await authenticateUser.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRouter;
