import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtokenService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateJwt(username: string): string {
        const payload: VerificationTokenPayload  = { username, id: uuidv4() };
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
    id: string;
}