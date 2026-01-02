/* eslint-disable @typescript-eslint/no-namespace */
import Compiler from "fbit-field/compiler";
import { BitBuilder } from "fbit-field";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IRights<T extends any[] | readonly any[]> = Record<T[number], bigint>;

export namespace Rights {
  export type Chat = IRights<typeof Chat.ALL>;
  export namespace Chat {
    export const EXCLUDE = [
      "ADMIN",
      "KICK",
      "MUTE",
      "BAN",
      "ALIEN_EDIT",
      "ALIEN_DELETE",
    ] as const;

    export const ALL = [
      ...EXCLUDE,
      "SEND",
      "SELF_EDIT",
      "SELF_DELETE",
    ] as const;

    const bitBuilder = new BitBuilder(ALL);

    export const AVAILABLE: Chat = bitBuilder.execute(0n);
    export const DEFAULT: Chat = bitBuilder.execute(0n, EXCLUDE);
    export const RAW_AVAILABLE = bitBuilder.resolve(AVAILABLE);
    export const RAW_DEFAULT = bitBuilder.resolve(DEFAULT);
  }

  export const CONSTANTS = {
    raw: {
      default: {
        chat: Chat.RAW_DEFAULT,
      } as const,
      available: {
        chat: Chat.RAW_AVAILABLE,
      } as const,
    } as const,

    object: {
      default: {
        chat: Chat.DEFAULT,
      } as const,
      available: {
        chat: Chat.AVAILABLE,
      } as const,
    } as const,
  } as const;
}

const RIGHTS = Object.fromEntries(
  Object.keys(Rights.CONSTANTS.object.available).map((key) => [
    key,
    Object.keys(Rights.CONSTANTS.object.available[key]),
  ]),
);

// ## { COMPILED__WRITE_COMPILED_HERE } ## \\

/**
 * - this file was auto genereted by compiler
 * - if you see inconsistencies: https://github.com/FOCKUSTY/bit-field/issues
 */
export const raw = {
  chat: {
    /** @value 1 */
    admin: 1n << 0n,

    /** @value 2 */
    kick: 1n << 1n,

    /** @value 4 */
    mute: 1n << 2n,

    /** @value 8 */
    ban: 1n << 3n,

    /** @value 16 */
    alienEdit: 1n << 4n,

    /** @value 32 */
    alienDelete: 1n << 5n,

    /** @value 64 */
    send: 1n << 6n,

    /** @value 128 */
    selfEdit: 1n << 7n,

    /** @value 256 */
    selfDelete: 1n << 8n,
  } as const,
} as const;
// ## { COMPILED__WRITE_COMPILED_HERE } ## \\

if (process.env.NODE_ENV === "compiler") {
  new Compiler(
    RIGHTS,
    __filename,
    {},
    {
      writeInCompiler: true,
      defaultExportOn: false,
      name: "raw",
    },
  ).execute();
}
