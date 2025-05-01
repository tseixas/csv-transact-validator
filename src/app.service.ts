import { Injectable } from '@nestjs/common';
import { Upload } from './app.interface';

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

    console.log('==>', fileBuffer.toString('utf-8'));
    console.log('fileName: ', fileName);

    const duplicates = new Set();

    // console.log(data);

    const lines = data.trim().split('\n');

    // console.log(lines);

    const responseValid = [];
    const responseInvalid = [];
    const response: Upload = {
      valid: [],
      invalid: [],
    };

    for (const line of lines) {
      const [from, to, amountStr] = line.split(';');
      const amount = Number(amountStr);
      const lineData = `${from}-${to}-${amount}`;

      // console.log(amount, MAX_AMOUNT);
      // console.log(lineData);

      const info = [];

      if (amount < 0) {
        info.push(MSG_NEGATIVE);
      } else if (duplicates.has(lineData)) {
        info.push(MSG_DUPLICATE);
      } else if (amount > MAX_AMOUNT) {
        info.push(MSG_SUSPECT);
      } else if (info.includes(MSG_NEGATIVE) || info.includes(MSG_DUPLICATE)) {
        responseInvalid.push({
          from: from,
          to: to,
          amount: amount,
          msg: info,
        });
      } else {
        responseValid.push({
          from: from,
          to: to,
          amount: amount,
          msg: info,
        });
        duplicates.add(lineData);
      }

      console.log('info', info);
      console.log('has_negativo: ', info.includes(MSG_NEGATIVE));
      console.log('has_duplicado: ', info.includes(MSG_DUPLICATE));
    }

    console.log('responseValid: ', responseValid);
    console.log('responseInvalid: ', responseInvalid);

    return response;
  }
}
