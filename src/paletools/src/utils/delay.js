export default function delay(msec){
    return new Promise(resolve => {
        setTimeout(resolve, msec);
    });
}