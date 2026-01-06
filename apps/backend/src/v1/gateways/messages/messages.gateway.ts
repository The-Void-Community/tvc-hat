import type { Namespace, Socket } from "socket.io";
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

import { Service } from "@1/routes/messages/messages.service";
import { SendMessageDto } from "@1/routes/messages/dto/send-message.dto";

import AuthGuardService from "@1/guards/auth/auth-guard.service"
import Hash from "@1/services/hash.service";

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
  private readonly server: Namespace;
  private readonly validated = {
    chats: new Map<string, string>(),
    clients: new Map<string, string>(),
  } as const;

  public constructor(private readonly service: Service, private readonly prisma: PrismaService) {}

  public async validateClientOrThrow(client: Socket): Promise<string> {
    const userId = this.validated.clients.get(client.id);
    if (userId) {
      return userId;
    };

    const valided = await AuthGuardService.validateRequest(client.request, this.prisma);
    if (!valided) {
      throw new WsException("Client is not valided user");
    }

    const { profileId } = Hash.parseOrThrow(client.request);
    this.validated.clients.set(client.id, profileId);
    return profileId;
  }

  public async validateChatOrThrow(chatId: string): Promise<string> {
    if (this.validated.chats.has(chatId)) {
      return chatId;
    }

    const chat = await this.prisma.chat.findUnique({ where: { id: chatId }});
    if (!chat) {
      throw new WsException("Chat is invalid");
    }

    this.validated.chats.set(chatId, chat.id);

    return chat.id;
  }

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
    this.validateClientOrThrow(client);
    this.validateChatOrThrow(body.chatId);
    
    if (!client.rooms.has(body.chatId)) {
      throw new WsException("You not in a this chat");
    }

    const { message } = await this.service.createMessageAndUpdateChat(body);
    this.server.to(body.chatId).emit("receive_message", message);

    return client.id;
  }

  @SubscribeMessage(GATEWAYS.CONNECT)
  public handleRoomConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomId: string,
  ) {
    this.validateClientOrThrow(client);
    this.validateChatOrThrow(roomId);
    
    console.log(client.id + " client joined to " + roomId);
    client.join(roomId);
  }
  
  @SubscribeMessage(GATEWAYS.CONNECT_MANY)
  public handleRoomsConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomsId: string[],
  ) {
    this.validateClientOrThrow(client);
    
    for (const roomId of roomsId) {
      try {
        this.validateChatOrThrow(roomId);
  
        console.log(client.id + " joined to " + roomId);
        client.join(roomId);
      } catch {
        console.log(client.id + " failed to connected to " + roomId);
        continue;
      }
    }
  }

  @SubscribeMessage(GATEWAYS.DISCONNECT)
  public handleRoomDisconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomId: string,
  ) {
    this.validateClientOrThrow(client);
    this.validateChatOrThrow(roomId);

    console.log(client.id + " client leaved from " + roomId);
    client.leave(roomId);
  }

  @SubscribeMessage(GATEWAYS.DISCONNECT_MANY)
  public handleRoomsDisconnect(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe()) roomsId: string[],
  ) {
    this.validateClientOrThrow(client);
    
    for (const roomId of roomsId) {
      try {
        this.validateChatOrThrow(roomId);
        console.log(client.id + " client leaved from " + roomsId);
        client.leave(roomId);
      } catch {
        console.log(client.id + " failed leaved from " + roomsId);
        continue
      }
    }
  }

  public afterInit() {
    console.log("gateway " + GATEWAY + " started");
  }

  public handleDisconnect(client: Socket) {
    this.validateClientOrThrow(client);
    console.log("Disconnected: " + client.id);
  }

  public handleConnection(client: Socket) {
    this.validateClientOrThrow(client);
    console.log("Connected: " + client.id);
  }
}

export default Gateway;
