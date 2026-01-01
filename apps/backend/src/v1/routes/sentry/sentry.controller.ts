import {
  Controller as NestController,
  Get,
  Injectable,
  HttpException,
  Query,
  HttpStatus,
} from "@nestjs/common";

import { ROUTE, ROUTES } from "./sentry.routes";

import { logger } from "@sentry/nestjs";
import { ApiOperation } from "@nestjs/swagger";

@Injectable()
@NestController(ROUTE)
export class Controller {
  @Get(ROUTES.GET)
  @ApiOperation({ summary: "Using a `logger.info` from `@sentry/nestjs`" })
  public get() {
    logger.info("Hello", { string: "World" });

    return "Hello, World!";
  }

  @Get(ROUTES.GET_ERROR)
  @ApiOperation({ summary: "Testing an error for sentry" })
  public getError() {
    throw new Error("Test error for sentry");
  }

  @Get(ROUTES.GET_HTTP)
  @ApiOperation({ summary: "Testing an `HttpExeption` from sentry" })
  public getHttp(@Query("status") status?: string) {
    if (!status) {
      throw new HttpException("Not found TEST", HttpStatus.NOT_FOUND);
    }

    throw new HttpException("Exeption TEST", +status);
  }
}

export default Controller;
