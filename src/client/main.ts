import { generatePin, generatePriv } from "./randomKeys";
import { io } from "socket.io-client";
import diffieHelman from "./diffieHelman";

// html elements

const _pin = document.querySelector('#pin')
const msgSend = document.querySelector('#msgSend')
const diff = document.querySelector('#diffBtn')
const status = document.querySelector('#status')



// rest

const tempIp = '192.168.0.75'

const generatedPin:string = generatePin(5) 

_pin!.textContent = generatedPin // pub key

const priv = generatePriv() // priv key

const socket = io('ws://' + tempIp + ":3333", {query: {pin: generatedPin}}) // socket connect

const nHashed:string = "0x2dd3ca6fa7de9a07cda570c7e802450a7522c8296f73f8795cc7be468a01206373aefc4eae5b062293b3b7b9a2480d52152501a8d0b900f5562a42a3db8487ac"
const gen:number = 3

let helmans:string = ''
let diffieDone:boolean = false


msgSend!.addEventListener('click', event => {
    let receiverPin = (<HTMLInputElement>document.getElementById("rPin")).value
    let msg = (<HTMLInputElement>document.getElementById("msg")).value

    socket.emit('hello', [generatedPin, receiverPin, msg])
})

document.getElementById('rPin')?.addEventListener('input', event => {
    let receiverPin = (<HTMLInputElement>document.getElementById("rPin")).value
    if(receiverPin.length === 5 && !diffieDone){
        const dh:string = diffieHelman(priv, nHashed, gen)
        socket.emit('hello', [generatedPin, receiverPin, 'dh'+dh])
        diffieDone = true
    }
    //console.log(receiverPin)
})




window.addEventListener('DOMContentLoaded', (event) => {
    
    socket.on(generatedPin, data => {
        //console.log(data)
        if(data.msg[0] == 'd' && data.msg[1] == 'h'){
            if(!diffieDone){
                diffieDone = true
                const dh:string = diffieHelman(priv, nHashed, gen)
                socket.emit('hello', [generatedPin, data.sender, 'dh'+dh])
            }
            helmans = diffieHelman(priv, nHashed, data.msg.substring(2))
            //console.log(helmans)
            status!.textContent = 'Set! ' + helmans.substring(0,5) + '...'
        } 
        else {
            console.log(data.msg)
        }
        
    })
    

});


