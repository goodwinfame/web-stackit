import searchAction from './search';
import queryAnswersByIdsAction from './queryAnswersByIds';
import queryQuestionsByIdsAction from './queryQuestionsByIds';
import queryQuestionsByWordsAction from './queryQuestionsByWords'
import Stackexchange from "stackexchange"
import {sortType, orderType} from "@e";

const options: StackOptions = { version: 2.2 };

export const context = new Stackexchange(options);


export const criteria: Criteria = {
    key: "3GBT2vbKxgh*ati7EBzxGA((",
    pagesize: 20,
    sort: sortType["activity"],
    order: orderType['asc']
};

export const search = searchAction;
export const queryAnswersByIds = queryAnswersByIdsAction;
export const queryQuestionsByIds = queryQuestionsByIdsAction;
export const queryQuestionsByWords = queryQuestionsByWordsAction;

