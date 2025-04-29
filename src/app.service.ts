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
    const data = await readFile(filePath);

    console.log(data);

    return 'teste';
  }
}
