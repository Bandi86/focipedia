import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PlayerSeasonStatsService } from './player-season-stats.service';
import { CreatePlayerSeasonStatDto } from './dto/create-player-season-stat.dto';
import { UpdatePlayerSeasonStatDto } from './dto/update-player-season-stat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('player-season-stats')
@Controller('player-season-stats')
export class PlayerSeasonStatsController {
  constructor(private readonly playerSeasonStatsService: PlayerSeasonStatsService) {}

  @Post()
  create(@Body() createPlayerSeasonStatDto: CreatePlayerSeasonStatDto) {
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerSeasonStatDto: UpdatePlayerSeasonStatDto,
  ) {
    return this.playerSeasonStatsService.update(id, updatePlayerSeasonStatDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playerSeasonStatsService.remove(id);
  }
}
