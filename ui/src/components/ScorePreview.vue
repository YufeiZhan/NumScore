<template>
  <div style="position: relative;">
    <b-avatar button @click="deleteScore" class="avatar-toolbox" style="position: absolute;" size="lg"><b-icon-trash
        variant="light" scale="1.5"></b-icon-trash></b-avatar>
    <b-link :to="`/score/${score?._id}`">
      <b-card :sub-title="score?.title" align="center" style="width: 15rem; height: 18rem;z-index:-2;"
        class="m-3 overflow-hidden">
        <img src="../assets/index_pic.png" style="max-width: 15rem; max-height:10rem;">
        <template #footer>
          <small class="text-muted">Last updated {{ score?.time }}</small>
        </template>
      </b-card>
    </b-link>
  </div>
</template>

<script setup lang="ts">
import { Score } from '../../data'

// props
interface Props {
  score?: Score
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  score: undefined,
})

async function deleteScore() {
  console.log("🎨: Deleting the score...")

  const response = await fetch("/api/score/" + encodeURIComponent(props.score?._id as any),
    {
      headers: { "Content-Type": "application/json", },
      method: "DELETE"
    })

  if (response.ok) {
    console.log("🎨: Deleting score ✅")
    window.location.reload();
  } else {
    console.log("🎨: Deleting score errored ❓")
    alert("Score isn't deleted successfully.")
  }

}

</script>