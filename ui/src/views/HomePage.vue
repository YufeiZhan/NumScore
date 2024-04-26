<template>
  <div class="m-5">
    <h1 class="m-4"> HOME </h1>
    <div v-if="user?.roles?.includes('user')" style="display:flex; justify-content:flex-start;flex-wrap: wrap;">
      <ScorePreview v-for="(score, index) in scores" :score="score" />
      <AddScore />
    </div>
    <div v-if="user?.roles?.includes('admin')" style="display:flex; justify-content:flex-start;flex-wrap: wrap;">
      <ScorePreview v-for="(score, index) in scores" :score="score" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, Ref, inject } from 'vue'
import { Score } from '../../../server/data'
import ScorePreview from '../components/ScorePreview.vue'
import AddScore from '../components/AddScore.vue'

const user: Ref<any> = inject("user")!
const scores: Ref<Score[]> = ref([])

watch(user, refresh, { immediate: true })

async function refresh() {
  console.log("Accessing Home page...")
  console.log("Accessing the existing user ...")

  let response : Response | null = null
  if (user.value.roles.includes("user")) { // user fetch
    try {
      console.log("Accessing backend /api/scores")
      response = await fetch("/api/scores");
      console.log("The response is", response.status)
    } catch (error) {
      console.error('Failed to fetch scores:', error);
      alert('An error occurred while fetching the scores data for user.');
    }
  } else { // admin fetch
    try{
      console.log("Accessing backend /api/scores/all")
      response = await fetch("/api/score/all");
    }catch (error) {
      console.error('Failed to fetch scores:', error);
      alert('An error occurred while fetching all scores for admin.');
    }
  }

  if (!response?.ok) {
        if (response?.status === 403) {
          alert('You do not have permission to view this data.');
          scores.value = []; // Clear scores if not authorized
        } else {
          alert('An error occurred while fetching the data.');
        }
        return; // Exit the function early
      }
      const data = await response.json()
      scores.value = data as any;
}

//use API to fetch the user information in the session
onMounted(refresh)
</script>