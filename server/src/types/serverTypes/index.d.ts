


interface SearchAction {
    q?: string;
    title?: string;
    tagged?: string;
    body?: string;
}

interface ReturnData {
    retCode: number;
    retMsg: string;
    data: {
        lists?: object[];
    };
}


//声明合并，扩展http2接口
declare namespace http2{
    export interface IncomingHttpHeaders {
        "x-page-size": string;
        "x-page-num": string;
    } 
}