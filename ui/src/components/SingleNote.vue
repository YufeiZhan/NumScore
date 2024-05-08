<template>
    <b-button squared variant="outline-dark" @click="toggleNote(state[1])" :pressed="state[0]">
        <div v-if="note.pitch >= 0">
            <div v-for="number in (3 - note.pitch)" :key="number" class="hidden-note-deco">·</div>
            <div v-for="number in note.pitch" :key="number" class="note-deco">·</div>
            <div>{{ note.number }}</div>
            <div v-for="number in Math.abs(Math.log2(note.duration))" :key="number" class="note-deco">-</div>
            <div v-for="number in 4 - Math.abs(Math.log2(note.duration))" :key="number" class="hidden-note-deco">-
            </div>
            <div v-for="number in 3" :key="number" class="hidden-note-deco">·</div>
        </div>

        <div v-if="note.pitch < 0">
            <div v-for="number in 3" :key="number" class="hidden-note-deco">·</div>
            <div>{{ note.number }}</div>
            <div v-for="number in Math.abs(Math.log2(note.duration))" :key="number" class="note-deco">-</div>
            <div v-for="number in Math.abs(note.pitch)" :key="number" class="note-deco">·</div>
            <div v-for="number in 4 - Math.abs(Math.log2(note.duration))" :key="number" class="hidden-note-deco">-
            </div>
            <div v-for="number in (3 - Math.abs(note.pitch))" :key="number" class="hidden-note-deco">·</div>
        </div>
    </b-button>
</template>

<script setup lang="ts">
import { Note } from '../../data'

// props
interface Props {
    note?: Note
    state?: [boolean,number]
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
    note: undefined,
    state: undefined
})

// events
const emit = defineEmits<{
  (e: 'toggleNote', index: number): void
}>()

function toggleNote(index: number) {
    console.log(index)
  emit("toggleNote", index)
}
</script>