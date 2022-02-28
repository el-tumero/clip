import BigNumber from "bignumber.js";
import bigInt from "big-integer";

function diffieHelman(pkey:string, nH:string, generator:number){
    let n_str:string = ""
    let private_key_int_str:string = "";

    const n_int = new BigNumber(nH)
    const private_key_int = new BigNumber(pkey)

    n_int.c!.forEach(element => n_str += element)
    private_key_int.c!.forEach(element => private_key_int_str += element);


    let g = bigInt(generator)
    let n = bigInt(n_str)
    let a = bigInt(private_key_int_str)
    
    return g.modPow(a,n).toString()

}

export default diffieHelman;