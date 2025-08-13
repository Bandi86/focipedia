import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerSeasonStatsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlayerSeasonStatDto: any) {
    return this.playerSeasonStatsService.update(id, updatePlayerSeasonStatDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playerSeasonStatsService.remove(id);
  }
}
