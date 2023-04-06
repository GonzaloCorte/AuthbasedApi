import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express';
import { JwtokenService } from "src/jwtoken/jwtoken.service";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
    constructor(
        private jwtokenService: JwtokenService
        ) {
        super();
    }

    async canActivate(context: ExecutionContext):Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);
        //Supposing that always will return the username or throw an error
        const username = this.jwtokenService.decodeValidationToken(token);
        if (username) return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        
        return type == 'Bearer' ? token : undefined;
    }
}