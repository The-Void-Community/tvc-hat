import { ValidateIf } from "class-validator";

export const Nullable = (nullable = true): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    if (nullable) {
      return ValidateIf((o) => o[propertyKey] != null)(target, propertyKey);
    }

    return () => {};
  };
};
