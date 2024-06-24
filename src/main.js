import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // 确保这个路径是正确的
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,  // 在你的 Vue 实例中包含 store
  render: h => h(App)
}).$mount('#app');
