import { Request, Response, Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import CreateUserService from '../services/createUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface UserView {
  name: string;
  email: string;
  password?: string; // acerta valor para não obrigatório para poder deletar
}

usersRouter.post('/', async (request: Request, response: Response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  // Utiliza uma nova interface para poder deletar a senha
  const user: UserView = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request, response) => {
  const updateUserAvatarService = new UpdateUserAvatarService();

  const user: UserView = await updateUserAvatarService.execute({
    userId: request.user.id,
    avatarFileName: request.file.filename,
  });

  delete user.password;

  return response.json(user);
});

export default usersRouter;
