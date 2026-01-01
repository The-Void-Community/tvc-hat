import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { GATEWAY, GATEWAYS } from './messages.gateways';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "*"
  }
})
export class Gateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly _server: Server;

  @SubscribeMessage(GATEWAYS.SEND_MESSAGE)
  public handleMessage(): string {
    console.log("Hello world");
    return 'Hello world!';
  }

  public afterInit(server: Server) {
    console.log("gateway " + GATEWAY + " started as", server.httpServer.address());
  }

  public handleDisconnect(client: Socket) {
    console.log("Disconnected: " + client.id);
  }

  public handleConnection(client: Socket) {
    console.log("Connected: " + client.id);
  }
}

export default Gateway;
