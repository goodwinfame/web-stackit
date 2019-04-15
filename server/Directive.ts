import { requestType } from "./types/enums";
import { STServer } from "./types/Server";

/**
 * stackit 指令
 * 1: 搜索
 * 2: 更多
 * 3: 返回搜索结果
 * 4: 进入结果详情
 * 5: 退出搜索
 */

export default class Directive {
    public value: string = ""
    constructor({type, payload}: STServer.request) {
        switch (type) {
            case requestType["search"]:
                if(payload && payload.value){
                    this.value = `stackit -s "${payload.value}"\n`;

                }
                break;
            case requestType["more"]:
                this.value = "m\n";
                break;
            case requestType["goback"]:
                this.value = "x\n";
                break;
            case requestType["enterdetail"]: 
                if(payload && payload.value){
                    this.value = `${payload.value}\n`;

                }
                break;
            case requestType["quit"]:
                this.value = "q\n"
                break;
            default:
                this.value = "\n";
                break;
        }

    }
}