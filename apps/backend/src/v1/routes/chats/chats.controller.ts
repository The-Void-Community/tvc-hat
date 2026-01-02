import type { Request } from "express";

import { ChatCreateDto } from "./dto/chat-create.dto";
import { ChatUpdateDto } from "./dto/chat-update.dto";
import { RightsUpdateDto } from "./dto/rights-update.dto";

import { Public } from "@/decorators";
import { AuthGuard } from "@1/guards/auth/auth.guard";

import {
  Controller as NestController,
  Injectable,
  Get,
  Param,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  ValidationPipe,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ROUTE, ROUTES } from "./chats.routes";
import { Service } from "./chats.service";
import Hash from "@/v1/services/hash.service";

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
    summary: "Getting a chat by slug",
  })
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(@Param("slug") slug: string) {
    return this.service.getOne(slug);
  }

  @ApiOperation({
    summary: "Creaing a chat",
  })
  @Post(ROUTES.POST)
  public post(
    @Req() req: Request,
    @Body(new ValidationPipe()) data: ChatCreateDto,
  ) {
    const { profileId } = Hash.parseWithExeption(req);

    return this.service.post(data, profileId);
  }

  @ApiOperation({
    summary: "Updating a chat",
  })
  @Put(ROUTES.PUT)
  public put(
    @Req() req: Request,
    @Param("slug") slug: string,
    @Body(new ValidationPipe()) data: ChatUpdateDto,
  ) {
    const { profileId } = Hash.parseWithExeption(req);
    return this.service.put(slug, data, profileId);
  }

  @ApiOperation({
    summary: "Updating a chat",
  })
  @Patch(ROUTES.PATCH)
  public patch(
    @Req() req: Request,
    @Param("slug") slug: string,
    @Body(new ValidationPipe()) data: ChatUpdateDto,
  ) {
    const { profileId } = Hash.parseWithExeption(req);
    return this.service.patch(slug, data, profileId);
  }

  @ApiOperation({
    summary: "Updating user rights",
  })
  @Patch(ROUTES.PATCH_RIGHTS)
  public patchRigts(
    @Req() req: Request,
    @Param("slug") slug: string,
    @Body(new ValidationPipe()) data: RightsUpdateDto,
  ) {
    const { profileId } = Hash.parseWithExeption(req);
    return this.service.patchRights(slug, data, profileId);
  }

  @ApiOperation({
    summary: "Deleting a chat",
  })
  @Delete(ROUTES.DELETE)
  public delete(@Req() req: Request, @Param("slug") slug: string) {
    const { profileId } = Hash.parseWithExeption(req);
    return this.service.delete(slug, profileId);
  }
}
