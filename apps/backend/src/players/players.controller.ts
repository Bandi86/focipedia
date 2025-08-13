import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  create(@Body() createPlayerDto: any) {
    return this.playersService.create(createPlayerDto);
  }

  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlayerDto: any) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
