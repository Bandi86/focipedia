import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PlayerTrophiesService } from './player-trophies.service';
import { CreatePlayerTrophyDto } from './dto/create-player-trophy.dto';
import { UpdatePlayerTrophyDto } from './dto/update-player-trophy.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('player-trophies')
@Controller('player-trophies')
export class PlayerTrophiesController {
  constructor(private readonly playerTrophiesService: PlayerTrophiesService) {}

  @Post()
  create(@Body() createPlayerTrophyDto: CreatePlayerTrophyDto) {
    return this.playerTrophiesService.create(createPlayerTrophyDto);
  }

  @Get()
  findAll() {
    return this.playerTrophiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playerTrophiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerTrophyDto: UpdatePlayerTrophyDto,
  ) {
    return this.playerTrophiesService.update(id, updatePlayerTrophyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playerTrophiesService.remove(id);
  }
}
