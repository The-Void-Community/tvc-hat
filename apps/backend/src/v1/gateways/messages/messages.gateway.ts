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

  public constructor(private readonly service: Service) {}

  @SubscribeMessage(GATEWAYS.SEND_MESSAGE)
  public handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(
      new ValidationPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    body: SendMessageDto,
  ): string {
    if (!client.rooms.has(body.chat)) {
      throw new WsException("You not in a this chat");
    }

    this.server.to(body.chat).emit("receive_message", body);

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

  @SubscribeMessage(GATEWAYS.DISCONNECT)
  public handleRoomDisconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomId: string,
  ) {
    console.log("Client leaved from " + roomId);
    client.leave(roomId);
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
