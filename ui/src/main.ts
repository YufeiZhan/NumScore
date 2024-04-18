import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './style.css';


import App from './App.vue'
import CustomerScreen from './views/CustomerScreen.vue'
import OperatorScreen from './views/OperatorScreen.vue'
import StatusScreen from './views/StatusScreen.vue'

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
    component: StatusScreen,
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

