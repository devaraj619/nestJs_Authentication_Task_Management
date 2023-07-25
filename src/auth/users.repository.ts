import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ConflictException, InternalServerErrorException, Logger, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from "./jwt-payload.interface";

export class UsersRepository extends Repository<User>{
    private logger = new Logger('UsersRepository', {timestamp: true});
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {
        super(userRepository.target, userRepository.manager, userRepository.queryRunner);
    }

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const {username, password} = authCredentialsDto;
        
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({
            username,
            password: hashedPassword
        })

        try {
            await this.save(user);
        } catch(error) {
            if(error.code === '23505') {
                //duplicate username
                throw new ConflictException('Username Already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
        const {username, password} = authCredentialsDto;
        const user = await this.userRepository.findOne({where: {username: username}});

        if(user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = {username};
            const accessToken = await this.jwtService.sign(payload);
            return { accessToken };
        } else {
            this.logger.error(`Failed to signIn`);
            throw new UnauthorizedException('Please check login credentials');
        }
    }
     
}