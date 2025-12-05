import { IsInt, IsNotEmpty, IsString, Matches, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @Min(1)
  @Max(120)
  age: number;

  @Transform(({ value }) => value.trim())
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: "Mobile number must be exactly 10 digits and numbers only" })
  mobileNumber: string;

  @IsString()
  @IsOptional()
  problem: string;

}
