export const BaseClass = <T>(type: new () => T): T => new type();
