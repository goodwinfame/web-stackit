export function getStringFromUint8Array(data: Uint8Array){
    let string = "";
    data.forEach(v=>{
        string += String.fromCharCode(v)
    })
    return string;
}