import { generatePin, generatePriv } from "./randomKeys";
import { io } from "socket.io-client";
import { AES, enc } from "crypto-js";
import diffieHelman from "./diffieHelman";

// html elements

const _pin = document.querySelector('#pin')
const msgSend = document.querySelector('#msgSend')
const status = document.querySelector('#status')



// rest

const tempIp = '192.168.0.75'

const generatedPin:string = generatePin(5) // should omit pins which are in use at the moment

_pin!.textContent = generatedPin // pub key

const priv = generatePriv() // priv key

const socket = io('ws://' + tempIp + ":3333", {query: {pin: generatedPin}}) // socket connect

const nHashed:string = "0x2dd3ca6fa7de9a07cda570c7e802450a7522c8296f73f8795cc7be468a01206373aefc4eae5b062293b3b7b9a2480d52152501a8d0b900f5562a42a3db8487ac" // should change every minute (server)
const gen:number = 3 // should change every minute (server)

let helmans:string = ''
let diffieDone:boolean = false


msgSend!.addEventListener('click', event => {
    let receiverPin = (<HTMLInputElement>document.getElementById("rPin")).value
    let msg = (<HTMLInputElement>document.getElementById("msg")).value
    if(diffieDone){
        const encMsg:string = AES.encrypt(msg, helmans).toString()
        socket.emit('hello', [generatedPin, receiverPin, encMsg])
    }
})

document.querySelector('#rPin')?.addEventListener('input', event => {
    let receiverPin = (<HTMLInputElement>document.getElementById("rPin"))
    if(receiverPin.value.length === 5 && !diffieDone){
        const dh:string = diffieHelman(priv, nHashed, gen)
        socket.emit('hello', [generatedPin, receiverPin.value, 'dh'+dh])
        receiverPin.disabled = true
        diffieDone = true
    }
})

// interface HTMLInputEvent extends Event {
//     target: HTMLInputElement & EventTarget;
// }

let base64String:string=""


document.querySelector('#file')?.addEventListener('change', event => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) {
        return;
    }
    const file = input.files[0]

    var reader = new FileReader();
    reader.readAsDataURL(file);
	reader.onload = function(){
        base64String = reader.result as string
    }
})

document.querySelector('#fileSend')?.addEventListener('click', event => {
    //const file =  (<HTMLInputElement>document.querySelector('#file'))['files']
    //console.log(file?[0]:File)
    // console.log(file)

    //console.log(file?[0]:File)
    async function encrypt() {
        const encMsg:string = await AES.encrypt(base64String, helmans).toString()
        console.log(encMsg)
        socket.emit('hello', [generatedPin, receiverPin, encMsg])
    }

    let receiverPin = (<HTMLInputElement>document.getElementById("rPin")).value
    if(diffieDone) encrypt();
})

window.addEventListener('DOMContentLoaded', (event) => {
    
    socket.on(generatedPin, data => {
        console.log(data)
        if(data.msg[0] == 'd' && data.msg[1] == 'h'){
            if(!diffieDone){
                diffieDone = true
                const dh:string = diffieHelman(priv, nHashed, gen)
                socket.emit('hello', [generatedPin, data.sender, 'dh'+dh])
            }
            helmans = diffieHelman(priv, nHashed, data.msg.substring(2))
            //console.log(helmans)
            status!.textContent = 'Set! ' + helmans.substring(5,10) + '...'
        }
        else {
            if(diffieDone){
                const dec:string = AES.decrypt(data.msg, helmans).toString(enc.Utf8)
                if(dec.substring(0,5) === 'data:'){
                    if(dec.substring(5,10) === 'image'){
                        var proImage= new Image();
                        proImage.src = dec
                        document.body.appendChild(proImage);
                        //console.log('image');
                    }
                } 
                else {
                    const para = document.createElement('p')
                    const text = document.createTextNode(dec)
                    para.appendChild(text)
                    document.querySelector('#ctn')?.appendChild(para)
                }
                
            }
            
            //console.log(data.msg)
        }
        //console.log(data.msg.substring(0,4))
    })
    

});


