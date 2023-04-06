import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtokenService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateJwt(username: string): string {
        const payload: VerificationTokenPayload  = { username };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
        });

        return token;
    }

    public async decodeValidationToken(token: string) {
        
        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
            });
            console.log(payload);
            if (typeof payload === 'object' && 'username' in payload) {
                return payload.username;
            }
            throw new BadRequestException();
        } catch(error) {
            if (error?.name === 'TokenExpiredError') {
                throw new BadRequestException('Email validation token has expired');
            }
            console.log(error)
            throw new NotFoundException('not found')
        }
    }
}

export interface VerificationTokenPayload {
    username: string;
}