const UserDTO = require("../dao/DTOs/UserDTO");
const { usersService } = require("../repositories")

class UsersControrller {

    static async getAll(req, res){
        try {
            const users = await usersService.getAll();
            const userDTOs = users.map(user=>new UserDTO(user))
            res.send({status:'success', payload: userDTOs})
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

    static async deleteUnactive(req, res){
        try {
            const deletedCount = await usersService.deleteUnactive()

            res.send({status:'success', payload: {deletedCount}})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

    static async updateUser(req, res){

        const uid = req.params.uid; 
        const {role} = req.body;
        try {
            const payload = await usersService.update(uid,{role});
            res.send({status:'success', payload: payload})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

    static async deleteUser(req, res){

        const uid = req.params.uid; 

        try {
            const payload = await usersService.delete(uid);
            res.send({status:'success', payload: payload})
        } catch (error) {
            res.status(500).send({status:'error', error: error.message})
        }
    }

}

module.exports = UsersControrller