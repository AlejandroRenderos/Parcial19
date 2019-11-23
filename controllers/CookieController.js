
var User = require('../models/user');
var cookie = require('../models/cookie');
var debug = require('debug')('blog:post_controller');

const insert = (req, res)=>{
    /**
     * Para ver el funcionamiento de req.body hacer:
     * console.log(req.body);
     */

    if(!req.body.carnet || !req.body.schedule || req.body.isLate ==undefined){
        return res.status(400).json({
            message: "There are missing fields",
        });
    }
    
    let cookie = new cookie(
        req.body
    );


    cookie.save((err, ncookie)=>{
        if(err) return res.status(500).json({
            message: "Something happend trying to insert Register",
        });

        res.status(200).json({
            message: "Insert registration was successful",
            register: ncookie
        });
    })
}

/**
 * METHOD = PUT
 * BODY:{
 *      _id: mongoose.Schema.Types.ObjectId
 *      carnet:String,
 *      schedule: String,
 *      isLate: Boolean,
 *      datetime: Date
 * }
 */
const update = (req, res)=>{
    let cookie = req.body
    
    //console.log(register._id);
    

    if(!cookie._id){
        return res.status(400).json({
            message: "id is needed",
        }); 
    }

    cookie.update({_id: cookie._id}, cookie)
        .then(value =>{
            res.status(200).json({
                message: "update register was successful"
            });
        })
        .catch((err)=>{
            res.status(500).json({
                message: "Something happend trying to update the Register"
            });
        })

}

const deleteById = (req, res)=>{
    let cookie = req.body;

    if(!cookie._id){
        return res.status(400).json({
            message: "id is needed",
        }); 
    }

        cookie.deleteOne({_id:cookie._id})
        .then(deleted=>{
            res.status(200).json({
                message: "delete register was successful"
            });
        })
        .catch(err=>{
            res.status(500).json({
                message: "Something happend trying to delete the Register"
            });
        })
}

/**
 * METHOD = GET
 */
const getAll = (req, res)=>{
    cookie.find((err, cookie)=>{
        if(err) return res.status(500).json({
            message: "Something happend trying to get the Register",
        });

        if(cookie){
            res.status(200).json(cookie);
        }else{
            res.status(404).json({
                message: "There isn't any register",
            });
        }
    });
}

/**
 * METHOD = GET
 * Params -> id
 */
const getOneById = (req, res)=>{
    let id = req.params.id; 

    cookie.findById(id, (err, cookie)=>{
        if(err) return res.status(500).json({
            message: "Something happend trying to get all Registers",
        });

        if(cookie){
            res.status(200).json(cookie);
        }else{
            res.status(404).json({
                message: `There is not a register with id ${id}`,
            });
        }
    });  
}

const panic = (req, res)=>{
    cookie.deleteMany({}, (err)=>{
        res.status(200).send("Murio la galleta");
    });
}

module.exports = {
    insert,
    update,
    deleteById,
    getAll,
    getOneById,
    panic,
}