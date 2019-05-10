export const delay = (ms:number = 0) => new Promise(resolve => window.setTimeout(resolve, ms))
