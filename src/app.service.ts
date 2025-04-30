import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
import { Upload } from './app.interface';
const path = require('path');

const MAX_AMOUNT = 5000000;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getFile(): Promise<Upload> {
    const filePath = path.resolve('./file.csv');
    const data = await readFile(filePath, 'utf-8');

    const duplicates = new Set();

    console.log(data);

    const lines = data.trim().split('\n');

    console.log(lines);

    const responseSuccess = [];
    const responseInvalid = [];
    const response: Upload = {
      valid: [],
      invalid: [],
    };

    for (const line of lines) {
      const [from, to, amountStr] = line.split(';');
      const amount = Number(amountStr);
      const lineData = `${from}-${to}-${amount}`;

      console.log(amount, MAX_AMOUNT);
      console.log(lineData);

      const info = [];

      if (amount < 0) {
        console.log('valor negativo: ', amount);
        info.push('negativo');
      } else if (duplicates.has(lineData)) {
        console.log('Operação duplicada', lineData);
        info.push('duplicado');
      } else if (amount > MAX_AMOUNT) {
        console.log('Valor suspeito', amount);
        info.push('valor suspeito');
      } else {
        duplicates.add(lineData);
      }

      console.log('info', info);
      console.log('has_negativo: ', info.includes('negativo'));
      console.log('has_duplicado: ', info.includes('duplicado'));
    }

    console.log('responseSuccess: ', responseSuccess);
    console.log('responseInvalid: ', responseInvalid);

    return response;
  }
}
