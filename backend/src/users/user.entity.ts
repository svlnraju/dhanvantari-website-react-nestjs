import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'persons' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  mobileNumber: string;
}
