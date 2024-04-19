import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './static/style.css';


import App from './App.vue'
import CustomerScreen from './views/CustomerScreen.vue'
import OperatorScreen from './views/OperatorScreen.vue'
import IndexPage from './views/IndexPage.vue'
import HomePage from './views/HomePage.vue'

const routes = [
  {
    path: "/customer/:customerId",
    component: CustomerScreen,
    props: ({ params: { customerId }}) => ({ customerId }),
  },
  {
    path: "/operator/:operatorId",
    component: OperatorScreen,
    props: ({ params: { operatorId }}) => ({ operatorId }),
  },
  {
    path: "/",
    component: IndexPage,
  },
  {
    path: "/home",
    component: HomePage,
  }
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

createApp(App)
	.use(BootstrapVue)
	.use(BootstrapVueIcons)
	.use(router)
	.mount('#app')

