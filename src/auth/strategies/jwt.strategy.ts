import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        });
    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.username);
        if (!user) {
            throw new UnauthorizedException();
        }
    }
}