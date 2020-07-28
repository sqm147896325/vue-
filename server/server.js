// socket是多线程，一个客户端对应一个线程io.on，
// 故服务器在发送数据时，一般只对单个客户端发送

let socketio = require('socket.io')
let http = require('http')
let fs = require('fs')
const { Socket } = require('dgram')

let my_server = http
  .createServer(function (request, response) {
    // 这里需要用fs模块获取网页，但是在项目搭建中，
    // 若网页以端口的形式展示，只需要确保两者的端口一致即可。
  })
  .listen(8080)

console.log('Server running at http://localhost:8080/')

let io = socketio(my_server)
let index = ''
let indexlist = ''
let userdata = new Array()
//登录的用户列表
let userlist = new Array()
let btndata
let iddata

io.on('connect', socket => {
  socket.emit('start', userdata)
  //向客户端发送数据表示他已经连接

  userlist[userlist.length] = socket.id

  socket.on('first', () => {
    for (let i = 0; i < userdata.length - 1; i++) {
      io.to(userlist[i]).emit('updata', userdata)
      console.log('已更新')
    }
  })

  socket.on('user', user => {
    userdata[userdata.length] = {
      username: user,
      userid: socket.id
    }
    console.log(userdata[userdata.length - 1].username + '  已登录')
    for (let i = 0; i < userlist.length; i++) {
      io.to(userlist[i]).emit('updata', userdata)
    }
  })

  socket.on('btn', data => {
    let a = 0;
    for (var i in iddata) {
      if (i == socket.id) {
        iddata.chooseuser.data = data
        iddata[i][1].data = data
        io.to(iddata[i][1].to).emit('otheruser', iddata[i][1])
      }
    }
  })

  socket.on('chooseuser', data => {
    if(iddata == undefined){
    iddata = {
      chooseuser: data,
      [socket.id] : [socket.id, data]
    }
    console.log('初始化')
  }else{
    iddata[socket.id] = [socket.id, data]
  }
  })

  socket.on('disconnect', () => {
    userdata.forEach((e, i) => {
      if (e.userid == socket.id) {
        index = i
      }
    })
    userlist.forEach((e, i) => {
      if (e == socket.id) {
        indexlist = i
      }
    })
    userlist.splice(indexlist, 1)
    if (userdata[index] == undefined) {
      console.log('游客登出')
    } else if (userdata[index].userid == socket.id) {
      userdata.splice(index, 1)
      delete iddata[socket.id]
      console.log(
        '索引值为' + index + '的的用户登出,当前用户数：' + userdata.length
      )
    } else {
      console.log('例外')
    }
  })
})
