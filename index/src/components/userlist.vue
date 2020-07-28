<template>
  <div id="userlist">
    <h5>快点击列表中的伙伴聊天吧~</h5>
    <div
      :class="'user'"
      v-for="(item,key) in userlist"
      :key="key"
      :userid="item.userid"
      @click="chooseuser"
    >{{change}}&nbsp;{{item.username}}</div>
    <!-- 组件中可以实现属性的动态循环绑定，如上示userid -->
  </div>
</template>

<script>
export default {
  name: "userlist",
  props: {
    userlist: Array
    //子组件中的所有 props中的数据，都是通过父组件传递给子组件的，是只读的。
  },
  data() {
    return {
      change: "选择用户：",
      choosedata: "",
      isred: Array,
    };
    // 子组件中的data数据，不是通过父组件传递的是子组件私有的，是可读可写的。
  },
  methods: {
    //组件中定义的data,props变量实际上this的属性
    chooseuser(click) {
      // 实参click作为点击事件的监听
      this.choosedata = {
        from: this.$parent.socket.id,
        // 父组件访问子组件通过this.$parent
        to: click.target.getAttribute("userid"),
        data: Array
      };
      this.$parent.chooseidnow = this.choosedata.to;
      this.$parent.socket.emit("chooseuser", this.choosedata);
      document.getElementsByClassName("user").forEach(e => {
        e.setAttribute("id", "");
      });
      document.querySelectorAll("div[userid]").forEach(e => {
        if (e.getAttribute("class") != "red") {
          e.setAttribute("class", "user");
        }
      });
      click.target.setAttribute("class", "choose");
    }
  },
  created() {
    // 通过$parent实现子组件socket监听
    this.$parent.socket.on("otheruser", data => {
      document.querySelectorAll("div[userid]").forEach(e => {
        if (e.getAttribute("userid") == data.from) {
          e.setAttribute("class", "red");
        }
      });
    });
  },
};
</script>

<style lang="css" scoped>
h5 {
  text-align: center;
}
#userlist {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 200px;
  font-size: 16px;
  background-color: cadetblue;
}
.user {
  margin: 10px;
  background-color: darkcyan;
  transition: all 0.3s;
}
.red {
  margin: 10px;
  background-color: red;
  transition: all 0.3s;
}
.user:hover {
  color: aqua;
}
.choose {
  margin: 10px;
  padding: 2px;
  background-color: rgb(0, 60, 255);
  transition: all 0.3s;
}
</style>