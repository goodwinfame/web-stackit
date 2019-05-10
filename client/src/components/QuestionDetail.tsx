import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../Container';
import Artical from './Artical';
import styles from './comp.module.scss';
import { viewState, detailState } from '../enums';
import axios, { AxiosPromise } from 'axios';
import Loading from './Loading';

type Props = {
    id: number
}
const QuestionDetail = ({ id }: Props) => {
    const {
        updateView,
        questionList,
    } = useContext(GlobalContext) as Store.GlobalContext;

    const question = questionList.value.find(q => q.question_id === id);

    const [detail, setDetail] = useState({
        value: question?{
            ...questionList.value.find(q => q.question_id === id),
            answers: []
        } as Store.QuestionDetail:null,
        state: detailState["none"]
    })

    useEffect(() => {
        setDetail({
            ...detail,
            state: detailState["loading"]
        })
        axios(
            {
                method: 'get',
                url: `//127.0.0.1:8011/iteam/v2/knowledge/questions/${id}`,
                headers: {
                    "X-Page-Num": 1,
                    "X-Page-Size": 20
                }
            }
        )
            .then(({data, data: {data: {lists}, ret_code}}): AxiosPromise => {

                if(ret_code === 10000) {
                    const answerIds = ((lists[0] || {}).answers as Store.answerList || []).map(answer=>answer.answer_id);
                    return axios(
                        {
                            method: 'get',
                            url: `//127.0.0.1:8011/iteam/v2/knowledge/answers/${answerIds.join(',')}`,
                            headers: {
                                "X-Page-Num": 1,
                                "X-Page-Size": 99
                            }
                        }
                    )
                } else {
                    throw(data)
                }
                

            })
            .then(({data, data: {data: {lists}, ret_code}})=>{
                if(ret_code === 10000) {
                    setDetail({
                        value: Object.assign(detail.value, {
                            answers: lists
                        }),
                        state: detailState["none"]
                    })
                } else {
                    throw(data)
                }
                
            })
            .catch(error=>{
                setDetail({
                    value: detail.value,
                    state: detailState["none"]
                });
                console.log(error);
            })


    }, [id])

    if(detail.value === null) return null;

    function goBackToList() {
        updateView(viewState['list'], null);
    }


    return (
        <div className={styles.PageDetail}>
            <button onClick={goBackToList}>Back to result list</button>
            {
                <div>
                    <Artical>{detail.value.title}</Artical>
                    <Artical>{detail.value.body}</Artical>
                    <div className={styles.AnswerSplit} />
                    <ul>
                        {
                            detail.value.answers.map(answer=>(
                                <li key={answer.answer_id}>
                                    <Artical>{answer.title}</Artical>
                                    <Artical>{answer.body}</Artical>
                                </li>
                            ))
                        }
                    </ul>
                    <Loading status={detail.state === detailState['loading']}/>
                </div>
            }

        </div>

    )
}


export default QuestionDetail