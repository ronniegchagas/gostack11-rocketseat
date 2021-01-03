import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(request: Request, response: Response){
  const user = createUser({
    name: 'Ronnie',
    email:'ronniegchagas@gmail.com',
    password: '123456',
    techs: [
      'ReactJS',
      '.NET',
      'Node',
      {
        title: 'Javascript', 'experience': 80
      },
      {
        title: '.NET', 'experience': 70
      },
      {
        title: 'PHP', 'experience': 80
      },
    ],
  });

  return response.json({ message: 'Hello World' });
}