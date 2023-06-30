import { Request, Response } from "express";


const sendResponse = (req: Request, res: Response, statusCode: number, message: string, data: Record<string, any> = {}) => {
        
    if(statusCode === 200 || statusCode === 201){
        res.status(statusCode).json({message, data})
    }else if(statusCode >= 400 && statusCode < 500){
        res.status(statusCode).json({error:message, data})
    }else if(statusCode >= 500){
        res.status(statusCode).json({error:message})
    }
}

export default sendResponse;
