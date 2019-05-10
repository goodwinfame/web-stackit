
import { Request, Response } from 'express';
import R from '@m/Response';
import { search } from "@s"


export default async function (req: Request, res: Response): Promise<Response> {
    if (!req.query.q && !req.query.title && !req.query.body && !req.query.tagged) {
        return new R(res).error(10002).send();
    }

    try {
        const result = await search.searchBriefQuestions(req.query, req.headers);
        return new R(res).load(result).send();

    } catch (error) {
        return new R(res).setStatus(500).send(error);
    }

}