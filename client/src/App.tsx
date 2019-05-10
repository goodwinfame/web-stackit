import React, { useContext, useCallback } from 'react';
import styles from './index.module.scss';
import SearchInput from './components/SearhInput'
import QuestionList from './components/QuestionList'
import QuestionDetail from './components/QuestionDetail'
import { GlobalContext } from './Container'
import axios from 'axios';
import { viewState, listState } from './enums';

export default () => {

	const { 
		searchInput, 
		mainView, 
		questionList,
		updateQuestionList 
	} = useContext(GlobalContext) as Store.GlobalContext;

	
	async function search({ 
		q = searchInput.value, 
		tagged, 
		title, 
		body, 
		pageNum = 1, 
		pageSize = 20 
	}: Store.SearchParams): Promise<void> {
		updateQuestionList(undefined, undefined, listState["loading"]);
		const { data: { data: {lists}, ret_code }, headers } = await axios(
			{
				method: 'get',
				url: '//127.0.0.1:8011/iteam/v2/knowledge/search',
				params: { q, tagged, title, body },
				headers: {
					"X-Page-Num": pageNum,
					"X-Page-Size": pageSize
				}
			}
		)

		if (ret_code === 10000) {
				
			updateQuestionList((preState)=>({
				value: [
					...preState.value,
					...lists
				].filter((q, i, l)=>l.findIndex(v=>v.question_id === q.question_id) >= i), 
				pageNum, 
				state: Number(headers["x-total-count"]) > pageSize * pageNum?listState["hasnext"]:listState["none"]
			}));

		} else {
			updateQuestionList(undefined, undefined, listState["hasnext"]);

		}
	}
	return (
		<div className={`${styles.App} PageStatus-${mainView.state}`}>
			<SearchInput search={search} />
			{
				mainView.state === viewState['none']
				?
				null
				:
				mainView.state === viewState['list']
				?
				<QuestionList search={search} />
				:
				typeof (mainView.value) === 'number'
				&&
				<QuestionDetail id={mainView.value} />
			}
		</div>


	);
};
