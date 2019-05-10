import {criteria, context} from './index';



export default async function queryQuestionsByIds(ids: (string | number)[], page: object = {}): Promise<Results<Question>>{
    return new Promise((resolve, reject): void => {
        let filters: Defaultfilter = {
            ...criteria,
            ...page,
            filter: "!*e9ibzRMZ9Fb04KIB7kl4(KMOeuXXPoaf3T5w"
        };
        context.questions.questions(filters, (err, results): void =>{
            if (err || (<ResultsError>results).error_id) {
                reject(err || results)
            };
      
            resolve(<Results<Question>>results)
        }, ids.map((id): number=>Number(id)))
    })
}