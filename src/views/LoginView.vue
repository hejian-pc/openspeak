  <template>
    <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button>取消</el-button>
          <el-button @click="register">注册账号</el-button>
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
            const token = response.data.data;
            console.log('令牌:', token);
            // 将令牌存储在本地，这里使用LocalStorage示例
            localStorage.setItem('token', token);
            localStorage.setItem('username', this.form.name);
            localStorage.setItem('userId', this.form.userId);
            const returnUrl = this.$route.query.returnUrl || '/';
            this.$router.push(returnUrl);

            // 发送其他需要身份验证的请求时，在请求头部添加令牌
            // axios.get('http://localhost:8080/home', {
            // headers: {
            //       'Authorization': `Bearer ${token}`
            // }
            // })

          });

      },
      register(){
        this.$router.push({name:'register'});
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
    /* 控制表单容器的高度 */
  }
  </style>