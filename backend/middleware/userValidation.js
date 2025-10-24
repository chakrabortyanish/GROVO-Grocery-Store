// I can use this code to validate user input for sign-up and log-in routes in an Express.js application. 

import Joi  from "joi";

const signUpValidation = (req,res, next)=>{
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(60).required(),
        lastName: Joi.string().min(3).max(60),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(60).required(),
    });

    const {error} = schema.validate(req.body); // destructure

    if(error){
        return res.status(400).json({ message : "Bad request", error})
    }
 
    next();
}

const logInValidation = (req, res, next)=>{
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(60).required(),
    });

    const {error} = schema.validate(req.body); // destructure

    if(error){
        return res.status(400).json({ message : "Bad request", })
    }

    next();
}

export {signUpValidation, logInValidation}

