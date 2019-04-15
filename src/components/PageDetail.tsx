import React, {useContext} from 'react';
import {GlobalContext} from '../Container';
import Artical, { Question } from './Artical';
import styles from './comp.module.scss';
import {socketSend} from '../App';
import { listState } from '../types/enums';

interface props {
    socketSend: socketSend
}

const PageDetail = ({socketSend}: props) => {
    const context = useContext(GlobalContext);

    if(!context) return null;

    const {
        resultDetail,
        updateResultList,
    } = context;
    

    function goBackToList() {
        socketSend(3);
        updateResultList(undefined, listState["loading"]);
    }

    const detail = resultDetail.value[0];

    if(!detail) return null;

    return (
        <div className={styles.PageDetail}>
            <button onClick={goBackToList}>Back to result list</button>
            {
                <div>
                    <Question>{detail.question}</Question>
                    <div className={styles.AnswerSplit} />
                    <Artical>{detail.answer}</Artical>
                </div>
            }
          
        </div>
       
    )
}


export default PageDetail