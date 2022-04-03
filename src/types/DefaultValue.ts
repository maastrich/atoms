type DefaultValue<T> = T | (() => T | Promise<T>);
export default DefaultValue;
