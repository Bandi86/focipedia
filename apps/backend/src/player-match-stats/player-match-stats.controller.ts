import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerMatchStatsService } from './player-match-stats.service';

@Controller('player-match-stats')
export class PlayerMatchStatsController {
  constructor(private readonly playerMatchStatsService: PlayerMatchStatsService) {}

  @Post()
  create(@Body() createPlayerMatchStatDto: any) {
    return this.playerMatchStatsService.create(createPlayerMatchStatDto);
  }

  @Get()
  findAll() {
    return this.playerMatchStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerMatchStatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerMatchStatDto: any) {
    return this.playerMatchStatsService.update(+id, updatePlayerMatchStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerMatchStatsService.remove(+id);
  }
}
