import { compare } from 'bcryptjs';
import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../config/auth';

import AppError from '../errors/AppError';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

// Vamos autenticar a tentativa de login
class AuthenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    // instanciamos a tabela de Users
    const usersRepository = getRepository(User);

    // Verificamos se há usuario com o email que foi mandado no request
    const user = await usersRepository.findOne({
      where: { email },
    });

    // Caso não haja devolvemos um erro
    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    // Se houver o user passamos para a validação da senha
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    // Usuário autenticado
    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
