import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { HttpStatus, ValidationPipe } from "@nestjs/common";

import { GATEWAY, GATEWAYS } from "./messages.gateways";
import { SendMessageDto } from "./dto/send-message.dto";

import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class Gateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

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
    this.server.emit("receive_message", body);

    return client.id;
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
