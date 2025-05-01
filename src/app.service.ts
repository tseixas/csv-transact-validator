import { Injectable } from '@nestjs/common';
import { ResponseOperation, Upload } from './app.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from './app.entity';
import { Repository } from 'typeorm';

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
  constructor(
    @InjectRepository(Operation)
    private readonly operationRepository: Repository<Operation>,
  ) {}

  async processFile(file): Promise<Upload> {
    const fileBuffer = file.buffer;
    const fileName = file.originalname;
    const data = fileBuffer.toString('utf-8');
    const lines = data.trim().split('\n');

    lines.shift();

    const responseValid: ResponseOperation[] = [];
    const responseInvalid: ResponseOperation[] = [];

    for (const line of lines) {
      const [from, to, amount] = line.split(';');
      const amountValue = Number(amount);
      let info = '';

      if (amountValue < 0) {
        info = MSG_NEGATIVE;
      }
      if (amountValue > MAX_AMOUNT) {
        info = MSG_SUSPECT;
      }
      if (info === MSG_NEGATIVE) {
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
      }
    }

    const response = {
      valid: checkDuplicates(responseValid),
      invalid: checkDuplicates(responseInvalid),
    };

    const payload = [
      ...response.valid.map((item) => ({ ...item, fileName })),
      ...response.invalid.map((item) => ({ ...item, fileName })),
    ];

    await this.operationRepository.save(payload);

    return response;
  }
}
