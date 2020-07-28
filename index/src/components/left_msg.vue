<template>
  <div>
    <h3>{{ msg }}</h3>
  </div>
</template>

<script>
export default {
  name: 'leftmsg',
  //组件的name不用在标签中写明，所追加的name值是为了方便父文件调用
  props: {
    msg: String,
  }
  // 子组件中的所有 props中的数据，都是通过父组件传递给子组件的，是只读的。
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 20px auto;
  text-align: center;
}
</style>
