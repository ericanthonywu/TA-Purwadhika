const mongoose = require('mongoose');
const config = require('config');
const moment = require('moment-timezone');
const { exec } = require('child_process');
const Room = mongoose.model('Room');
const Utils = require('../utils');
const LiveStatus = require('../liveStatus');
const roomList = {};

module.exports = io => {
  function socketIdsInRoom(roomName) {
    var socketIds = io.nsps['/'].adapter.rooms[roomName].sockets;
    if (socketIds) {
      var collection = [];
      for (var key in socketIds) {
        collection.push(key);
      }
      return collection;
    } else {
      return [];
    }
  }

  function createNewRoom(roomName, error) {
    roomList[roomName] = {
      participant: [],
      countHeart: 0,
      countViewer: 1,
      messages: []aa
    };
    // }
  }

  function findParticipant(socketId) {
    for (let roomName in roomList) {
      for (let i = 0; i < roomList[roomName].participant.length; i++) {
        if (roomList[roomName].participant[i].socketId == socketId) {
          return roomList[roomName].participant[i];
        }
      }
    }
    return null;
  }

  io.on('connection', socket => {
    console.log('connection');

    socket.on('disconnect', () => {
      console.log('Disconnect');
      const { roomName, userId, liveStatus } = socket;
      for (let roomName in roomList) {
        for (let i = 0; i < roomList[roomName].participant.length; i++) {
          if (roomList[roomName].participant[i].socketId == socket.id) {
            socket.broadcast.to(roomName).emit('leave-client');
            roomList[roomName].participant.splice(i, 1);
            break;
          }
        }
        if (
          roomList.hasOwnProperty(roomName) &&
          roomList[roomName].participant.length === 0
        ) {
          delete roomList[roomName];
        }
      }
      if (socket.roomName) {
        socket.leave(socket.roomName);
      }
      console.log(JSON.stringify(roomList));
      if (liveStatus === LiveStatus.REGISTER) {
        Room.findOneAndRemove({ roomName, userId }).exec((error, result) => {
          console.log(error);
        });
      }
    });


        }
      });
    });
  });
};
