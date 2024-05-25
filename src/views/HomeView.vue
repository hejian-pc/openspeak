<template>
  <el-container>

    <el-header style="color: rgb(20, 106, 181);">
      <div class="header-content">
        <button class="header-button" @click="loginStatus ? showMenu = !showMenu : goToLogin()">
          {{ loginStatus ? username : '未登录' }}
        </button>
        <div class="custom-dropdown" v-show="loginStatus && showMenu">
          <button @click="goToUserProfile()">个人中心</button>
          <button @click="logout()">登出</button>
        </div>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px" class="aside-container">
        <el-menu :default-openeds="['1', '3']">
          <el-menu-item v-for="category in categories" :key="category.categoryId" :index="`1-${category.categoryId}`"
            @click="handleMenuClick(category)">
            {{ category.categoryName }}
          </el-menu-item>
          <el-menu-item>
            <el-button type="primary" round @click="showPublishDialog = true">添加新的分类</el-button>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main-content">
        <el-table :data="homeArticles" style="width: 100%" border>
          <el-table-column label="文章列表">
            <template slot-scope="scope">
              <div @click="goToDetail(scope.row.articleId)" class="article-box">
                <strong>{{ scope.row.title }}</strong>
                <div class="article-content">
                  {{ scope.row.content }}
                </div>
                <div class="article-info">
                  作者: {{ scope.row.name }} 创建时间: {{ scope.row.publishDate }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="block">
        <el-pagination
          layout="prev, pager, next"
          :total="totalItems"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange"
        >
        </el-pagination>
      </div>
      </el-main>

    </el-container>

    <el-footer class="footer">
      footer
    </el-footer>
    <el-dialog title="新增分类" :visible.sync="showPublishDialog">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="分类描述">
          <el-input type="textarea" v-model="form.categoryDescription"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPublishDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm(form.categoryName, form.categoryDescription)">提交</el-button>
      </div>
    </el-dialog>
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
      showPublishDialog: false, // 控制弹窗显示
      currentPage: 1, // 当前页码
      pageSize: 6, // 每页显示条数
      form: {
        categoryName: '',
        categoryDescription: ''
      }
    };
  },
  computed: {
    totalItems() {
      return this.homeArticles.length;
    },
    pagedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      console.log("页码大更新");
      console.log(this.homeArticles.slice(start, end));
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
    },
    submitForm(categoryName, categoryDescription) {
      // 提交表单逻辑
      console.log('Form submitted with:', categoryName);

      apiClient.post(`/categories`, {
        categoryName,
        categoryDescription
      })
        .catch(error => {
          console.error('Error:', error);
        });

      this.form.categoryName = '';
      this.form.categoryDescription = '';
      this.queryCategories();
      this.showPublishDialog = false;

    }
  }
};

</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  position: relative;
  z-index: 999;
  
}

.header-button {
  background: #409EFF;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 15px;
  margin-left: 10px;
  color: #FFFFFF;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.header-button:hover {
  background-color: #e0e0e0;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  left: auto;
  right: 20px;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px;
  z-index: 9999;
}

.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.aside-container {
  background-color: #D3DCE6;
  color: #333;
}

.main-content {
  background-color: #E9EEF3;
  padding: 20px;
}

.article-box {
  padding: 15px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s;
}

.article-box:hover {
  background-color: #f9f9f9;
}

.article-content {
  margin-top: 10px;
  color: #666;
  max-height: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-info {
  margin-top: 10px;
  color: #999;
  font-size: 12px;
}

.dialog-footer {
  text-align: right;
}

.block {
  text-align: center;
  margin-top: 20px;
}
</style>