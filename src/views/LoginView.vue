<template>
  <div class="form-container">
    <el-form ref="form" :model="form" class="login-form">
      <el-form-item label="用户名">
        <el-input v-model="form.name" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password" class="input-style"></el-input>
      </el-form-item>
      <el-form-item class="form-actions">
        <el-button type="primary" @click="onSubmit" class="button-style">登录</el-button>
        <el-button @click="onCancel" class="button-style">取消</el-button>
        <el-button @click="register" class="button-style">注册账号</el-button>
      </el-form-item>
    </el-form>
  </div>
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
        password: ''
      },
      user:{
        userId:'',
        image:''
      }
    };
  },
  methods: {
    onSubmit() {
      // 在这里处理提交表单的逻辑
      console.log('表单已提交！');
      console.log('用户名:', this.form.name);
      console.log('密码:', this.form.password);
      // 在这里可以向后端发送表单数据，执行其他操作
      // 登录请求
      apiClient.post('/login', {
        username: this.form.name,
        password: this.form.password
      })
        .then(response => {
          // 登录成功，获取JWT令牌
          if(response.data.code==1){
            const token = response.data.data;
            this.selectUser(this.form.name);
            // 将令牌存储在本地，这里使用LocalStorage示例
            localStorage.setItem('token', token);
            localStorage.setItem('username', this.form.name);
            

            const returnUrl = this.$route.query.returnUrl || '/';
            this.$router.push(returnUrl);
          }else{
            alert("错误！！！");
          }
        });
    },
    register() {
      this.$router.push({ name: 'register' });
    },
    onCancel() {
      this.$router.go(-1); // 返回上一个页面
    },
    selectUser(username){
      apiClient.get(`/login/${username}`, {
        })
            .then(response => {
                if (response.data.code === 1) {
                    console.log('返回的用户信息',response.data.data);
                    this.user = response.data.data;
                    console.log('返回的用户id',this.user.userId);
                    localStorage.setItem('imageUrl', this.user.image);
            localStorage.setItem('userId', this.user.userId);
                  
                } else {
                    // 响应失败，输出错误信息
                    console.error('Error:', response.data.msg);
                }
            })
            .catch(error => {
                console.log(error.response);
            });
    }
  }
};
</script>
  
<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
  /* Light grey background */
}

.login-form {
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
}

.input-style {
  border: none;
  border-bottom: 1px solid #ccc;
  border-radius: 0;
}

.button-style {
  margin-top: 10px;
  border: none;
  border-radius: 20px;
  color: white;
  background-color: #007BFF;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.el-form-item {
  margin-bottom: 24px;
}
</style>