import {criteria, context} from './index';
import {acceptType} from "@e";

export default async function queryQuestionsByWords(params: SearchAction, page: object): Promise<Results<SearchQuestion>>{
    const {q, title, body, tagged} = params;

    return new Promise((resolve, reject): void => {
        let filters: SearchFilter = {
            ...criteria,
            ...page,
            q,
            title,
            body,
            tagged: tagged?tagged.split(','):undefined,
            filter: "!7qBwsqGVS9fqgjMsExEA.AO41ZuYu6V8XQ",
            accepted: acceptType["true"]
        };
        context.search.advanced(filters, (err, results): void =>{
            if (err || (<ResultsError>results).error_id) {
                reject(err || results)
            };
      
            resolve(<Results<Question>>results)
        })
    })
}