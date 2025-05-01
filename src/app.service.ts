import { Injectable } from '@nestjs/common';
import { ResponseOperation, Upload } from './app.interface';

const MAX_AMOUNT = 5000000;
const MSG_NEGATIVE = 'Negativo';
const MSG_DUPLICATE = 'Duplicado';
const MSG_SUSPECT = 'Valor suspeito';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async processFile(file): Promise<Upload> {
    const fileBuffer = file.buffer;
    const fileName = file.originalname;
    const data = fileBuffer.toString('utf-8');
    const lines = data.trim().split('\n');

    lines.shift();

    console.log('data: ', data);
    console.log('fileName: ', fileName);

    const duplicates = new Set();
    const responseValid: ResponseOperation[] = [];
    const responseInvalid: ResponseOperation[] = [];

    for (const line of lines) {
      const [from, to, amount] = line.split(';');
      const amountValue = Number(amount);
      const lineData = `${from}-${to}-${amount}`;

      console.log('\n');
      console.log(amount, MAX_AMOUNT);
      console.log('lineData: ', lineData);

      let info = '';

      if (amountValue < 0) {
        info = MSG_NEGATIVE;
      }
      if (duplicates.has(lineData)) {
        info = MSG_DUPLICATE;
      }
      if (amountValue > MAX_AMOUNT) {
        info = MSG_SUSPECT;
      }
      if (info === MSG_NEGATIVE || info === MSG_DUPLICATE) {
        responseInvalid.push({
          from: from,
          to: to,
          amount: amountValue,
          message: info,
        });
      } else {
        responseValid.push({
          from: from,
          to: to,
          amount: amountValue,
          message: info,
        });

        duplicates.add(lineData);
      }

      console.log('info', info);
      console.log('has_negativo: ', info.includes(MSG_NEGATIVE));
      console.log('has_duplicado: ', info.includes(MSG_DUPLICATE));
      console.log('==============================');
    }

    console.log('responseValid: ', responseValid);
    console.log('responseInvalid: ', responseInvalid);

    return {
      valid: responseValid,
      invalid: responseInvalid,
    };
  }
}
