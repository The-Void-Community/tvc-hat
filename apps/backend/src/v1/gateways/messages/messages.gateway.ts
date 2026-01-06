import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { HttpStatus, ValidationPipe } from "@nestjs/common";

import { PrismaService } from "@/database/prisma.service";

import { GATEWAY, GATEWAYS } from "./messages.gateways";
import { Service } from "./messages.service";

import { SendMessageDto } from "./dto/send-message.dto";

import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/chat",
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  public constructor(private readonly service: Service, private readonly prisma: PrismaService) {}

  @SubscribeMessage(GATEWAYS.SEND_MESSAGE)
  public async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    body: SendMessageDto,
  ): Promise<string> {
    const chat = await this.prisma.chat.findUniqueOrThrow({ where: { id: body.chatId }});

    if (!client.rooms.has(chat.id)) {
      throw new WsException("You not in a this chat");
    }

    this.server.to(chat.id).emit("receive_message", body);

    return client.id;
  }

  @SubscribeMessage(GATEWAYS.CONNECT)
  public handleRoomConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomId: string,
  ) {
    console.log("Client joined to " + roomId);
    client.join(roomId);
  }

  @SubscribeMessage(GATEWAYS.CONNECT_MANY)
  public handleRoomsConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomsId: string[],
  ) {
    console.log("Client joined to ", roomsId);
    for (const roomId of roomsId) {
      client.join(roomId);
    }
  }

  @SubscribeMessage(GATEWAYS.DISCONNECT)
  public handleRoomDisconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomId: string,
  ) {
    console.log("Client leaved from " + roomId);
    client.leave(roomId);
  }

  @SubscribeMessage(GATEWAYS.DISCONNECT_MANY)
  public handleRoomsDisconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomsId: string[],
  ) {
    console.log("Client joined to ", roomsId);
    for (const roomId of roomsId) {
      client.leave(roomId);
    }
  }

  public afterInit() {
    console.log("gateway " + GATEWAY + " started");
  }

  public handleDisconnect(client: Socket) {
    console.log("Disconnected: " + client.id);
  }

  public handleConnection(client: Socket) {
    console.log("Connected: " + client.id);
  }
}

export default Gateway;
