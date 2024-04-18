<template>
    <div>
      <b-navbar variant="faded" type="light" class="bg-app">
        <!-- Logo -->
        <b-navbar-brand href="#" class="ms-2">🪕 JIANPU</b-navbar-brand>

        <!-- Login / Signup -->
        <b-navbar-nav class="ms-auto">
          <b-nav-item> <b-button v-b-modal.login-signup-modal variant="light">Log In/Sign Up</b-button> </b-nav-item>
        </b-navbar-nav>
      </b-navbar>
    </div>

  <router-view />
</template>

