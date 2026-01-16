import type { Request } from "express";

import { Reflector } from "@nestjs/core";
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

import { logger } from "@sentry/nestjs";

import PrismaService from "@/database/prisma.service";
import Service from "./auth-guard.service";

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      "isPublic",
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    try {
      const data = await Service.validateRequest(request, this.prisma);
      return data;
    } catch (error) {
      logger.error(error, {
        hostname: request.hostname,
        body: request.body,
      });
      return false;
    }
  }
}

export default AuthGuard;
