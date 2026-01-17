import type { NextFunction, Request, Response } from "express";

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Next,
  Req,
  Res,
} from "@nestjs/common";

import { ROUTE, ROUTES } from "./auth.routes";

import env from "f@/env";

import Hash from "@1/services/hash.service";
import AuthService from "@1/services/auth.service";

import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PrismaService } from "@/database/prisma.service";

import { compressToEncodedURIComponent } from "lz-string";

@Injectable()
@Controller(ROUTE)
@ApiResponse({
  status: HttpStatus.OK,
  description: "Ok",
})
@ApiResponse({
  status: HttpStatus.FOUND,
  description: "Redirecting",
})
@ApiResponse({
  status: HttpStatus.BAD_REQUEST,
  description: "Redirecting",
})
export class AuthController {
  public constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "getting all authentication methods" })
  public printMethods() {
    const { abbreviations, methods } = AuthService.methods;
    const toStr = (str: unknown) => JSON.stringify(str, undefined, 4);

    return {
      message: `Sorry, but you can't auth without method, try next methods:\n${toStr(methods)}\nAnd this abbreviations:\n${toStr(abbreviations)}`,
      abbreviations,
      methods,
    };
  }

  @Get(ROUTES.GET)
  @ApiOperation({ summary: "redirecting to authentication system" })
  public async auth(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    if (req.params.method !== "@me") {
      return new AuthService(req.params.method).auth(req, res, next);
    }

    const { successed, id, profileId } = Hash.parse(req);
    if (!successed) {
      throw new HttpException("Bad code", HttpStatus.UNAUTHORIZED);
    }

    const auth = await this.prisma.authUser.findUnique({ where: { id } });
    const user = await this.prisma.user.findUnique({
      where: { id: profileId },
    });

    return res.status(200).send({ auth, user });
  }

  @Get(ROUTES.GET_CALLBACK)
  @ApiOperation({ summary: "callback from authentication system" })
  public callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return new AuthService(req.params.method).callback(
      req,
      res,
      next,
      (...args) => {
        const data = args[0];
        if (!data) {
          return res.send(500);
        }

        const { auth } = data;
        if (!auth) {
          return res.send(500);
        }

        const token = compressToEncodedURIComponent(
          JSON.stringify({
            id: auth.id,
            profileId: auth.profileId,
            accessToken: new Hash().execute(auth.accessToken),
          }),
        );

        res.redirect(env.CLIENT_URL + `?token=${token}`);
      },
    );
  }
}

export default AuthController;
