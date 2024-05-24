<template>
    <el-container>
        <el-header>
            <div class="header-content">
                <button class="el-icon-user" @click="goToHome()">
                    首页
                </button>

            </div>
        </el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1']">
                    <el-submenu index="1">
                        
                        <el-menu-item index="1-1" @click="showUserInfo">个人信息</el-menu-item>
                        <el-menu-item index="1-2" @click="showLikedArticles">喜欢的文章</el-menu-item>
                        <el-menu-item index="1-3" @click="editUserInfo">编辑个人信息</el-menu-item>
                        <el-menu-item index="1-4" @click="changePassword">修改密码</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <div v-if="display === 'userInfo'">
                    <!-- 用户信息展示 -->
                    <h2>个人信息</h2>
                    <div>
                        <label>用户名：</label>
                        <span>{{ userInfo.username }}</span>
                    </div>
                    <div>
                        <label>Email：</label>
                        <span>{{ userInfo.email }}</span>
                    </div>
                </div>
                <!-- 喜欢的文章展示 -->
                <h2>喜欢的文章</h2>
                <el-table :data="likedArticles" style="width: 100%" border show-header=false>
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
            </el-main>
        </el-container>
        <el-footer>footer</el-footer>
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
              userInfo: {
                  userId: null,
                  username: null, // 用户名
                  email: null, // 邮箱
              },
              likedArticles: [],
              display: 'userInfo', // 当前显示的内容，默认为用户信息
          };
      },
      mounted() {
          const token = localStorage.getItem('token');
          const username = localStorage.getItem('username');
          apiClient.get(`/login/${username}`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
              .then(response => {
                  if (response.data.code === 1) {
                      console.log(response.data);
                      this.userInfo = response.data.data;
                      // 获取用户信息成功后再获取喜欢的文章
                      this.fetchLikedArticles();
                  } else {
                      // 响应失败，输出错误信息
                      console.error('Error:', response.data.msg);
                  }
              })
              .catch(error => {
                  console.log(error.response);
              });
      },
      methods: {
          fetchLikedArticles() {
              const token = localStorage.getItem('token');
              apiClient.get(`/like/${this.userInfo.userId}`, {
                  headers: {
                      'Authorization': `Bearer ${token}`
                  }
              })
                  .then(response => {
                      if (response.data.code === 1) {
                          console.log(response.data);
                          this.likedArticles = response.data.data;
                      } else {
                          // 响应失败，输出错误信息
                          console.error('Error:', response.data.msg);
                      }
                  })
                  .catch(error => {
                      console.log(error.response);
                  });
          },
          showUserInfo() {
              this.display = 'userInfo';
          },
          showLikedArticles() {
              this.display = 'likedArticles';
          },
          editUserInfo() {
              // 编辑个人信息操作，这里只是示例
              console.log('编辑个人信息');
          },
          changePassword() {
              // 修改密码操作，这里只是示例
              console.log('修改密码');
          },
          goToHome() {
              this.$router.push({ name: 'home' });
          },
          goToDetail(articleId) {
              this.$router.push({ name: 'article', params: { articleId: articleId } });
          }
      },
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