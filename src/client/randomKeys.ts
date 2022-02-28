import { SHA256, enc } from "crypto-js";

function generatePin(limit:number): string {
    const chars:Array<string> = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*():".split('')
    let result:string = "";
    for(let i=0; i<limit; i++) result += chars[Math.floor(Math.random() * chars.length)]
    return result
}

function generatePriv(): string {
    return '0x' + SHA256(generatePin(10)).toString(enc.Hex)
}

export {generatePin, generatePriv}
