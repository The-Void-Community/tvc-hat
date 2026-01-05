export const GATEWAY = "message";

export const GATEWAYS = {
  SEND_MESSAGE: "send_message",
  DISCONNECT: "room_disconnect",
  DISCONNECT_MANY: "rooms_disconnect",
  CONNECT_MANY: "rooms_connect",
  CONNECT: "room_connect",
} as const;
