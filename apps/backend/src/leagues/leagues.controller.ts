import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LeaguesService } from './leagues.service';

@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Post()
  create(@Body() createLeagueDto: any) {
    return this.leaguesService.create(createLeagueDto);
  }

  @Get()
  findAll() {
    return this.leaguesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.leaguesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateLeagueDto: any) {
    return this.leaguesService.update(id, updateLeagueDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaguesService.remove(id);
  }
}
