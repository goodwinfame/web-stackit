
import { Request, Response } from 'express';
import R from '@m/Response';
import { search } from "@s"

export default function (req: Request, res: Response): void {
    if (!req.params.ids) {
        new R(res).error(10002).send();
        return;
    }

    try {

        search.searchDetailQuestions(req.params.ids.split(","), req.headers)
            .then((result): void=>{
                new R(res).load(result).send();
            })

    } catch (error) {
        new R(res).setStatus(500).send(error);
    }

}