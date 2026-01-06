import type { MessageUpdateDto } from "./dto/message-update.dto";

import { Public } from "@/decorators";
import { AuthGuard } from "@1/guards/auth/auth.guard";

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
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { ROUTE, ROUTES } from "./messages.routes";
import { Service } from "./messages.service";

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
    summary: "Getting an array of message",
  })
  @Get(ROUTES.GET)
  @Public()
  public async get(
    @Query("chatId") chatId: string,
    @Query("skip") skip?: string,
    @Query("count") count?: string,
    @Query("positionMessageId") positionMessageId?: string,
  ) {
    return this.service.get({
      skip: skip ? +skip : 0,
      count: count ? +count : 10,
      positionMessageId,
      chatId,
    });
  }

  @ApiOperation({
    summary: "Getting a message by id",
  })
  @Get(ROUTES.GET_ONE)
  @Public()
  public getOne(@Param("id") id: string) {
    return this.service.getOne(id);
  }

  @ApiOperation({
    summary: "Updating a message",
  })
  @Put(ROUTES.PUT)
  public put(@Param("id") id: string, @Body() data: MessageUpdateDto) {
    return this.service.put(id, data);
  }

  @ApiOperation({
    summary: "Updating a message",
  })
  @Patch(ROUTES.PATCH)
  public patch(@Param("id") id: string, @Body() data: MessageUpdateDto) {
    return this.service.patch(id, data);
  }

  @ApiOperation({
    summary: "Deleting a message",
  })
  @Delete(ROUTES.DELETE)
  public delete(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
