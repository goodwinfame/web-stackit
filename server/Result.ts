import { resultState } from "./types/enums";

export default class Result {
    public id: number
    public question: string = ""
    public answer: string = ""
    public state: resultState = resultState["unload"]
    constructor(id: number){
        this.id = id;
        /** 
         * 结果的载入是有顺序的
         * 实例化后等待加载问题，答案加载完后等待加载答案。
        */
    }
    addQuestion(string: string){
        this.question += `${string}\n`;
    }
    addAnswer(string: string){
        this.answer += `${string}\n`;
    }
    
    nextState(){
        if(this.state === resultState['unload']){
            this.state = resultState['questionLoaded']
        } else if(this.state === resultState['questionLoaded']) {
            this.state = resultState['answerLoaded']
        }
    }
    getState(){
        return this.state;
    }
}