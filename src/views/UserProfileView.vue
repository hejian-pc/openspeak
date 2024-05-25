<template>
    <el-container>
        <el-header>
            <div class="header-content">
                <button class="header-button" @click="goToHome()">
                    首页
                </button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px" class="aside-container">
                <el-menu :default-openeds="['1']">
                    <el-menu-item index="1-1" @click="showUserInfo">个人信息</el-menu-item>
                    <el-menu-item index="1-2" @click="showLikedArticles">喜欢的文章</el-menu-item>
                    <!-- 
                    <el-menu-item index="1-3" @click="editUserInfo">编辑个人信息</el-menu-item>
                    <el-menu-item index="1-4" @click="changePassword">修改密码</el-menu-item> -->
                </el-menu>
            </el-aside>
            <el-main class="main-content">
                <div v-if="display === 'userInfo'" class="info-section">
                    <h2>个人信息</h2>
                    <div class="info-item">
                        <label>用户名：</label>
                        <span>{{ userInfo.username }}</span>
                    </div>
                    <div class="info-item">
                        <label>Email：</label>
                        <span>{{ userInfo.email }}</span>
                    </div>
                </div>
                <div v-if="display === 'likedArticles'" class="articles-section">
                    <h2>喜欢的文章</h2>
                    <el-table :data="likedArticles" style="width: 100%" border>
                        <el-table-column label="文章列表">

                            <template slot-scope="scope">
                                <div @click="goToDetail(scope.row.articleId)" class="article-box">
                                    <strong>{{ scope.row.title }}</strong>
                                    <div class="article-content">
                                        {{ scope.row.content }}
                                    </div>
                                    <div class="article-info">
                                        作者: {{ scope.row.articleId }} 创建时间: {{ scope.row.publishDate }}
                                    </div>
                                </div>
                            </template>

                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
        <el-footer class="footer">footer</el-footer>
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

<style scoped>
.header-content {
    display: flex;
    justify-content: flex-start;
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
    padding: 20px;
}

.main-content {
    background-color: #E9EEF3;
    padding: 20px;
    color: #333;
}

.info-section,
.articles-section {
    margin-bottom: 20px;
}

.info-item {
    margin-bottom: 10px;
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
</style>