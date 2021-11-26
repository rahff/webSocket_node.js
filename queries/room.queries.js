const { Room } = require('../database/models');

exports.getRoomByNsId = (nsId) =>{
    return Room.find({namespace: nsId}).exec()
} 