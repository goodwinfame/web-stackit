import React, { Component, lazy, Suspense } from 'react';
import styles from './index.module.scss';
import { viewState, inputState, listState, detailState } from './types/enums';

export const GlobalContext = React.createContext<STStore.globalContext | null>(null);
export const Provider = GlobalContext.Provider;
export const Consumer = GlobalContext.Consumer;

const App = lazy(() => import('./App'));


export default class Container extends Component implements STStore.storeUpdater {
    public state: STStore.store
    private resultListStatusTimer: number | undefined
    constructor(props: any){
        super(props);
        this.state = {
            mainViewState: viewState["none"],
            searchInput: {
                value: "",
                state: inputState["none"]
            },
            resultList: {
                value: [],
                state: listState["none"]
            },
            resultDetail: {
                value: [],
                state: detailState["none"]
            }
        }
        
    }
    updateResultDetail = (value: STServer.resultList = this.state.resultDetail.value, state: detailState = this.state.resultDetail.state) => {
        this.setState({
            resultDetail: {
                value,
                state
            }
        })
    }
  
    updateSearchInput = (value: string = this.state.searchInput.value, state: inputState = this.state.searchInput.state) => {
        this.setState({
            searchInput: {
                value,
                state
            }
        })
    }
    updateViewState = (state: viewState) => {
        this.setState({
            mainViewState: state
        })
    }
    updateResultList = (value: STServer.resultList = this.state.resultList.value, state: listState = this.state.resultList.state) => {
        if(this.resultListStatusTimer){
            window.clearTimeout(this.resultListStatusTimer);
            this.resultListStatusTimer = undefined;

        }

        if(state === listState["loading"]){
            this.resultListStatusTimer = window.setTimeout(this.updateResultList.bind(null, undefined, listState["none"]), 10000);
        }

    
        this.setState({
            resultList:{
                state,
                value
            }
        })
    }

  
  
  
  
 
  render() {
    const {mainViewState, searchInput, resultList, resultDetail} = this.state;

    const context: STStore.globalContext = {
        mainViewState,
        searchInput,
        resultList,
        resultDetail,
        updateSearchInput: this.updateSearchInput,
        updateViewState: this.updateViewState,
        updateResultDetail: this.updateResultDetail,
        updateResultList: this.updateResultList
    }
    return (
      <Provider value={context}>
        <Suspense fallback={<div className={styles.Loading}>Loading...</div>}>
          <App />
        </Suspense>
      </Provider>
      

    );
  }
}


