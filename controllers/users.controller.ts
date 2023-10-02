import { Request, Response } from 'express';

export default {
    all(_req: Request, res: Response) {
        res.send('all users');
    }
}