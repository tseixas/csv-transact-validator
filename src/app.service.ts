import { Injectable } from '@nestjs/common';
import { ResponseOperation, Upload } from './app.interface';

const MAX_AMOUNT = 5000000;
const MSG_NEGATIVE = 'Negativo';
const MSG_DUPLICATE = 'Duplicado';
const MSG_SUSPECT = 'Valor suspeito';

function checkDuplicates(data: ResponseOperation[]): ResponseOperation[] {
  const duplicateList = new Set();
  const response: ResponseOperation[] = [];

  for (const item of data) {
    const key = `${item.from}-${item.to}-${item.amount}`;
    const isDuplicate = duplicateList.has(key);

    response.push({
      ...item,
      message: isDuplicate ? MSG_DUPLICATE : item.message,
    });

    if (!isDuplicate) {
      duplicateList.add(key);
    }
  }

  return response;
}

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

      // Invalidos: negativos, duplicados
      // Validos: suspeitos

      console.log('duplicates: ', duplicates);

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

        // duplicates.add(lineData);
      } else {
        responseValid.push({
          from: from,
          to: to,
          amount: amountValue,
          message: info,
        });
      }

      console.log('message: ', info);
      console.log('has_negativo: ', info === MSG_NEGATIVE);
      console.log('has_duplicado: ', info === MSG_DUPLICATE);
      console.log('==============================');
    }

    return {
      valid: checkDuplicates(responseValid),
      invalid: checkDuplicates(responseInvalid),
    };
  }
}
