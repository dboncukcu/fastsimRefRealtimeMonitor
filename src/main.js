import Vue from 'vue'
import App from './App.vue'

import VueApexCharts from 'vue-apexcharts'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false


Vue.use(VueApexCharts)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const axiosInstance = axios.create({
  baseURL: document.baseURI
})

Vue.prototype.$axios = axiosInstance

new Vue({
  render: h => h(App),
}).$mount('#app')
