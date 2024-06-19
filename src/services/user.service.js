const MailingService = require("./mailing.service");

const mailingService = new MailingService();

class UsersService {
    constructor(dao){
        this.dao = dao;
    }

    async getAll(queryParams = null){
        return await this.dao.getAll()
    }

    async getById(id){    
        const item = await this.dao.getById(id); 
        if(!item) throw { message:`There's no Item by id ${id}`, status:400 }
        return item;
    }

    async getByProperty(property, value){
        const item = await this.dao.getByProperty(property, value); 
        if(!item) throw { message:`There's no Item by ${property} = ${value}`, status:400 }
        return item;
    }


    async create(user){
        return await this.dao.create(user);
    }

    async update(id, user){
        await this.dao.getById(id);
        return await this.dao.update(id, user);
    }

    async delete(id){
        await this.dao.getById(id);
        return await this.dao.delete(id);
    }

    async setLastConnection(id){
        const user = await this.getById(id);
        await this.update(id, {last_connection: new Date()})
    }

    async addDocuments(id, files){
        const user = await this.getById(id);
        let documents = user.documents || []; 
        
        documents = [...documents,...(files.map(file=>{
            return {name: file.originalname, reference: file.path.split('public')[1].replace(/\\/g,'/')}
        }))]

        return await this.update(id, {documents: documents})
    }
    async addProfilePicture(id, file){
        await this.getById(id);
        return await this.update(id, {profile_picture: file.path.split('public')[1].replace(/\\/g,'/')})
    }

    async changeRole(userId){
        const user = await this.getById(userId);
        if(user.role == 'user'){
            if(!user.documents.some(d=>d.name.includes('Identificacion'))){
                throw new Error('Missing documents')
            }
            if(!user.documents.some(d=>d.name.includes('Comprobante de domicilio'))){
                throw new Error('Missing documents')
            }
            if(!user.documents.some(d=>d.name.includes('Comprobante de estado de cuenta'))){
                throw new Error('Missing documents')
            }
        }

        if(!['user', 'premium'].includes(user.role)){
            throw new Error('User has invalid role')
        }

        user.role = user.role == 'user' ?  'premium' : 'user'


        await this.update(user._id.toString(), {$set: {role: user.role}})
        return await this.getById(userId)
    }

    async deleteUnactive(){
        const users = await this.getAll();
        const now = new Date();
        let deletedCount = 0; 

        //usar users.every o for of 
        //evitemos usar users.foreach si dentro vamos a hacer operaicones asincrónicas
        // users.every(()=>{
        //     return true; 
        // })
        
        const TOLERABLE_TIME = 60 * 24 * 2; //cantidad de minutos equivalente a dos días

        for(const user of users){
            if(user.last_connection){
                if(this.getMinutesDifference(now, user.last_connection) > TOLERABLE_TIME ){
                    await this.delete(user._id);
                    await mailingService.sendDeletedAccountMail(user.first_name, user.email)
                    deletedCount++;
                }
            }
        }

        return deletedCount; 
    }

    getMinutesDifference(now, last_connection){
        let milisecondsDif = now - last_connection
        let minutes =  Math.round((milisecondsDif/1000)/60)
        console.log("minutes", minutes)
        return minutes; 
    }
}


module.exports = UsersService;