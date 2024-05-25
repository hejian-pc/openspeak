<template>
  <el-container>
    <el-header class="header">
      注册账号
    </el-header>
    <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px" class="register-form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" class="input-style"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" class="input-style"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" class="input-style"></el-input>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="form.name" class="input-style"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="form.otherInfo" class="input-style"></el-input>
        </el-form-item>
        <el-form-item class="form-actions">
          <el-button type="primary" @click="onSubmit" class="button-style">立即创建</el-button>
          <el-button @click="redirectToLogin" class="button-style">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-footer class="footer">
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
        name: this.form.name,
        email: this.form.email,
        otherInfo: this.form.otherInfo
      })
        .then(response => {
          if (response.data.code == 1) {
            this.$alert('点击确定按钮进行登录', '注册成功', {
              confirmButtonText: '确定',
              callback: this.redirectToLogin
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

<style scoped>
.header {
  text-align: center;
  font-size: 24px;
  padding: 20px 0;
  background-color: #f0f0f0;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
}

.register-form {
  width: 400px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
}

.input-style {
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
  padding: 10px;
}

.button-style {
  width: 100px;
  margin: 0 10px;
  border: none;
  border-radius: 20px;
  color: white;
  background-color: #007BFF;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.footer {
  text-align: center;
  padding: 10px 0;
  background-color: #f0f0f0;
  margin-top: 20px;
}
</style>