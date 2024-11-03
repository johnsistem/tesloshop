import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateAuthDto {

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @MinLength(6)
   @IsNotEmpty()
   @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'The password must have a Uppercase, lowercase letter and a number' })
   password: string;

   @IsString()
   @IsNotEmpty()
   fullName: string;
}
