import type { NextFunction, Request, Response } from "express";

import {
  Controller as NestController,
  Get,
  HttpStatus,
  Injectable,
  Next,
  Param,
  Req,
  Res,
  Post,
  Body,
  Headers,
} from "@nestjs/common";

import { ROUTE, ROUTES } from "./auth.routes";

import Hash from "@1/services/hash.service";
import AuthService from "@1/services/auth.service";

import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { Service } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto/register.dto";

@Injectable()
@NestController(ROUTE)
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
export class Controller {
  public constructor(private readonly service: Service) {}

  @Get()
  @ApiOperation({ summary: "getting all authentication methods" })
  public printMethods() {
    const methods = this.service.getAllMethods();

    return {
      message: `Sorry, but you can't auth without method, try next methods:\n${methods.stringMethods}\nAnd this abbreviations:\n${methods.stringAbbreviations}`,
      abbreviations: methods.abbreviations,
      methods: methods.methods,
    };
  }

  @Post(ROUTES.SIGN_UP)
  @ApiOperation({ summary: "sign up by password" })
  public async signUp(
    @Body() body: SignUpDto,
    @Headers("password") password: string,
  ) {
    return this.service.postUser({
      nickname: body.nickname || body.username,
      username: body.username,
      password: password,
    });
  }

  @Get(ROUTES.SIGN_IN)
  @ApiOperation({ summary: "sign in by password" })
  public async signIn(
    @Body() body: SignInDto,
    @Headers("password") password: string,
  ) {
    return this.service.getUserByPassowrd({
      username: body.username,
      password: password,
    });
  }

  @Get(ROUTES.GET)
  @ApiOperation({ summary: "redirecting to authentication system" })
  public async auth(
    @Req() request: Request,
    @Res() response: Response,
    @Next() next: NextFunction,
    @Param("method") method: string,
  ) {
    if (method !== "@me") {
      return new AuthService(method).auth(request, response, next);
    }

    const { id, profileId } = Hash.parseOrThrow(request);
    const me = await this.service.getMe(id, profileId);
    return response.send(me);
  }

  @Get(ROUTES.GET_CALLBACK)
  @ApiOperation({ summary: "callback from authentication system" })
  public callback(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param("method") method: string,
  ) {
    return new AuthService(method).callback(req, res, next, (...args) => {
      const data = args[1];

      try {
        const redirectUrl = this.service.getRedirectString(data);
        return res.redirect(redirectUrl);
      } catch (error) {
        return res.status(500).send(error);
      }
    });
  }
}

export default NestController;
