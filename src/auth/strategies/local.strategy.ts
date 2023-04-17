import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({ passReqToCallback: true });
    }

    async validate(request: any, username: string, password: string): Promise<any> {
        // Cancel a 
        if (request.isAuthenticated()) {
            throw new BadRequestException('there is a session running in, first log out')
        }

        try {
            const user = await this.authService.validateUser(username, password)
            return user;
            
        }catch(err) {
            throw new UnauthorizedException(err.message);
        }
    }
}
