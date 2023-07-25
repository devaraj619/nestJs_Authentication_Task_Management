import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { JwtService } from '@nestjs/jwt';
export declare class UsersRepository extends Repository<User> {
    private userRepository;
    private jwtService;
    private logger;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>;
    signIn(authCredentialsDto: AuthCredentialsDto): Promise<{
        accessToken: string;
    }>;
}
