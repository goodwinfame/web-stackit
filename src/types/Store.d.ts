
namespace STStore {
    
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
    
    
    
    
    export interface store{
        mainViewState: viewState,
        searchInput: searchInput,
        resultList: resultList,
        resultDetail: resultDetail
    }

    export interface storeUpdater{
        updateResultDetail(value?: STServer.resultList, state?: detailState): any,
        updateSearchInput(value?: string, state?: inputState): any,
        updateViewState(state: viewState): any,
        updateResultList(value?: STServer.resultList, state?: listState): any,
    }
    export interface globalContext extends store, storeUpdater{}
}