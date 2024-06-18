const checkRole = (roles)=>(req, res, next)=>{
    const user = req.user; 

    if(!Array.isArray(roles)){
        roles=[roles]
    }

    if(!roles.includes(user.role)){ 
        return res.status(403).send({status:'error', error:`Unauthorized. You are not a ${roles}`})
    }

    next();
}

const checkAdmin = (req, res, next)=>{
    const user = req.user; 

    if(user.role != "admin"){
        return res.status(403).send({status:'error', error:`Unauthorized. You are not a ${role}`})
    }

    next();
}

const checkUser = (req, res, next)=>{
    const user = req.user; 

    if(user.role != "user"){
        return res.status(403).send({status:'error', error:`Unauthorized. You are not a ${role}`})
    }

    next();
}

module.exports = checkRole;