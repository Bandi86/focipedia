import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerTrophiesService } from './player-trophies.service';

@Controller('player-trophies')
export class PlayerTrophiesController {
  constructor(private readonly playerTrophiesService: PlayerTrophiesService) {}

  @Post()
  create(@Body() createPlayerTrophyDto: any) {
    return this.playerTrophiesService.create(createPlayerTrophyDto);
  }

  @Get()
  findAll() {
    return this.playerTrophiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerTrophiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerTrophyDto: any) {
    return this.playerTrophiesService.update(+id, updatePlayerTrophyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerTrophiesService.remove(+id);
  }
}
