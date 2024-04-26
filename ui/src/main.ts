import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import './assets/style.css';


import App from './App.vue'
import IndexPage from './views/IndexPage.vue'
import HomePage from './views/HomePage.vue'
import ScorePage from './views/ScorePage.vue'

const routes = [
  // {
  //   path: "/customer/:customerId",
  //   component: CustomerScreen,
  //   props: ({ params: { customerId }}) => ({ customerId }),
  // },
  // {
  //   path: "/operator/:operatorId",
  //   component: OperatorScreen,
  //   props: ({ params: { operatorId }}) => ({ operatorId }),
  // },
  {
    path: "/",
    component: IndexPage,
  },
  {
    path: "/home",
    component: HomePage,
  },
  {
    path: "/score/:scoreId",
    component: ScorePage,
    props: ({ params: { scoreId }}) => ({ scoreId }),
  }
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

createApp(App)
	.use(BootstrapVue as any)
	.use(BootstrapVueIcons as any)
	.use(router)
	.mount('#app')

