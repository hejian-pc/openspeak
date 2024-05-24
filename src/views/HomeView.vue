<template>
  <el-container>

    <el-header>
      <div class="header-content">
        <button class="el-icon-user">
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
        <el-table :data="pagedArticles" style="width: 100%" border>
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
        <div class="block">
          <el-pagination layout="prev, pager, next" 
          :total="totalItems"
          :current-page="currentPage"
          @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </el-main>

    </el-container>

    <el-footer>
      footer
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
      showMenu: false, // 显示菜单
      loginStatus: false, // 登录状态
      username: '', // 用户名
      currentPage: 1, // 当前页码
      pageSize: 8, // 每页显示条数
    };
  },
  computed: {
    totalItems() {
      return this.homeArticles.length;
    },
    pagedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.homeArticles.slice(start, end);
    },
  },
  mounted() {
    this.queryCategories();
    this.checkLoginStatus();
    this.fetchHomeArticles();
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
    fetchHomeArticles() {
      const token = localStorage.getItem('token');
      apiClient.get("/home", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (response.data.code === 1) {
          console.log(response.data);
          this.homeArticles = response.data.data;
        } else {
          console.error('Error:', response.data.msg);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
    },
    queryCategories() {
      apiClient.get("/categories")
      .then(response => {
        if (response.data.code === 1) {
          console.log(response.data);
          this.categories = response.data.data;
        } else {
          console.error('Error:', response.data.msg);
        }
      })
      .catch(error => {
        console.log(error.response);
      });
    },
    goToDetail(articleId) {
      this.$router.push({ name: 'article', params: { articleId: articleId } });
    },
    handleMenuClick(item) {
      this.$router.push({ name: 'categories', params: item });
    },
    goToLogin() {
      this.$router.push('/login');
    },
    logout() {
      console.log("点击了按钮");
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.loginStatus = false;
      this.username = '';
    },
    goToUserProfile() {
      this.$router.push({ name: 'userprofile' });
    },
    handlePageChange(page) {
      this.currentPage = page;
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
}</style>