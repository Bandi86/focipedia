import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Post()
  create(@Body() createTransferDto: any) {
    return this.transfersService.create(createTransferDto);
  }

  @Get()
  findAll() {
    return this.transfersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transfersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTransferDto: any) {
    return this.transfersService.update(id, updateTransferDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transfersService.remove(id);
  }
}
