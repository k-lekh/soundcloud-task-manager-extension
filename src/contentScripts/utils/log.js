const isDebug = process.env.DEBUG;

export const log = isDebug ? console.log.bind(console) : () => undefined;