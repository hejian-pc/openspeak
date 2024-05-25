<template>
  <el-container>

    <el-header>
      <div class="header-content">
        <button class="el-icon-user" @click="goToHome()">
          首页
        </button>
        <button class="el-icon-user" @click="loginStatus ? showMenu = !showMenu : goToLogin()">
          {{ loginStatus ? username : '未登录' }}
        </button>
        <div class="custom-dropdown" v-show="loginStatus && showMenu">
          <button @click="goToUserProfile()">个人中心</button>
          <button>喜欢列表</button>
          <button @click="logout()">登出</button>
        </div>
      </div>
    </el-header>

    <el-container>
      
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-menu-item
            v-for="category in categories"
            :key="category.categoryId"
            :index="`1-${category.categoryId}`"
            @click="handleMenuClick(category)"
          >
            {{ category.categoryName }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <div>
    <el-button type="primary" round @click="showPublishDialog = true">我要发布文章</el-button>
    
    <el-dialog title="发布文章" :visible.sync="showPublishDialog">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm(form.title,form.content,user.userId,categoryId)">提交</el-button>
      </div>
    </el-dialog>
  </div>
        <el-table :data="homeArticles" style="width: 100%" border show-header=false>
          <el-table-column>
            <template slot-scope="scope">
              <div @click="goToDetail(scope.row.articleId)">
                <strong>{{ scope.row.title }}</strong>
                <div style="max-height: 3em; overflow: hidden;">
                  {{ scope.row.content }}
                </div>
                <div>
                  作者: {{ scope.row.name }} 创建时间: {{ scope.row.publishDate }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <!-- 在需要登录的组件中添加一个模态框 -->
          <el-dialog title="提示" :visible.sync="showLoginModal">
            <p>您还未登录，请先登录！</p>
            <span slot="footer" class="dialog-footer">
              <el-button @click="goToLogin" type="primary">去登录</el-button>
            </span>
          </el-dialog>
        </div>
      </el-main>
    </el-container>
    <el-footer>
      {{ categoryId }}
    </el-footer>
    
  </el-container>
</template>
    
<script>
import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL
});

export default {
  data() {
    return {
      categories: [], // 分类列表
      homeArticles: [], // 主页文章列表
      categoryId: null, // 当前分类 ID
      categoryName: null, // 当前分类名称
      showMenu: false, // 显示菜单
      loginStatus: false, // 登录状态
      showLoginModal: false, // 显示登录模态框
      user: null, // 用户信息
      showPublishDialog: false, // 控制弹窗显示
      form: {
        title: '',
        content: ''
      }
    };
  },
  mounted() {
    this.queryCategories();
    this.checkLoginStatus();
    this.initializeCategory();
    this.loadUser();
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      if (token) {
        this.loginStatus = true;
        this.username = localStorage.getItem('username');
      } else {
        this.loginStatus = false;
        this.username = '';
      }
    },
    initializeCategory() {
      this.categoryId = this.$route.params.categoryId;
      this.categoryName = this.$route.params.categoryName;
      this.loadDataByCategoryId(this.categoryId);
    },
    queryCategories() {
      apiClient.get("/categories")
        .then(response => {
          if (response.data.code === 1) {
            console.log("Categories:", response.data);
            this.categories = response.data.data;
          } else {
            console.error('Error:', response.data.msg);
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    },
    loadUser() {
      apiClient.get(`/login/${this.username}`)
        .then(response => {
          if (response.data.code === 1) {
            this.user = response.data.data;
            //this.checkIfLiked(this.user.userId, this.articleId);
          }
        })
        .catch(this.handleError);
    },
    loadDataByCategoryId(categoryId) {
      const token = localStorage.getItem('token');
      console.log("Load data for category ID:", categoryId, "with token:", token);
      this.categoryId = categoryId;
      this.categoryName = this.$route.params.categoryName;

      apiClient.post(`/home/${categoryId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.code === 1) {
            console.log("Home articles:", response.data);
            this.homeArticles = response.data.data;
          } else {
            console.error('Error:', response.data.message);
            if (response.data.msg === "NOT_LOGIN") {
              this.showLoginModal = true;
            }
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    },
    handleMenuClick(item) {
      const { categoryId, categoryName } = item;
      // 判断是否需要更新路由参数
      if (this.categoryId !== categoryId) {
        // 更新路由参数并重新加载数据
        this.$router.push({ name: 'categories', params: { categoryId, categoryName } });
        this.loadDataByCategoryId(categoryId);
      }
    },
    goToDetail(articleId) {
      this.$router.push({ name: 'article', params: { articleId } });
    },
    goToLogin() {
      this.$router.push('/login');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.loginStatus = false;
      this.username = '';
    },
    Login() {
      this.$router.push({ name: 'login' });
    },
    goToUserProfile() {
      this.$router.push({ name: 'userprofile' });
    },
    goToHome() {
      this.$router.push({ name: 'home' });
    },
    submitForm(title,content,userId,categoryId) {
      // 提交表单逻辑
      console.log('Form submitted with:', this.form);

      apiClient.post(`/article`, {
        title,
        content,
        userId,
        categoryId
      })
        .catch(error => {
          console.error('Error:', error);
        });

      this.form.title = '';
      this.form.content = '';
      this.showPublishDialog = false;
    }
  }
};

</script>
    
<style>
.header-content {
  display: flex;
  align-items: center;
  position: relative;
  /* Add position relative */
  z-index: 999;
  /* Add a higher z-index */
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  position: relative;
  /* Add position relative */
  z-index: 1;
  /* Ensure a lower z-index than header content */
}

.el-dropdown-menu {
  position: absolute;
  /* Adjust dropdown menu position */
  top: 100%;
  /* Position below the button */
  left: 0;
  /* Align with the button */
  z-index: 9999;
  /* Ensure dropdown menu is on top */
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
.dialog-footer {
  text-align: right;
}
</style>