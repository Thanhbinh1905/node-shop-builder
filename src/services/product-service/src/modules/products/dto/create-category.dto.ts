import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateCategoryDTO {
    @IsUUID()
    @IsNotEmpty()
    merchant_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}