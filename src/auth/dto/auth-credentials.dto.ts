import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthCredentialsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(8)
    username: string;

    @IsString()
    @MinLength(3)
    @MaxLength(8)
    password: string;
}