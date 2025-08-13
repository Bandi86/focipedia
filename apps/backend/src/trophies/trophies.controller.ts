import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { TrophiesService } from './trophies.service';

@Controller('trophies')
export class TrophiesController {
  constructor(private readonly trophiesService: TrophiesService) {}

  @Post()
  create(@Body() createTrophyDto: any) {
    return this.trophiesService.create(createTrophyDto);
  }

  @Get()
  findAll() {
    return this.trophiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.trophiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTrophyDto: any) {
    return this.trophiesService.update(id, updateTrophyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.trophiesService.remove(id);
  }
}
