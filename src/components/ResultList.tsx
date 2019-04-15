import React, {useContext} from 'react'
import {GlobalContext} from '../Container';
import Artical from './Artical';
import styles from './comp.module.scss';
import {socketSend} from '../App';
import { listState, detailState } from '../types/enums';

interface props {
    socketSend: socketSend
}

const ResultList = ({socketSend}: props) => {
    const context = useContext(GlobalContext);

    if(!context) return null;

    const {
        resultList,
        updateResultDetail,
    } = context;
    
    function loadMore() {
        socketSend(2);
        // updateResultList(undefined, "loading");
    }

    function viewPage(id: number) {
        if(resultList.state === listState["loading"]) {
            return;
        }

        socketSend(4, {
          value: id
        });

        updateResultDetail(undefined, detailState["loading"])
        
      }

    return (
        <div className={`${styles.ResultList} ${styles[resultList.state]}`}>
            {
                resultList.value.map(result=>(
                    <div className={styles.ResultItem} key={result.id}>
                        <h4><i>{result.id}.</i><a onClick={viewPage.bind(null, result.id)}>{result.question}</a></h4>
                        <Artical>{result.answer}</Artical>
                    </div>
                    
                ))
            }
            <div className={styles.Afterfix}>
            {
               resultList.state === listState["hasnext"]
               ?
               <button className={styles.LoadMore} onClick={loadMore}>Load more</button>
               :
               resultList.state === listState["loading"]
               ?
               <span>Loading...</span>
               :
               resultList.value.length === 0
               ?
               <span>Search returns no result, please change the key words</span>
               :
               <span>The search is over</span>
           }
            </div>
        </div>
       
    )
}


export default ResultList