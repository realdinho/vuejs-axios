import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'

import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser(state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    storeUser(state, user) {
      state.user = user
    },
    clearAuthData(state) {
      state.idToken = null,
      state.userId = null
    }
  },
  actions: {
    setLogoutTimer({dispatch}, expirationTime) {
      setTimeout(() => {
        dispatch('signout')
        // commit('clearAuthData')
      }, expirationTime)
    },
    signup({commit, dispatch}, authData) {
      axios.post('/accounts:signUp?key=AIzaSyDfR1yVssAm1u_1cBgPkXVckj-538IwKYg', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          // console.log(res);
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          });
          const now = new Date();
          const expiresIn = res.data.expiresIn * 1000;
          const expirationDate = new Date(now.getTime() + expiresIn);
          localStorage.setItem('token', res.data.idToken);
          localStorage.setItem('userId', res.data.localId);
          localStorage.setItem('expirationDate', expirationDate);

          dispatch('storeUser', authData);
          dispatch('setLogoutTimer', expiresIn);
          router.replace('/dashboard');
        })
        .then(error => console.log(error));
    },
    signin({commit, dispatch}, authData) {
      console.log(commit);
      axios.post('/accounts:signInWithPassword?key=AIzaSyDfR1yVssAm1u_1cBgPkXVckj-538IwKYg', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          // console.log(res)
          const now = new Date();
          const expiresIn = res.data.expiresIn * 10;
          console.log(expiresIn);
          const expirationDate = new Date(now.getTime() + expiresIn);
          localStorage.setItem('token', res.data.idToken);
          localStorage.setItem('userId', res.data.localId);
          localStorage.setItem('expirationDate', expirationDate);
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          });
          dispatch('setLogoutTimer', expiresIn);
          router.replace('/dashboard');
        })
        .then(error => console.log(error));
    },
    tryAutoLogin({commit}) {
      const token = localStorage.getItem('token');
      if(!token) {
        return;
      }
      const expirationDate = localStorage.getItem('expirationDate');
      const now = new Date();
      if(now >= expirationDate) {
        return;
      }
      const userId = localStorage.getItem('userId');
      commit('authUser', {
        token: token,
        userId: userId
      }); 
    },
    signout({commit}) {
      commit('clearAuthData');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      router.replace('/signin');
    },
    storeUser({commit, state}, userData) {
      if(!state.idToken) {
        return 
      }
      console.log(commit);
      globalAxios.post('/users.json' + '?auth=' + state.idToken, userData)
        .then(res => console.log(res))
        .catch(error => console.log(error))
    },
    fetchUser({commit, state}) {
      if(!state.idToken) {
        return 
      }
      globalAxios.get('/users.json' + '?auth=' + state.idToken)
        .then(res => {
          console.log(res);
          const data = res.data;
          const users = [];
          
          for(let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          console.log(users);
          commit('storeUser', users[0])
        })
        .catch(error => console.log(error));
    }
  },
  getters: {
    user(state) {
      return state.user
    },
    isAuthenticated(state) {
      return state.idToken !== null
    }
  }
})