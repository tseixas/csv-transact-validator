import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
const path = require('path');

const MAX_AMOUNT = 5000000;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getFile(): Promise<string> {
    const filePath = path.resolve('./file.csv');
    const data = await readFile(filePath, 'utf-8');

    const duplicates = new Set();

    console.log(data);

    const lines = data.trim().split('\n');

    console.log(lines);

    for (const line of lines) {
      const [from, to, amountStr] = line.split(';');
      const amount = Number(amountStr);
      const lineData = `${from}-${to}-${amount}`;

      console.log(amount, MAX_AMOUNT);
      console.log(lineData);

      if (amount < 0) {
        console.log('valor negativo: ', amount);
      }

      if (duplicates.has(lineData)) {
        console.log('Operação duplicada', lineData);
      }

      if (amount > MAX_AMOUNT) {
        console.log('Valor suspeito', amount);
      }

      console.log('\n');
    }

    return 'teste';
  }
}
