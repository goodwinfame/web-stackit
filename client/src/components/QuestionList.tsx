import React, {useContext} from 'react'
import {GlobalContext} from '../Container';
import Artical from './Artical';
import styles from './comp.module.scss';
import { listState, viewState } from '../enums';
import Loading from './Loading';

interface props {
    search: Store.search
}

const QuestionList = ({search}: props) => {
    const {questionList, updateView} = useContext(GlobalContext) as Store.GlobalContext;
    
    function loadMore() {
        search({
            pageNum: questionList.pageNum + 1
        });
    }

    function viewPage(id: number) {
        
        updateView(viewState["detail"], id)

   
        
    }

    return (
        <div className={`${styles.ResultList} ${styles[questionList.state]}`}>
            {
                questionList.value.map(result=>(
                    <div className={styles.ResultItem} key={result.question_id}>
                        <h4><i>{result.question_id}.</i><a onClick={viewPage.bind(null, result.question_id)}>{result.title}</a></h4>
                        <Artical>{result.body}</Artical>
                    </div>
                    
                ))
            }
            <div className={styles.Afterfix}>
            {
               questionList.state === listState["hasnext"]
               ?
               <button className={styles.LoadMore} onClick={loadMore}>Load more</button>
               :
               questionList.state === listState["loading"]
               ?
               <Loading />
               :
               questionList.value.length === 0
               ?
               <span>Search returns no result, please change the key words</span>
               :
               <span>The search is over</span>
           }
            </div>
        </div>
       
    )
}


export default QuestionList