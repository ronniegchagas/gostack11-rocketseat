// Adiciona nova tipagens
declare namespace Express {
  export interface Request {
    user: {
      id: string;
    }
  }
}
