import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MatchEventsService } from './match-events.service';

@Controller('match-events')
export class MatchEventsController {
  constructor(private readonly matchEventsService: MatchEventsService) {}

  @Post()
  create(@Body() createMatchEventDto: any) {
    return this.matchEventsService.create(createMatchEventDto);
  }

  @Get()
  findAll() {
    return this.matchEventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.matchEventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMatchEventDto: any) {
    return this.matchEventsService.update(id, updateMatchEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchEventsService.remove(id);
  }
}
