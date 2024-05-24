<template>
    <el-container>
        <el-header>
            注册账号
        </el-header>
        <div class="form-container">
        <el-form ref="form" :model="form" label-width="150px">
            <el-form-item label="用户名">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="名字">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="简介">
                <el-input type="textarea" v-model="form.otherInfo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="redirectToLogin">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
        <el-footer>
            footer
        </el-footer>
    </el-container>
</template>
<script>
import axios from 'axios';
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
});
  export default {
    data() {
      return {
        form: {
          name: '',
          username: '',
          password: '',
          email: '',
          otherInfo: ''
        }
      }
    },
    methods: {
      onSubmit() {
        
        apiClient.post('/register', {
          username: this.form.username,
          password: this.form.password,
          name:this.form.name,
          email:this.form.email,
          otherInfo:this.form.otherInfo
        })
          .then(response => {
            if(response.data.code==1){
                this.$alert('点击确定按钮进行登录', '注册成功', {
                confirmButtonText: '确定',
                callback:  this.redirectToLogin
        });
            }
          });
    },
    redirectToLogin() {
    this.$router.push({ name: 'login' });
  }
}
  }
</script>

<style>
.form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    /* 控制表单容器的高度 */
  }
</style>