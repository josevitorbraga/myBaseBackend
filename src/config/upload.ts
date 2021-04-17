import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');
// Utilizamos o multer para upload de arquivos

export default {
  directory: tmpFolder,
  // passamos o tipo do storage, no caso será no meu disco
  storage: multer.diskStorage({
    // destino onde serão salvos os arquivos upados
    // utilizamos o modulo path para que não ocorra erro em outros SOs
    destination: tmpFolder,

    // o parametro filename é uma func que recebe 3 parametros
    filename: (request, file, callback) => {
      // vamos usar o crypto para gerar um hash aleatório que será colocado antes do nome do arq upado
      const fileHash = crypto.randomBytes(10).toString('hex');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
