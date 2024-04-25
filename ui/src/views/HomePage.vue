<template>
    <div class="m-5">
        <h1 class="m-4"> HOME </h1>
        <div style="display:flex; justify-content:flex-start;">
          <ScorePreview v-for="(score, index) in scores" :score="score"/>
          <AddScore />
        </div>
    </div>
</template>

<script setup lang="ts">
  import { watch, onMounted, ref, Ref, inject } from 'vue'
  import {Score} from '../../../server/data'
  import ScorePreview from '../components/ScorePreview.vue'
  import AddScore from '../components/AddScore.vue'

  const user: Ref<any> = inject("user")!
  const scores : Ref<Score[]>= ref([])

  watch(user, refresh, { immediate: true })

  async function refresh() {
    console.log("Accessing Home page...")
    console.log("Accessing the existing user ...")
    if (user.value) {
      console.log("The user exists", user.value)
        try {
            console.log("Accessing backend /api/scores")
            const response = await fetch("/api/scores");
            console.log("The response is", response.status)
            if (!response.ok) {
                if (response.status === 403) {
                  alert('You do not have permission to view this data.');
                  scores.value = []; // Clear scores if not authorized
                } else {
                  alert('An error occurred while fetching the data.');
                }
                return; // Exit the function early
            }
            scores.value = await response.json();
        } catch (error) {
            console.error('Failed to fetch operator:', error);
            alert('An error occurred while fetching the data.');
        }
    }
  }

  //use API to fetch the user information in the session
  onMounted(refresh)
</script>