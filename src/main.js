import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vuelidate from 'vuelidate'

import router from './router'
import store from './store'

Vue.use(Vuelidate)

axios.defaults.baseURL = 'https://vue-axios-5ffdc.firebaseio.com'
// axios.defaults.headers.common['Authorization'] = 'AIzaSyDfR1yVssAm1u_1cBgPkXVckj-538IwKYg'
axios.defaults.headers.get['Accepts'] = 'application/json'

const reqInterceptor = axios.interceptors.request.use(config => {
  console.log('Request Interceptor', config);
  config.headers
  return config;
})
const resInterceptor = axios.interceptors.response.use(res => {
  console.log('Response Interceptor', res);
  return res;
})

axios.interceptors.request.eject(reqInterceptor, resInterceptor);

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
