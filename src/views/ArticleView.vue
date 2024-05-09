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
                  作者: {{ scope.row.userId }} 创建时间: {{ scope.row.publishDate }}
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
              <div class="comment-info">评论人: {{ comment.userId }} | 评论时间: {{ comment.replyDate }}</div>
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

export default {
  data() {
    return {
      homeArticles: [],
      articleId: null,
      showLoginModal: false,
      showMenu: false,
      loginStatus: false,
      liked: false,
      comments: [],
      newComment: '',
      user: null,  // Initialize as an empty array
      username: localStorage.getItem('username'), // Assuming the username is stored in localStorage
    };
  },

  mounted() {
    console.log("username");
    console.log("username" + this.username);
    this.articleId = this.$route.params.articleId || localStorage.getItem('articleId');
    localStorage.setItem('articleId', this.articleId);
    const token = localStorage.getItem('token');

    if (token) {
      this.loginStatus = true;
      this.username = localStorage.getItem('username');
    } else {

      this.loginStatus = false;
      this.username = '';
    }
    axios.get(`http://localhost:8080/home/${this.articleId}`, {
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

    axios.get(`http://localhost:8080/replies/${this.articleId}`)
      .then(response => {
        if (response.data.code == 1) {
          console.log(response.data);
          this.comments = response.data.data;
        }
      }).catch(error => {
        // 发生错误时的处理
        console.error('Error:', error);
      });

    axios.get(`http://localhost:8080/login/${this.username}`)
      .then(response => {
        if (response.data.code === 1) {
          console.log("获取用户：" + response.data.data.username);
          this.user = response.data.data;  // Assuming response.data.data is an array of users
          this.checkIfLiked(this.user.userId, this.articleId);
        }
      })
      .catch(error => {
        console.error("获取用户时发生错误:", error);
      });


  },
  methods: {
    goToDetail(articleId) {
      this.$router.push({ name: 'article', params: { articleId: articleId } });
    },
    handleMenuClick(item) {
      this.$router.push({ name: 'categories', params: item });
    },
    selectUser() {
      axios.get(`http://localhost:8080/user/${this.username}`)
        .then(response => {
          if (response.data.code === 1) {
            console.log("获取用户：" + response.data);
            this.user = response.data.data;  // Assuming response.data.data is an array of users
          }
        })
        .catch(error => {
          console.error("获取用户时发生错误:", error);
        });
    },
    postComment(userId, articleId, commentContent) {
      // Your logic to post the comment with the provided parameters
      console.log("User ID:", userId);
      console.log("Article ID:", articleId);
      console.log("Comment Content:", commentContent);

      // Example Axios request to post the comment
      axios.post('http://localhost:8080/replies', {
        articleId: articleId,
        userId: userId,
        replyContent: commentContent
      })
        .then(response => {
          // Handle successful comment submission
          console.log("Comment posted successfully:", response.data);
          // Optionally, you can update the comments list to display the newly posted comment
        })
        .catch(error => {
          // Handle error if the comment submission fails
          console.error("Error posting comment:", error);
        });
    },
    logout() {
      localStorage.removeItem('token');  // 清除token
      localStorage.removeItem('username');
      this.loginStatus = false;
      this.username = '';
    },
    goToLogin() {
      // 可以使用路由来跳转到登录页面
      this.$router.push('/login');
    },
    Login() {
      this.$router.push({
        name: 'login',
        query: { returnUrl: this.$route.fullPath }
      });
    },
    goToUserProfile() {
      this.$router.push({ name: 'userprofile' });
      // 这里可以添加你想要执行的其他操作
    },
    goToHome() {
      this.$router.push({ name: 'home' });
    },
    async checkIfLiked(userId, articleId) {
      try {
        const response = await axios.post('http://localhost:8080/likes', {
          articleId: articleId,
          userId: userId
        })
        if (response.data.data === 1) {
          this.liked = true; // 假设后端返回的数据中有一个 liked 字段表示是否已经点赞
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    toggleLike(userId, articleId) {
      try {
        if (this.liked) {
          axios.delete('http://localhost:8080/like', {
            data: {
              articleId: articleId,
              userId: userId
            }
          })
        } else {
          axios.post('http://localhost:8080/like', {
            articleId: articleId,
            userId: userId
          })

        }
        this.liked = !this.liked;
      } catch (error) {
        console.error('Error:', error);
      }
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