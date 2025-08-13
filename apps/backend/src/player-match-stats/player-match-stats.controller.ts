import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PlayerMatchStatsService } from './player-match-stats.service';
import { CreatePlayerMatchStatDto } from './dto/create-player-match-stat.dto';
import { UpdatePlayerMatchStatDto } from './dto/update-player-match-stat.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('player-match-stats')
@Controller('player-match-stats')
export class PlayerMatchStatsController {
  constructor(private readonly playerMatchStatsService: PlayerMatchStatsService) {}

  @Post()
  create(@Body() createPlayerMatchStatDto: CreatePlayerMatchStatDto) {
    return this.playerMatchStatsService.create(createPlayerMatchStatDto);
  }

  @Get()
  findAll() {
    return this.playerMatchStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerMatchStatsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerMatchStatDto: UpdatePlayerMatchStatDto,
  ) {
    return this.playerMatchStatsService.update(id, updatePlayerMatchStatDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playerMatchStatsService.remove(id);
  }
}
