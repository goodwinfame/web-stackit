namespace STServer {
  
    export interface result {
        id: number,
        question: string,
        answer: string,
        state: number
    }
    
    export type resultList = result[]

    export interface response {
        state: responseState,
        data: resultList | null
    }

    export interface requestData {
        value: string | number
    }
    export interface request {
        type: requestType,
        payload?: requestData
    }
}