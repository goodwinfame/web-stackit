import { listState, inputState, detailState } from "./enums";
import { STServer } from "./Server";

declare namespace STStore {
    
    export interface resultList {
        value: STServer.resultList,
        state: listState
    }
    
    export interface searchInput {
        value: string,
        state: inputState
    }
    
    
    export interface resultDetail {
        value: STServer.resultList,
        state: detailState
    }
    
    
}