import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('list')
  list() {
    return this.service.findAll();
  }

  @Post('add')
async add(@Body() body: CreateUserDto) {
  console.log('📩 Received data from frontend:', body);
  await this.service.create(body);
  return { message: 'Data inserted successfully' };
}


  @Put('update/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    await this.service.update(id, body);
    return { message: 'Person updated successfully' };
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { message: 'Person deleted successfully' };
  }
}
