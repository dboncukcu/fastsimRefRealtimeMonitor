import Vue from 'vue'
import App from './App.vue'


import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)



import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)
// eslint-disable-next-line vue/multi-word-component-names
Vue.component('apexchart', VueApexCharts)


import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: document.baseURI
})
Vue.prototype.$axios = axiosInstance



Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
