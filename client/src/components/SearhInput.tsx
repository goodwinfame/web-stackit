import React, { useContext, useEffect, useCallback, useRef } from 'react'
import { GlobalContext } from '../Container';
import styles from './comp.module.scss';
import { inputState, listState, viewState } from '../enums';

let searchInputTimer: number | undefined;

type Props = {
    search: Store.search
}
const SearchInput = ({ search }: Props) => {
    const {
        searchInput,
        updateSearchInput,
        updateQuestionList,
        updateView
    } = useContext(GlobalContext) as Store.GlobalContext;

    const inputEl = useCallback((node)=>{
        node.focus()
    },[])


    useEffect(() => {
        searchInputTimer = window.setTimeout(()=>{
            updateSearchInput(undefined, inputState["none"])
        }, 500);

        return () => {
            window.clearTimeout(searchInputTimer);
            searchInputTimer = undefined
        };
    }, [searchInput.value])

    const onSearch = useCallback(
        function() {
        
            updateView(viewState["list"]);
            updateSearchInput(undefined, inputState["none"]);
            updateQuestionList([], 1, listState["loading"]);
            search({
                q: searchInput.value
            })
        },
        [searchInput.value, search]
    )

    const handleEnterKey = useCallback(
        function(e: React.KeyboardEvent) {
            if (e.nativeEvent.keyCode === 13) {
                onSearch()
            }
        },
        [onSearch],
    )

    const onInput = useCallback(
        function(e: React.ChangeEvent<HTMLInputElement>) {
            const val = e.target.value;
            updateSearchInput(val, inputState["typing"])
    
        },
        []
    )

    

    return (
        <div className={styles.Input}>
            <h3>Web-stackit</h3>
            <input ref={inputEl} placeholder={"Press enter to search on Stack Overflow"} value={searchInput.value} onChange={onInput} onKeyPress={handleEnterKey} />
        </div>

    )
}


export default SearchInput