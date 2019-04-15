import {getStringFromUint8Array} from './Utils';
import Result from './Result';
import { responseState, resultState } from './types/enums';
import { STServer } from "./types/Server";

/**
 * Response状态
 * -1: 初始化
 * 0: 无（空闲）
 * 1: 处理中
 * 2: 结果
 * 3: 等待翻页或退出
 * 4: 等待返回或退出
 * 5: 最后一页或退出
 * 6: 错误
 */

export default class Response {
    public state: responseState = responseState["init"];
    public data: STServer.resultList = []
    constructor(data: Uint8Array | responseState) {

        if(data instanceof Uint8Array){
            let rawData = getStringFromUint8Array(data);
            const rawArray = rawData.split("\n");

            if(!rawData) return;
            try {
                if(rawArray[2] === "------------------------------QUESTION-----------------------------------"){
                    this.processPage(rawArray);

                } else {
                    this.processList(rawArray);

                }
              

                
            } catch (e) {
                console.log(e)
            }
        } else {
            this.state = data
        }

    }
    processList(rawArray: Array<string>){
        this.data = [];

        let lateastResult = null;
        //开始逐行修正结果
        for(let i in rawArray) {
            const index = Number(i);
            const line = rawArray[index];

            //无结果
            if(index === 0 && line.match(/Your search .+. returned no results./)){
                break;
            }

            //第一行存在searching或tags字段
            if(
                index === 0 && 
                (
                    line.indexOf("Searching for: ") > -1
                    ||
                    line.indexOf("Tags: ") > -1
                )
            ){
                
                this.state = responseState["process"];
                continue;
            }

            if(line === "Enter m for more, a question number to select, or q to quit: "){
                this.state = responseState["hasnext"];
                break;
            }


            if(
                line.match(/^([1-9][0-9]*)$/) 
                && 
                (
                    (
                        rawArray[index + 1]
                        &&
                        rawArray[index + 1].indexOf("Question: ") === 0
                    )
                    ||
                    rawArray[index + 1] === undefined
                )
            ) {
                /**
                 * 判断是否是一个新结果：
                 * 改行为非0开头的纯数字
                 * 下一行存在，且开头为Question
                 * 或者下一行不存在
                 */
                this.state = responseState["responding"];

                if(lateastResult && lateastResult.getState() === resultState["questionLoaded"]){
                    //结束上一个结果的答案录入
                    lateastResult.nextState();
                }

                lateastResult = new Result(Number(line));
                this.data.push(lateastResult)
                continue;
            }

            if(!lateastResult){
                continue;
            }

            if(lateastResult.getState() === resultState['unload']) {
                // 新建后的问题，第一个装载的一定是问题
                lateastResult.addQuestion(line.replace(/Question: /, ""));
                lateastResult.nextState();
            } else if(lateastResult.getState() === resultState['questionLoaded']) {
                // 问题装载完后一定装载答案
                lateastResult.addAnswer(line.replace(/Answer:/, ""));
            }
        

            

        }
    }
    processPage(rawArray: Array<string>){
        //读取字符串
        let page = null;
        this.state = responseState["viewdetail"];

        for(let i in rawArray) {
            const index = Number(i);
            const line = rawArray[index];


            if(line === "------------------------------QUESTION-----------------------------------") {
              
                page = new Result(0);
                continue;
            }

            if(line === "-------------------------------ANSWER------------------------------------") {
                page && page.nextState();
                continue;
            }

            if(line === "Enter b to launch browser, x to return to search, or q to quit: ") {
                page && page.nextState();
                break;
            }

            if(page){
                if(page.getState() === resultState["unload"]){
                    page.addQuestion(line);
                } else if(page.getState() === resultState["questionLoaded"]) {
                    page.addAnswer(line);
                }


            }
            

        }

        if(page){
            this.data.push(page);
        }

    }
}

