export const enum ChatType {
  direct = "DIRECT",
  group = "GROUP",
  self = "SELF",
}

export const RUSSIAN_NAMES_OF_CHAT_TYPES = {
  DIRECT: "Личное",
  GROUP: "Группа",
  SELF: "Свои",
};

export const AVAILABLE_CHAT_TYPES_TO_CREATE = [ChatType.group];
