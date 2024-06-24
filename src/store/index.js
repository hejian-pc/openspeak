import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    imageUrl: ''
  },
  mutations: {
    setImageUrl(state, url) {
      state.imageUrl = url;
    }
  },
  actions: {
    updateImageUrl({ commit }, url) {
      commit('setImageUrl', url);
    }
  }
});

export default store;

