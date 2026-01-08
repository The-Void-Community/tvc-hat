import type { Request } from "express";
import type { ChatSlug } from "@/v1/pipes/slug.pipe";

import { ChatCreateDto } from "./dto/chat-create.dto";
import { ChatUpdateDto } from "./dto/chat-update.dto";
import { RightsUpdateDto } from "./dto/rights-update.dto";

import { Public } from "@/decorators";
import { AuthGuard } from "@1/guards/auth/auth.guard";
import { ChatSlugPipe, SlugPipe } from "@/v1/pipes/slug.pipe";
import Hash from "@/v1/services/hash.service";

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
  Query,
  ParseArrayPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ROUTE, ROUTES } from "./chats.routes";
import { Service } from "./chats.service";
import { CacheTTL } from "@nestjs/cache-manager";

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
    summary: "Getting a chats by slugs",
  })
  @Get(ROUTES.GET_MANY)
  @Public()
  public getMany(
    @Query("slugs", new ParseArrayPipe({ items: String, separator: "," }))
    slugs: string[],
  ) {
    return this.service.getMany(slugs);
  }

  @ApiOperation({
    summary: "Getting a chat by slug",
  })
  @Get(ROUTES.GET_ONE)
  @CacheTTL(5)
  @Public()
  public getOne(
    @Req() req: Request,
    @Param("slug", ChatSlugPipe) slug: ChatSlug,
  ) {
    if (slug.type === "me") {
      const { profileId } = Hash.parseOrThrow(req);
      return this.service.getUserChats(profileId);
    }

    return this.service.getOne(slug.value);
  }

  @ApiOperation({
    summary: "Creaing a chat",
  })
  @Post(ROUTES.POST)
  public post(
    @Req() req: Request,
    @Body() data: ChatCreateDto,
  ) {
    const { profileId } = Hash.parseOrThrow(req);

    return this.service.post(data, profileId);
  }

  @ApiOperation({
    summary: "Updating a chat",
  })
  @Put(ROUTES.PUT)
  public put(
    @Req() req: Request,
    @Param("slug", ChatSlugPipe) slug: ChatSlug,
    @Body(new ValidationPipe()) data: ChatUpdateDto,
  ) {
    const { profileId } = Hash.parseOrThrow(req);
    
    return this.service.put(SlugPipe.resolve(req, slug), data, profileId);
  }

  @ApiOperation({
    summary: "Updating a chat",
  })
  @Patch(ROUTES.PATCH)
  public patch(
    @Req() req: Request,
    @Param("slug", ChatSlugPipe) slug: ChatSlug,
    @Body(new ValidationPipe()) data: ChatUpdateDto,
  ) {
    const { profileId } = Hash.parseOrThrow(req);
    return this.service.patch(SlugPipe.resolve(req, slug), data, profileId);
  }

  @ApiOperation({
    summary: "Updating user rights in chat",
  })
  @Patch(ROUTES.PATCH_RIGHTS)
  public patchRights(
    @Req() req: Request,
    @Param("slug", ChatSlugPipe) slug: ChatSlug,
    @Body(new ValidationPipe()) data: RightsUpdateDto,
  ) {
    const { profileId } = Hash.parseOrThrow(req);
    return this.service.patchRights(SlugPipe.resolve(req, slug), data, profileId);
  }

  @ApiOperation({
    summary: "Updating members in chat",
  })
  @Patch(ROUTES.PATCH_JOIN)
  public patchJoin(@Req() req: Request, @Param("slug", ChatSlugPipe) slug: ChatSlug) {
    const { profileId } = Hash.parseOrThrow(req);
    return this.service.patchJoin(SlugPipe.resolve(req, slug), profileId);
  }

  @ApiOperation({
    summary: "Deleting a chat",
  })
  @Delete(ROUTES.DELETE)
  public delete(@Req() req: Request, @Param("slug", ChatSlugPipe) slug: ChatSlug) {
    const { profileId } = Hash.parseOrThrow(req);
    return this.service.delete(SlugPipe.resolve(req, slug), profileId);
  }
}
