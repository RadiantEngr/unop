import { Request, Response } from "express";

const healthCheck = (req: Request, res:Response) => {
    return res.json({
        message:"OK",
        statusCode: 200
    })

}

export default healthCheck;
