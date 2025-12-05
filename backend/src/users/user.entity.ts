import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('persons')
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

  @Column({ type: "text", nullable: false })
  problem: string;

}
