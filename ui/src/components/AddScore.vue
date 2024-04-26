<template>
  <b-link @click="createNewScore">
    <b-card class="m-3" style="width: 15rem; height: 18rem;">
      <b-icon-plus-lg scale="4" style="margin-top:55%; margin-left: 45%;"></b-icon-plus-lg>
    </b-card>
  </b-link>
</template>

<script setup lang="ts">

async function createNewScore() {
  console.log("Function entered.")
  try {
    const response = await fetch("/api/score/new")
    console.log("The response for creating a new score is", response.status)
    if (response.ok){
      const scoreId = await response.json();
      window.location.reload();
    } else {
      alert('An error occurred while creating the new score.');
    }
  } catch (error) {
    console.error('Failed to create new scores:', error);
    alert('An error occurred while creating new score.');
  }
}

</script>