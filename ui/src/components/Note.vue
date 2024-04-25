<template>
    <div class="note">
        <div v-if="note.pitch >= 0">
            <div v-for="number in (3-note.pitch)" :key="number" class="hidden-note-deco">·</div>
            <div v-for="number in note.pitch" :key="number" class="note-deco">·</div>
            <div>{{ note.number }}</div>
            <div v-for="number in Math.abs(Math.log2(note.duration))" :key="number" class="note-deco">-</div>
            <div v-for="number in 4-Math.abs(Math.log2(note.duration))" :key="number" class="hidden-note-deco">-</div>
            <div v-for="number in 3" :key="number" class="hidden-note-deco">·</div>
        </div>

        <div v-if="note.pitch < 0">
            <div v-for="number in 3" :key="number" class="hidden-note-deco">·</div>
            <div>{{ note.number }}</div>
            <div v-for="number in Math.abs(Math.log2(note.duration))" :key="number" class="note-deco">-</div>
            <div v-for="number in Math.abs(note.pitch)" :key="number" class="note-deco">·</div>
            <div v-for="number in 4-Math.abs(Math.log2(note.duration))" :key="number" class="hidden-note-deco">-</div>
            <div v-for="number in (3-Math.abs(note.pitch))" :key="number" class="hidden-note-deco">·</div>
        </div>
    </div>
</template>
    
<script setup lang="ts">
    import { Note } from '../../../server/data'

    // props
    interface Props {
      note?:Note
    }
    
    // default values for props
    const props = withDefaults(defineProps<Props>(), {
        note: undefined,
    })
</script>