const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');
const MailingService = require('../services/mailing.service');
const CustomError = require('../utils/errorHandling/CustomError');
const ErrorTypes = require('../utils/errorHandling/ErrorTypes');
const { usersService } = require('../repositories');
const { hashPassword, isValidPassword } = require('../utils');

const mailingService = new MailingService();

class SessionController {
    static async registerUser(req, res) {
        res.send({ status: 'success', message: 'User registered successfuly', payload: req.user })
    }
    static async getRegisterError(req, res, next) {
        try {
            throw new CustomError({
                name:"invalid register",
                cause: 'invalid register', 
                message: 'There was a problem registering user', 
                code: ErrorTypes.INVALID_TYPE_ERROR
            })
        } catch (error) {
            next(error)
        }
       
    }
    static async login(req, res) {
        try {
            const { _id, first_name, last_name, role, email, cart, age } = req.user;
            const serializableUser = {
                id: _id,
                first_name,
                last_name,
                role,
                age,
                cart,
                email
            }
            const token = jwt.sign(serializableUser, jwtSecret, { expiresIn: '1h' })
            res.cookie('jwtCookie', token);
            await usersService.setLastConnection(_id)
            res.send({ status: 'success', message: 'User logged successfuly' })
        } catch (error) {
            res.status(error.status || 500).send({ status: 'error', message: error.message })
        }
    }
    static async getLoginError(req, res){
        res.status(400).send({status:'error', error:'There has been a problem with the login process'})
    }
    static async logout(req, res){
        await usersService.setLastConnection(_id)
        res.clearCookie('jwtCookie')
        res.redirect('/login')
    }
    static async processGithub(req,res){
        try {
            const {_id, first_name, last_name, role, email,cart, age} = req.user; 
            const serializableUser = {
                id: _id, 
                first_name,
                last_name,
                role, 
                age,
                cart, 
                email
            }
            const token = jwt.sign(serializableUser,'JWT_SECRET',{expiresIn:'1h'})
            res.cookie('jwtCookie', token);
            res.redirect('/items')   
        } catch (error) {
            res.status(error.status || 500).send({ status: 'error', message: error.message })
        }
    }
    static async getCurrent(req, res){
        const user = req.user; 
        const userDTO= new UserDTO(user);
        res.send({payload: userDTO})
    }  

    static async resetPassword(req, res){
        try {
            const {email} = req.body; 
            let user = await usersService.getByProperty("email",email)
            const passwordResetToken = jwt.sign(user,jwtSecret,{expiresIn:'1h'}) 

            await mailingService.sendPasswordResetMail(user, email, passwordResetToken)
            res.send({payload: true})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }  

    static async verifyToken(req, res){
        const {passwordResetToken} = req.params; 

        try {
            jwt.verify(passwordResetToken, jwtSecret, (error)=>{
                if(error){
                    return res.redirect('/reset-password')
                }
                res.redirect('/change-password')
            })
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }  

    static async changePassword(req, res){

        try {
            const {email, password} = req.body; 
            let user = await usersService.getByProperty("email",email)
            if(isValidPassword(user, password)){
                return res.status(400).send({status:'erorr', error:'same password'})
            }

            user.password = password;


            await usersService.update(user._id.toString(), {$set: {password: hashPassword(user.password)}})

            res.send({status: 'success'})
        } catch (error) {
            console.log("ERROR", error)
            res.status(500).send({status:'error', error: error.message})
        }
    }  

}

module.exports = SessionController;