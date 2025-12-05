import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('list')
  findAll(
    @Query('page') page: number = 1,
    @Query('sort') sort: string = "newest",
  ) {
    return this.service.findAll(+page, sort);
  }

  @Post('add')
  add(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateUserDto,
  ) {
    await this.service.update(id, body);
    return { message: "User updated successfully" };
  }

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
    return { message: "User deleted successfully" };
  }

  /** Export ALL */
  @Get("export/all")
  async exportAll(
    @Query("sort") sort: string = "newest",
    @Res() res,
  ) {
    const file = await this.service.exportAll(sort);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=patients_all.xlsx",
    );

    res.send(file);
  }

  /** Export current page */
  @Get("export/page")
  async exportPage(
    @Query("page") page: number = 1,
    @Query("sort") sort: string = "newest",
    @Res() res,
  ) {
    const file = await this.service.exportPage(+page, sort);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=patients_page_${page}.xlsx`,
    );

    res.send(file);
  }
}
