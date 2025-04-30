import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Upload } from './app.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  create(): Promise<Upload> {
    return this.appService.getFile();
  }
}
