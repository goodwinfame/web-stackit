import {spawn, ChildProcess} from 'child_process';
import Directive from './Directive';
import Response from './Response';
import { responseState, requestType } from './types/enums';
import { STServer } from "./types/Server";

/**
 * stackit 指令
 * 1: 搜索
 * 2: 更多
 * 3: 返回搜索结果
 * 4: 进入结果详情
 * 5: 退出搜索
 */

 /**
 * Server状态(始终等于最后一个response的状态)
 * 0: 无（空闲）
 * 1: 处理中
 * 2: 结果
 * 3: 等待翻页或退出
 * 4: 等待返回或退出
 * 5: 最后一页或退出
 * 6: 错误
 */


interface BashGroup {
    [key: string]: Bash
}

export default class Bash {
    private static BashGroup: BashGroup = {}
    private id: string
    private state: responseState
    private bash: ChildProcess
    private callback: CallableFunction | undefined
    public static add(id: string, bashObj: Bash){
        //bashObj: {id,state,bash}
        Bash.BashGroup[id] = bashObj
    }
    static remove(id: string){
        delete Bash.BashGroup[id]
    }
    static size(){
        return Object.keys(Bash.BashGroup).length;
    }
    static changeBashState(id: string, state: responseState){
        if(Bash.BashGroup[id]){
            Bash.BashGroup[id].state = state;
        }
    }
    constructor(id: string){
        /**
         * id为客户端session id
         */
        this.bash = spawn('bash');
        this.id = id;
        this.state = responseState["idel"];

        Bash.add(id, this);

    }
    destroy(){
        Bash.remove(this.getId());
    }
    getId(){
        return this.id
    }
    setState(state: responseState){
        this.state = state;
    }
    getState(){
        return this.state;
    }

    write(string?: string){
        if(string === undefined) {
            return;
        }
        this.bash.stdin && this.bash.stdin.write(string);
    }
    off(){
        this.bash.stdout && this.bash.stdout.removeAllListeners();
        this.bash.stderr && this.bash.stderr.removeAllListeners();
        this.bash.removeAllListeners();
    }
    on(callback: CallableFunction){
        this.callback = callback;
        this.bash.stdout && this.bash.stdout.on('data', (data: Uint8Array) => {
            callback(this.processResponse(new Response(data)))
        });
        
        this.bash.stderr && this.bash.stderr.on('data', (data: Uint8Array) => {
            callback(this.processResponse(new Response(data)))
        });

        this.bash.on('exit', (code) => {
            callback('** Shell exited: '+code+' **', 'exit')
        });
    }
    processResponse(response: Response){
        //同步当前bash状态与响应状态
        if(response.state != responseState["init"]){
            this.setState(response.state);

        }
        return response;
    }
    process(action: STServer.request){
        const {type} = action;

        switch (type) {
            case requestType["search"]:
                //搜索
                this.search(new Directive(action).value)
                break;
            case requestType["more"]:
                //加载更多
                this.loadMoreOrDetail(new Directive(action).value)
            case requestType["goback"]:
                //返回列表
                this.backToResultList(new Directive(action).value)
            case requestType["enterdetail"]:
                //加载详情
                this.loadMoreOrDetail(new Directive(action).value)
            default:
                break;
        }
    }
    cancel(){
        this.off();
        this.bash.kill('SIGINT');
        this.bash = spawn('bash');
        if(this.callback){
            this.on(this.callback);

        }

        //状态更新为空闲
        this.setState(0);
    }
    search(string: Directive["value"]){
        if(this.getState() !== 0){
            //先取消再搜索
            this.cancel();
        }

        //处理中
        this.setState(1);
        this.write(string);

    }
    loadMoreOrDetail(string: string){
        if(this.getState() === responseState["hasnext"] || this.getState() === responseState["responding"]){
            this.write(string);
        }
    }
    backToResultList(string: string){
        if(this.getState() === responseState["viewdetail"]){
            this.write(string);
        }
    }
}
