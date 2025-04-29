import { Injectable } from '@nestjs/common';

import { readFile } from 'fs/promises';
const path = require('path');

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getFile(): Promise<string> {
    const filePath = path.resolve('./file.csv');
    const data = await readFile(filePath, 'utf-8');

    console.log(data);

    const lines = data.trim().split('\n');

    console.log(lines);

    for (const line of lines) {
      const [amountStr] = line.split(';');
      const amount = Number(amountStr);

      console.log(amount);
    }

    return 'teste';
  }
}
