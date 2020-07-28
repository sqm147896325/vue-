 <!-- vue-cli编译时会简化变量使其不可访问，但是可以通过添加windows下的对象访问 -->

<template>
  <!-- 所有的内容都要在template标签下，他标志着这是一个组件 -->
  <div id="App">
    <leftmsg msg="this is my msg" />
    <leftmsg :msg="youname" />
    <div class="msg_box">
      <div
        v-for="(item,key) in allmsgs"
        :key="item.id"
        :class="item[1]=='r'?'right':'left'"
        :style="item[2] != chooseidnow ? 'display:none': 'display:block' "
      >消息是:{{ item[0] }}————————ta的序号是:{{key}}</div>
    </div>
    <div v-if="islogin" class="input_box">
      <input type="text" v-model="sendusername" @keyup.enter="senduser" placeholder="请输入用户名" />
      <button class="username" @click="senduser">登录</button>
    </div>
    <div v-if="!islogin" class="input_box">
      <input type="text" v-model="mysend" @keyup.enter="sendbtn" placeholder="请输入消息" />
      <button class="msg_send_btn" @click="sendbtn">发送</button>
    </div>
    <userlist v-if="!islogin" :userlist="userlist" />
    <userlist ref="userlist">
      <!-- 父元素调用子元素的ref占位 -->
    </userlist>
  </div>
</template>

<script>
import leftmsg from "./components/left_msg.vue";
import userlist from "./components/userlist.vue";
import io from "./assets/socket_io_2.3.0";
//用change写好socket再导入

function scrollToBottom() {
  var div = document.getElementsByClassName("msg_box")[0];
  div.scrollTop = div.scrollHeight;
}

export default {
  name: "App",
  data() {
    return {
      mysend: "",
      othersend: "",
      // 可以为空但是不可以只写不赋值，这样会被认为是未定义的
      sendusername: "",
      youname: "",
      msgs: [],
      ohtermsgs: [],
      allmsgs: [],
      islogin: true,
      userlist: [],
      socket: io("http://localhost:8080/"),
      choose: "",
      btndata: [],
      chooseidnow: "",
      // 直接在vue中调用你想用的，比如socketio
    };
  },
  methods: {
    sendbtn() {
      if (this.mysend != "") {
        this.msgs.push(this.mysend);
        this.allmsgs.push([this.mysend, "r", this.chooseidnow]);
        // 用this来代指当前的App
        this.mysend = "";
        this.socket.emit("btn", this.msgs);
      }
      //方法的书写格式要注意
    },
    senduser() {
      this.socket.emit("user", this.sendusername);
      this.youname = this.sendusername;
      this.sendusername = "";
      this.islogin = false;
    }
  },
  created() {
    this.socket.emit("first");

    this.socket.on("start", userlist => {
      console.log("连接成功");
      this.userlist = userlist;
      console.log(userlist);
    });

    this.socket.on("userdata", userdata => {
      this.userlist = userdata;
    });

    this.socket.on("updata", userdata => {
      this.userlist = userdata;
    });

    this.socket.on("otheruser", data => {
      console.log(data.from);
      this.othersend = data.data[data.data.length - 1];
      this.ohtermsgs.push(this.othersend);
      this.allmsgs.push([this.othersend, "l", data.from]);
      // 用this来代指当前的App
      this.othersend = "";
    });
  },
  components: {
    // 在这里进行组件注册
    leftmsg,
    userlist
  },
  watch: {
    allmsgs:function(i){
      this.$nextTick(()=>{
        scrollToBottom()
      })
      // 要正确调用渲染完成事件$nextTick，即使只有一段也要写回调
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  margin-top: 30px;
  text-align: center;
  margin: 0 auto;
}
.msg_box {
  border-radius: 20px;
  width: 600px;
  height: 400px;
  text-align: center;
  margin: 0 auto;
  border: 2px red solid;
  overflow: auto;
}
.right {
  margin: 5px;
  text-align: right;
  /* 消息右对齐 */
}
.left {
  margin: 5px;
  text-align: left;
}
.input_box {
  position: fixed;
  bottom: 150px;
  left: 40%;
  width: 220px;
}
input {
  margin: 0;
}
button {
  display: inline-block;
  height: 20px;
  width: 60px;
}
</style>
