import {criteria, context} from './index';

export default async function queryAnswersByIds(ids: (string | number)[], page: object = {}, filter: string = "!)5ne3-sivbCO1s5yrtC8LUY(VAlD"): Promise<Results<Answer>>{
    return new Promise((resolve, reject): void => {
        let filters: Defaultfilter = {
            ...criteria,
            ...page,
            filter
        };
        context.answers.answers(filters, (err, results): void =>{
            if (err || (<ResultsError>results).error_id) {
                reject(err || results)
            };
      
            resolve(<Results<Answer>>results)
        }, ids.map((id): number=>Number(id)))
    })
}