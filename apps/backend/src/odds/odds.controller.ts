import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Post()
  create(@Body() createOddDto: any) {
    return this.oddsService.create(createOddDto);
  }

  @Get()
  findAll() {
    return this.oddsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oddsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOddDto: any) {
    return this.oddsService.update(+id, updateOddDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.oddsService.remove(+id);
  }
}
