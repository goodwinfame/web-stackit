import { Response as ResponseType } from "express";


interface Result {
    lists?: (Question | Answer | SearchQuestion)[];
    total?: number;
    retCode?: number;
    retMsg?: string;
}

export default class Response implements ReturnData {
    public retCode: number = 10000
    public retMsg: string = "success"
    public data: {lists?: Result["lists"]} = {}
    private response: ResponseType
    public constructor(res: ResponseType) {
        this.response = res;
        this.setStatus();
    }
    public load(result: Result = {}): Response{
        const {lists, total, retCode, retMsg} = result;
        if(retCode){
            this.retCode = retCode;
            this.response.status(500)
        }

        if(retMsg){
            this.retMsg = retMsg
        }

        if(lists){
            this.data.lists = lists
        }

        if(total){
            this.addHeader('X-Total-Count', total);
        }

        return this
    }
    public error(retCode: number, retMsg: string = "error"): Response {
        this.retCode = retCode;
        this.retMsg = retMsg;
        return this;
    }
    public addHeader(name: string, value: string | number): Response {
        this.response.setHeader(name, value);
        return this;
    }
    public setStatus(status: number = 200): Response{
        this.response.status(status);
        return this;
    }
    public send(error?: Error): ResponseType{
        let obj;
        try {
            obj = error || {
                "ret_code": this.retCode,
                "ret_msg": this.retMsg,
                "data": this.data
            }
        } catch(e) {
            obj = {
                "ret_code": 100001,
                "ret_msg": "JSON format error",
                "data": {}
            }
            this.setStatus(500)
        }
        
        this.response.json(obj);

        return this.response;
    }
}

