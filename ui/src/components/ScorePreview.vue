<template>
    <b-card :sub-title="score?.title" align="center" style="width: 15rem; height: 18rem;" class="m-3 overflow-hidden">
        <img src="../assets/index_pic.png" style="max-width: 15rem; max-height:10rem;">
        <template #footer>
            <small class="text-muted">Last updated {{score?.time}}</small>
        </template>
    </b-card>
</template>
  
<script setup lang="ts">
  import { Score } from '../../../server/data'
  
  // props
  interface Props {
    score?: Score
  }
  
  // default values for props
  const props = withDefaults(defineProps<Props>(), {
    score: undefined,
  })
</script>