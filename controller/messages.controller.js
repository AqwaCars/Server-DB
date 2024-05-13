// In your server-side controller (message.controller.js):

const { db } = require('../models/index');
const Message = db.Message;

module.exports.add = async (req, res) => {
  try {
    const { message, type, senderId, roomId } = req.body;

    // If the message is a Base64-encoded file, decode it
    const isBase64 = type && message && message.startsWith('data:');
    const fileData = isBase64 ? Buffer.from(message.split(';base64,')[1], 'base64') : null;

    const added = await Message.create({
      message: isBase64 ? 'file' : message,
      type,
      senderId,
      roomId,
      fileData: fileData || null,
    });

    res.json(added);
  } catch (e) {
    console.error(e);
    res.status(500).send('Internal Server Error');
  }
};

module.exports.getMessages = async (req,res)=>{
    try{
        const all = await Message.findAll({
            where:{
                roomId:req.params.id
            }
        })
        res.json(all)
    } catch(e){
        throw err
    }
}