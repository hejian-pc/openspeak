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

          <el-menu-item index="1-1" @click="handleMenuClick({ categoryId: 1, categoryName: '运动' })">运动</el-menu-item>
          <el-menu-item index="1-2" @click="handleMenuClick({ categoryId: 2, categoryName: '新闻' })">新闻</el-menu-item>
          <el-menu-item index="1-3" @click="handleMenuClick({ categoryId: 3, categoryName: '体育' })">体育</el-menu-item>
          <el-submenu index="1-4">
            <template slot="title">艺术</template>
            <el-menu-item index="1-4-1">风景画</el-menu-item>
          </el-submenu>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>

          <el-menu-item index="2-3">选项3</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-table :data="homeArticles" style="width: 100%" border show-header=false>
          <el-table-column>
            <template slot-scope="scope">
              <div @click="goToDetail(scope.row.articleId)">
                <strong>{{ scope.row.title }}</strong>
                <div style="max-height: 3em; overflow: hidden;">
                  {{ scope.row.content }}
                </div>
                <div>
                  作者: {{ scope.row.articleId }} 创建时间: {{ scope.row.publishDate }}
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
export default {
  data() {
    return {
      homeArticles: [],
      categoryId: null,
      showMenu: false,
      loginStatus: false,
      categoryName: null,
      showLoginModal: false
    }
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loginStatus = true;
      this.username = localStorage.getItem('username');
    } else {

      this.loginStatus = false;
      this.username = '';
    }
    this.categoryId = this.$route.params.categoryId;
    this.categoryName = this.$route.params.categoryName;
    this.loadDataByCategoryId(this.categoryId);
  },
  methods: {
    goToDetail(articleId) {
      this.$router.push({ name: 'article', params: { articleId: articleId } });
    },
    handleMenuClick(item) {
      const { categoryId, categoryName } = item;
      // 判断是否需要更新路由参数
      if (this.categoryId !== categoryId) {
        // 更新路由参数并重新加载数据
        this.$router.push({ name: 'categories', params: { categoryId: categoryId, categoryName: categoryName } });
        this.loadDataByCategoryId(categoryId);
      }
    },
    loadDataByCategoryId(categoryId) {
      const token = localStorage.getItem('token');
      console.log("categorice-token:" + token);
      this.categoryId = this.$route.params.categoryId;
      this.categoryName = this.$route.params.categoryName;
      // 根据 categoryId 加载相应的数据
      axios.post(`http://localhost:8080/home/${categoryId}`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.code == 1) {
            console.log(response.data);
            this.homeArticles = response.data.data;
          } else {
            // 响应失败，输出错误信息
            console.error('Error:', response.data.message);
            if (response.data.msg === "NOT_LOGIN") {
              this.showLoginModal = true;
            }
          }
        }).catch(error => {
          // 发生错误时的处理
          console.error('Error:', error);
        });
    },
    goToLogin() {
      // 可以使用路由来跳转到登录页面
      this.$router.push('/login');
    },
    logout() {
      localStorage.removeItem('token');  // 清除token
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
    }
  }
}
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
}</style>