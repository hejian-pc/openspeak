<template>
  <el-container>
    <!-- 头 -->
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
    <!-- 头与脚之间 -->
    <el-container>
      <!-- 侧边 -->
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
      <!-- 主体 -->
      <el-main>
        <el-table :data="homeArticles" style="width: 100%" border show-header=false>
          <el-table-column>
            <template slot-scope="scope">
              <div>
                <strong>{{ scope.row.title }}</strong>
                <div>
                  {{ scope.row.content }}
                </div>
                <div>
                  作者: {{ scope.row.name }} 创建时间: {{ scope.row.publishDate }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 评论列表 -->
        <div>
          <h3>评论列表</h3>
          <div class="comment-container" v-for="comment in comments" :key="comment.replyId">
            <div class="comment-box">
              <div>{{ comment.replyContent }}</div>
              <div class="comment-info">评论人: {{ comment.name }} | 评论时间: {{ comment.replyDate }}</div>
            </div>
          </div>
        </div>
        <!-- 评论输入框 -->
        <div>
          <el-input v-model="newComment" placeholder="请输入评论内容"></el-input>
          <template v-if="loginStatus">
            <el-button @click="postComment(user.userId, articleId, newComment)">发表评论</el-button>
          </template>
          <template v-else>
            <router-link :to="{ name: 'login', query: { returnUrl: this.$route.fullPath } }">
              登录后发表评论
            </router-link>
          </template>
        </div>

        <!-- 点赞按钮 -->
        <div>
          <template v-if="loginStatus">
          <el-button @click="toggleLike(user.userId, articleId)">{{ liked ? '取消点赞' : '点赞' }}</el-button>
          <span v-if="liked">已点赞</span>
        </template>
        <template v-else>
            <router-link :to="{ name: 'login', query: { returnUrl: this.$route.fullPath } }">
              登录后点赞
            </router-link>
          </template>
        </div>
        <div>
          <!-- 在需要登录的组件中添加一个模态框 -->
        </div>
      </el-main>
    </el-container>
    <!-- 脚 -->
    <el-footer>
      文章ID: {{ articleId }}
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
      articleId: null, // 当前文章 ID
      showLoginModal: false, // 显示登录模态框
      showMenu: false, // 显示菜单
      loginStatus: false, // 登录状态
      liked: false, // 是否已点赞
      comments: [], // 评论列表
      newComment: '', // 新评论内容
      user: null, // 用户信息
      username: localStorage.getItem('username') || '', // 用户名
    };
  },

  mounted() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.queryCategories();
      this.checkLoginStatus();
      this.loadArticleId();
      this.loadHomeArticles();
      this.loadComments();
      this.loadUser();
    },

    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.loginStatus = !!token;
      if (this.loginStatus) {
        this.username = localStorage.getItem('username');
      } else {
        this.username = '';
      }
    },

    loadArticleId() {
      this.articleId = this.$route.params.articleId || localStorage.getItem('articleId');
      localStorage.setItem('articleId', this.articleId);
    },

    loadHomeArticles() {
      const token = localStorage.getItem('token');
      apiClient.get(`/home/${this.articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.code === 1) {
            this.homeArticles = response.data.data;
          } else {
            this.handleErrorResponse(response.data);
          }
        })
        .catch(this.handleError);
    },

    loadComments() {
      apiClient.get(`/replies/${this.articleId}`)
        .then(response => {
          if (response.data.code === 1) {
            this.comments = response.data.data;
          }
        })
        .catch(this.handleError);
    },

    loadUser() {
      apiClient.get(`/login/${this.username}`)
        .then(response => {
          if (response.data.code === 1) {
            this.user = response.data.data;
            this.checkIfLiked(this.user.userId, this.articleId);
          }
        })
        .catch(this.handleError);
    },

    queryCategories() {
      apiClient.get("/categories")
        .then(response => {
          if (response.data.code === 1) {
            this.categories = response.data.data;
          } else {
            this.handleErrorResponse(response.data);
          }
        })
        .catch(this.handleError);
    },

    handleMenuClick(item) {
      this.$router.push({ name: 'categories', params: item });
    },

    goToDetail(articleId) {
      this.$router.push({ name: 'article', params: { articleId } });
    },

    postComment(userId, articleId, commentContent) {
      apiClient.post('/replies', {
        articleId,
        userId,
        replyContent: commentContent
      })
        .then(response => {
          if (response.data.code === 1) {
            this.comments.push(response.data.data); // 更新评论列表
            this.newComment = ''; // 清空新评论内容
            this.loadComments();
          }
        })
        .catch(this.handleError);
    },

    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.loginStatus = false;
      this.username = '';
    },

    goToLogin() {
      this.$router.push('/login');
    },

    Login() {
      this.$router.push({ name: 'login', query: { returnUrl: this.$route.fullPath } });
    },

    goToUserProfile() {
      this.$router.push({ name: 'userprofile' });
    },

    goToHome() {
      this.$router.push({ name: 'home' });
    },

    async checkIfLiked(userId, articleId) {
      try {
        const response = await apiClient.post('/likes', { articleId, userId });
        if (response.data.data === 1) {
          this.liked = true;
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },

    toggleLike(userId, articleId) {
      try {
        if (this.liked) {
          apiClient.delete('/like', {
            data: { articleId, userId }
          });
        } else {
          apiClient.post('/like', { articleId, userId });
        }
        this.liked = !this.liked;
      } catch (error) {
        console.error('Error:', error);
      }
    },

    handleErrorResponse(data) {
      console.error('Error:', data.msg);
      if (data.msg === "NOT_LOGIN") {
        this.showLoginModal = true;
      }
    },

    handleError(error) {
      console.error('Error:', error);
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

.comment-container {
  margin-bottom: 20px;
}

.comment-box {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.comment-info {
  margin-top: 5px;
  color: #666;
  font-size: 12px;
}</style>