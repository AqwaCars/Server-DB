const {db} = require("../models/index");
const { Sequelize, Op } = require("sequelize");

module.exports.makeRoom = async (req,res)=>{
    try{

        const added = await db.RoomChat.create({
            user2:req.body.user2,
            UserId:req.body.UserId
        })
        res.json(added)
    } catch(err){
        throw err
    }
}

module.exports.getAll = async (req, res)=>{
    try{
        const all = await db.RoomChat.findAll({
            where:{
                UserId:req.params.id
            }
        })
        res.json(all)
    } catch(err){
        throw err
    }
}
module.exports.getAllUser2 = async (req, res)=>{
    try{
        const all = await db.RoomChat.findAll({
            where:{
                user2:req.params.id
            }
        })
        res.json(all)
    } catch(err){
        throw err
    }
}

module.exports.getOneRoom = async (req, res)=>{
    try{
        const {user1 , user2} = req.body
        console.log(req.body,"eeeeeeeeeeeeeeeeeeeeeeee");
        const room = await db.RoomChat.findOne({
            where:{
                UserId:user1,
                user2:user2
            }
        })
        res.json(room)
    } catch(err){
        throw err
    }
}