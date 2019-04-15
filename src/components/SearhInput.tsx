import React, {useContext} from 'react'
import {GlobalContext} from '../Container';
import styles from './comp.module.scss';
import {socketSend} from '../App';
import { inputState, viewState, listState } from '../types/enums';

let searchInputTimer: number | undefined;

interface props {
    socketSend: socketSend
}

const SearchInput = ({socketSend}: props) => {
    const context = useContext(GlobalContext);

    if(!context) return null;

    const {
        searchInput,
        updateSearchInput,
        updateResultList,
        updateViewState
    } = context;
        
    function handleEnterKey(e: React.KeyboardEvent) {
        if(e.nativeEvent.keyCode === 13){
            onSearch()
        }
    }
    
    function onInput(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
    
        if(searchInputTimer){
            window.clearTimeout(searchInputTimer)
            searchInputTimer = undefined;
        }
    
        updateSearchInput(val, inputState["typing"])
    
        searchInputTimer = window.setTimeout(()=>{
            updateSearchInput(undefined, inputState["none"])
          
        },500)
    
      }
      function onSearch() {
        socketSend(1, {
          value: searchInput.value
        })
        updateViewState(viewState["list"]);
        updateSearchInput(undefined, inputState["none"])
        updateResultList([], listState["loading"]);
    
    }

    return (
        <div className={styles.Input}>
            <h3>Web-stackit</h3>
            <input placeholder={"Press enter to search on Stack Overflow"} value={searchInput.value} onChange={onInput} onKeyPress={handleEnterKey}/>
        </div>
        
    )
}


export default SearchInput