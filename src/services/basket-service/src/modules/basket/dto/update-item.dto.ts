import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateQtyDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  qty: number;
}