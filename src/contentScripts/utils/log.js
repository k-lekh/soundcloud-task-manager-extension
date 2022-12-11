const isDebug = process.env.DEBUG;

export const log = isDebug ? console.log.bind(console) : () => undefined;
export const error = isDebug ? console.error.bind(console) : () => undefined;