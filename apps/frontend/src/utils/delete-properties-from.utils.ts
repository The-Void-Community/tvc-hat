import { MaybeFrontendMessagePartial, MessageBody } from "@/types";

export const deletePropertiesFrom = <
  Input extends object,
  Property extends keyof Input,
>(
  object: Input,
  properties: Property[],
): Omit<Input, Property> => {
  const exclude = new Set(properties);

  const filter = (key: string) => !exclude.has(key as Property);
  const map = (key: string) => [key, object[key as Property]];

  return Object.fromEntries(Object.keys(object).filter(filter).map(map));
};

type ExcludeFrontendMessageProperties = Exclude<
  keyof MaybeFrontendMessagePartial,
  keyof MessageBody
>;
const excludeFrontendMessageProperties: ExcludeFrontendMessageProperties[] = [
  "id",
  "senderId",
  "pending",
  "failed",

  "createdAt",
  "updatedAt",
];
export const changeFrontendMessageToMessageBody = (
  message: MaybeFrontendMessagePartial,
): MessageBody => {
  return deletePropertiesFrom<
    MaybeFrontendMessagePartial,
    ExcludeFrontendMessageProperties
  >(message, excludeFrontendMessageProperties);
};
