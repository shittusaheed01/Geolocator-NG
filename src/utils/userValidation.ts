// const Joi = require('joi');
import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

const UserRegSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required(),
    name: Joi.string()
        .max(20)
        .required()
        .trim(),
    password: Joi.string()
        .required(),
    repeat_password: Joi.ref('password'),
})
.with('password', 'repeat_password');




const UserLoginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .required(),
    password: Joi.string()
        .required(),
})



export async function RegisterValidation(req: Request, res:Response, next:NextFunction) {
    const user : {
      email: string,
      name: string,
      password: string,
      repeat_password: string
    } = req.body

    try {
        await UserRegSchema.validateAsync(user)
        next()
    } catch (error: any) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}

export async function LoginValidation(req:Request, res: Response, next: NextFunction) {
    const user: {
        email: string,
        password: string
    } = req.body

    try {
        await UserLoginSchema.validateAsync(user)
        next()
    } catch (error: any) {
        next({
            message: error.details[0].message,
            status: 400
        })
    }
}
