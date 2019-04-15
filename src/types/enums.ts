export enum viewState {"none", "list", "detail"};
export enum inputState {"none", "typing"}
export enum listState {"none", "loading", "hasnext"}
export enum detailState {"none", "loading"}
export enum responseState {
    "init" = -1, 
    "idel" = 0, 
    "process" = 1, 
    "responding" = 2, 
    "hasnext" = 3, 
    "viewdetail" = 4, 
    "lastpage" = 5, 
    "error" = 6
}
export enum requestType {
    "search" = 1, 
    "more" = 2, 
    "goback" = 3, 
    "enterdetail" = 4, 
    "quit" = 5
}
export enum resultState{"unload", "questionLoaded", "answerLoaded"}