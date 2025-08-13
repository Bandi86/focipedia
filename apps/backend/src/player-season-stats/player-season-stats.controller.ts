import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlayerSeasonStatsService } from './player-season-stats.service';

@Controller('player-season-stats')
export class PlayerSeasonStatsController {
  constructor(private readonly playerSeasonStatsService: PlayerSeasonStatsService) {}

  @Post()
  create(@Body() createPlayerSeasonStatDto: any) {
    return this.playerSeasonStatsService.create(createPlayerSeasonStatDto);
  }

  @Get()
  findAll() {
    return this.playerSeasonStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerSeasonStatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlayerSeasonStatDto: any) {
    return this.playerSeasonStatsService.update(+id, updatePlayerSeasonStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playerSeasonStatsService.remove(+id);
  }
}
