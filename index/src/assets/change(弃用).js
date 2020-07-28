import io from './socket_io_2.3.0';
//导入socket-io用于与服务通讯

window.socket = io('http://localhost:8080/');

socket.emit('first')

socket.on('start', (userlist)=>{
  console.log('连接成功')
  window.myuserlist = userlist
})

socket.on('userdata',(userdata)=>{
    window.myuserlist = userdata;
})

socket.on('updata',(userdata)=>{
    window.myuserlist = userdata;
    console.log('更新用户列表')
})



