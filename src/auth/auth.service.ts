import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
   
  ) {}
  async create(createAuthDto: CreateAuthDto): Promise<User> {  
    try { 
      const { password } = createAuthDto;
      const hachedPassword = await bcrypt.hash(password, 10);
     
      const newUser = await this.userRepository.save(
        this.userRepository.create({ ...createAuthDto, password: hachedPassword })
     );
     const { email, fullName } = newUser;

     return ({
       email,
       fullName
     } as User);

   } catch (error) {
      this.handleErrorDB(error);
   }
  }
  async login(loginDto: LoginDto): Promise<User> {  
    try { 
      const { password } = loginDto;
      const comparedPassword = await bcrypt.compare(password, loginDto.password);
     
     // if( !comparedPassword ) throw new BadRequestException('Invalid credentials');
     
      const { email, fullName } = loginDto;
      return ({
        email,
        fullName
      } as User);
    
      

   } catch (error) {
      this.handleErrorDB(error);
   }
  }

  async findAll() : Promise<User[]> {
    return await this.userRepository.find();
    
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  private handleErrorDB = ( error: any ):never => {
    if ( error.code === '23505' ) throw new BadRequestException(error.detail);
   // if ( error.code === '400' ) throw new BadRequestException(error.detail);
    
     console.log("error::", error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
