import type { Request } from "express";
import type { Slug } from "@/v1/pipes/slug.pipe";

import { UserUpdateDto } from "./dto/user-update.dto";

import { Public } from "@/decorators";
import { AuthGuard } from "@1/guards/auth/auth.guard";
import { SlugPipe, UserSlugPipe } from "@/v1/pipes/slug.pipe";

import {
  Controller as NestController,
  Injectable,
  Get,
  Param,
  Body,
  Put,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ROUTE, ROUTES } from "./users.routes";
import { Service } from "./users.service";

@Injectable()
@NestController(ROUTE)
@UseGuards(AuthGuard)
@ApiResponse({
  status: HttpStatus.OK,
  description: "Ok",
})
@ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "Not accesss to route",
})
@ApiResponse({
  status: HttpStatus.TOO_MANY_REQUESTS,
  description: `A large number of requests`,
})
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description:
    "Does not have an authentication token in headers (`headers.authorization`)",
})
export class Controller {
  public constructor(private readonly service: Service) {}

  @ApiOperation({
    summary: "Getting a user by slug",
  })
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(
    @Req() req: Request,
    @Param("slug", UserSlugPipe) slug: Slug<"username">,
  ) {
    return this.service.getOne(SlugPipe.resolve(req, slug));
  }

  @ApiOperation({
    summary: "Updating a user",
  })
  @Put(ROUTES.PUT)
  public put(
    @Req() req: Request,
    @Param("slug", UserSlugPipe) slug: Slug<"username">,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.service.put(SlugPipe.resolve(req, slug), userUpdateDto);
  }

  @ApiOperation({
    summary: "Updating a user",
  })
  @Patch(ROUTES.PATCH)
  public patch(
    @Req() req: Request,
    @Param("slug", UserSlugPipe) slug: Slug<"username">,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.service.patch(SlugPipe.resolve(req, slug), userUpdateDto);
  }

  @ApiOperation({
    summary: "Deleting a user",
  })
  @Delete(ROUTES.DELETE)
  public delete(
    @Req() req: Request,
    @Param("slug", UserSlugPipe) slug: Slug<"username">
  ) {
    return this.service.delete(SlugPipe.resolve(req, slug));
  }
}
