
import {queryAnswersByIds, queryQuestionsByWords, queryQuestionsByIds} from './index';
import { IncomingHttpHeaders } from 'http2';

type returnResult<T> = {
    retCode: number;
    retMsg: string;
    lists?: T[];
} | {
    lists: T[];
    total: number;
}

async function searchBriefQuestions(params: SearchAction, headers: IncomingHttpHeaders): Promise<returnResult<SearchQuestion>> {
    
    const page = {
        pagesize: headers["x-page-size"] || 20,
        page: headers["x-page-num"] || 1
    }

    try {
        const questions = await queryQuestionsByWords(params, page);

        const answers = await queryAnswersByIds(questions.items.map((v): number=>v.accepted_answer_id), page, "!LeJQlE5JhZfzYuB9qBPx8-");

        return {
            lists: questions.items.map((v): SearchQuestion=>({
                ...v,
                "accepted_answer": answers.items.find((a): boolean=>a.answer_id === v.accepted_answer_id),
            })),
            total: questions.total
        }
    } catch(error) {
        return {
            retCode: error.error_id,
            retMsg: error.error_message
        }
    }
    
}

async function searchDetailQuestions(ids: (string | number)[], headers: IncomingHttpHeaders): Promise<returnResult<Question>> {
    
    const page = {
        pagesize: headers["x-page-size"] || 20,
        page: headers["x-page-num"] || 1
    }

    try {
        const questions = await queryQuestionsByIds(ids, page);


        return {
            lists: questions.items,
            total: questions.total
        }
    } catch(error) {
        return {
            retCode: error.error_id,
            retMsg: error.error_message
        }
    }
    
}

async function searchDetailAnswers(ids: (string | number)[], headers: IncomingHttpHeaders): Promise<returnResult<Answer>> {
    
    const page = {
        pagesize: headers["x-page-size"] || 20,
        page: headers["x-page-num"] || 1
    }

    try {
        const answers = await queryAnswersByIds(ids, page);


        return {
            lists: answers.items,
            total: answers.total
        }
    } catch(error) {
        return {
            retCode: error.error_id,
            retMsg: error.error_message
        }
    }
    
}


export default {
    searchBriefQuestions,
    searchDetailAnswers,
    searchDetailQuestions
}


