<template>
    <div>
      <b-navbar variant="faded" type="light" :class="user?.roles?.includes('admin') ? 'bg-app-admin' : 'bg-app'">
        <!-- Logo -->
        <b-navbar-brand href="#" class="ms-2" >🪕 JIANPU</b-navbar-brand>
        <b-link v-if="user?.name" :to="`/home`"><b-icon-house variant="light" scale="1.5"></b-icon-house></b-link>

        <!-- Login / Signup -->
        <b-navbar-nav class="ms-auto">
          <div class="me-2 mt-3">
            <span v-if="user?.name"> Welcome, {{ user.preferred_username }} </span>
            <span v-else> Please Log In -> </span>
          </div>
          <b-nav-item v-if="user?.name == null" href="/api/login"> <b-button v-b-modal.login-signup-modal variant="light">Log In Through Gitlab</b-button> </b-nav-item>
          <b-nav-item v-if="user?.name" @click="logout"><b-button v-b-modal.login-signup-modal variant="light">Log Out</b-button></b-nav-item>
          <form method="POST" action="/api/logout" id="logoutForm" />
        </b-navbar-nav>
      </b-navbar>
    </div>

  <router-view />
</template>

<script setup lang="ts">
  import { onMounted, ref, provide } from 'vue'

  //make user accessible in environment without explicitly passing it through props to all childs
  const user = ref({} as any)
  provide("user", user) 

  //use API to fetch the user information in the session
  onMounted(async () => {
    console.log("Accessing index page...")
    console.log("Fetching user information from server through /api/user api")
    user.value = await (await fetch("/api/user")).json()
    console.log("The fetched user info is", user.value)
  })

  function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
  }
</script>