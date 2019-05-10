import React, { lazy, Suspense, useState, useCallback } from 'react';
import { listState, viewState, inputState } from './enums';
import Loading from './components/Loading';

export const GlobalContext = React.createContext<Store.GlobalContext | null>(null);
export const Provider = GlobalContext.Provider;
export const Consumer = GlobalContext.Consumer;

const App = lazy(() => import('./App'));

function getDefaultValue(value: any, defaultValue: any) {
    if(value !== undefined) {
        return value
    }
    return defaultValue
}

export default () => {
    const [mainView, setMainView] = useState({
        state: viewState["none"],
        value: null
    } as Store.MainView);

    const [searchInput, setSearchInput] = useState({
        value: "",
        state: inputState["none"]
    } as Store.SearchInput);

    const [questionList, setQuestionList] = useState({
        value: [],
        pageNum: 1,
        state: listState["none"]
    } as Store.QuestionListState);

   
    const updateSearchInput = useCallback(
        function(value: string | Store.SetStateCallback<Store.SearchInput>, state: inputState): void {
            if(arguments.length === 1 && typeof(arguments[0]) === "function") {
                setSearchInput(arguments[0])
            } else {
                setSearchInput((preState)=>({
                    value: getDefaultValue(value, preState.value),
                    state: getDefaultValue(state, preState.state)
                }))
            }
            
        },
        [],
    )
    const updateView = useCallback(
        function(state: viewState | Store.SetStateCallback<Store.MainView>, value: number | null): void {
            if(arguments.length === 1 && typeof(arguments[0]) === "function") {
                setMainView(arguments[0])
            } else {
                setMainView((preState)=>({
                    value: getDefaultValue(value, preState.value),
                    state: getDefaultValue(state, preState.state)
                }))
            }
            
        },
        []
    )


    const updateQuestionList = useCallback(
        function(value: Store.questionList | Store.SetStateCallback<Store.QuestionListState>, pageNum: number, state: listState): void {
            if(arguments.length === 1 && typeof(arguments[0]) === "function") {
                setQuestionList(arguments[0])
            } else {
                setQuestionList((preState)=>(
                    {
                        value: getDefaultValue(value, preState.value),
                        pageNum: getDefaultValue(pageNum, preState.pageNum),
                        state: getDefaultValue(state, preState.state)
                    }
                ))
            }
            
        },
        []
    )

    
    const context: Store.GlobalContext = {
        mainView,
        searchInput,
        questionList,
        updateSearchInput,
        updateView,
        updateQuestionList
    }
    return (
        <Provider value={context}>
            <Suspense fallback={<Loading global />}>
                <App />
            </Suspense>
        </Provider>
    )
}