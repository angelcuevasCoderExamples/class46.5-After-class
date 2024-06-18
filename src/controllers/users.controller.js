const { usersService } = require("../repositories")

class UsersControrller {

    static async getAll(req, res){
        try {
            const users = await usersService.getAll();
            
            res.send({status:'success', payload: users})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

    static async changeRole(req, res){

        const userId = req.params.userId; 

        try {
            const payload = await usersService.changeRole(userId);
            res.send({status:'success', payload: payload})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

    static async uploadDocuments(req, res){
        try {
            const {uid} = req.params; 
            const result = await usersService.addDocuments(uid, req.files)
            res.send({status:'success', payload: result})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

    static async uploadProfilePicture(req, res){
        try {
            const {uid} = req.params; 
            const result = await usersService.addProfilePicture(uid, req.file)

            res.send({status:'success', payload: result})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

}

module.exports = UsersControrller