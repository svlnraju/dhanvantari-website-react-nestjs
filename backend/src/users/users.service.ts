import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  /** PAGINATION + SORT */
  async findAll(page = 1, sort: string = "newest") {
    const pageSize = 10;

    const orderMap: Record<string, any> = {
      newest: { id: "DESC" },
      oldest: { id: "ASC" },
      fname_asc: { firstName: "ASC" },
      fname_desc: { firstName: "DESC" },
      lname_asc: { lastName: "ASC" },
      lname_desc: { lastName: "DESC" },
      age_asc: { age: "ASC" },
      age_desc: { age: "DESC" },
    };

    const order = orderMap[sort] ?? { id: "DESC" };

    const [items, total] = await this.repo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order,
    });

    return { items, total, page };
  }

  /** CRUD */
  async create(data: CreateUserDto) {
    return await this.repo.save(this.repo.create(data));
  }

  async update(id: number, data: UpdateUserDto) {
    const result = await this.repo.update(id, data);
    if (!result.affected) throw new NotFoundException("User not found");
    return true;
  }

  async remove(id: number) {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException("User not found");
    return true;
  }

  /** 🔥 GET ALL USERS export */
  async exportAll(sort = "newest") {
    const orderRules: any = {
      newest: { id: "DESC" },
      oldest: { id: "ASC" },
      fname_asc: { firstName: "ASC" },
      fname_desc: { firstName: "DESC" },
      lname_asc: { lastName: "ASC" },
      lname_desc: { lastName: "DESC" },
      age_asc: { age: "ASC" },
      age_desc: { age: "DESC" },
    };

    const order = orderRules[sort] ?? { id: "DESC" };
    const users = await this.repo.find({ order });

    return this.generateExcel(users);
  }

  /** 🔥 EXPORT CURRENT PAGE ONLY */
  async exportPage(page = 1, sort = "newest") {
    const pageSize = 10;

    const orderRules: any = {
      newest: { id: "DESC" },
      oldest: { id: "ASC" },
      fname_asc: { firstName: "ASC" },
      fname_desc: { firstName: "DESC" },
      lname_asc: { lastName: "ASC" },
      lname_desc: { lastName: "DESC" },
      age_asc: { age: "ASC" },
      age_desc: { age: "DESC" },
    };

    const order = orderRules[sort] ?? { id: "DESC" };

    const users = await this.repo.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order,
    });

    return this.generateExcel(users);
  }

  /** 🔐 COMMON Excel generator */
  private async generateExcel(users: User[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Patients");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "First Name", key: "firstName", width: 20 },
      { header: "Last Name", key: "lastName", width: 20 },
      { header: "Age", key: "age", width: 10 },
      { header: "Mobile Number", key: "mobileNumber", width: 20 },
      { header: "Problem", key: "problem", width: 40 },
    ];

    users.forEach((u) => sheet.addRow(u));

    return workbook.xlsx.writeBuffer();
  }
}
