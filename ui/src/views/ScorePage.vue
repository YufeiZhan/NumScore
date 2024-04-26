<template>
    <div>
        <b-button v-b-modal="'configure-model'" class="bg-app"
            style="position:relative; top:10px;left:10px;"><b-icon-gear scale="1.5"></b-icon-gear></b-button>
        <b-modal id="configure-model" title="Configure Score Setting" hide-header-close @ok="handleScoreSubmit">
            <form @submit="handleScoreSubmit">
                <b-form-group id="input-group-1" label="Title:" label-for="score-title-input">
                    <b-form-input id="score-title-input" v-model="formScore.title" placeholder="Enter title"
                        required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-2" label="Author:" label-for="score-author-input">
                    <b-form-input id="score-author-input" v-model="formScore.author" placeholder="Enter author"
                        required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-3" label="Key:" label-for="score-key-input">
                    <b-form-select id="score-key-input" v-model="formScore.key" :options="keys"
                        required></b-form-select>
                </b-form-group>
                <b-form-group id="input-group-4" label="Top Time Signature:" label-for="score-ts-top-input">
                    <b-form-input id="score-ts-top-input" v-model="formScore.timeSignatureTop" type="number"
                        placeholder="Enter top time sig" required></b-form-input>
                </b-form-group>
                <b-form-group id="input-group-5" label="Bottom Time Signature:" label-for="score-ts-bot-input">
                    <b-form-input id="score-ts-bot-input" v-model="formScore.timeSignatureBase" type="number"
                        placeholder="Enter base time sig" required></b-form-input>
                </b-form-group>
            </form>
        </b-modal>

        <!-- Title -->
        <h1 v-if="score?.title" style="display: flex; justify-content: center;" class="m-5">{{ score?.title }}</h1>
        <h1 v-else style="display: flex; justify-content: center;" class="m-5 empty-info">ENTER TITLE HERE</h1>


        <!-- Score Information -->
        <div style="display:flex; justify-content: space-between;">
            <div style="display:flex; justify-content: center" class="d-flex align-items-center">
                <div style="display:flex;">
                    <h4 class="ms-5 mb-0"> 1 = </h4>
                    <h4 v-if="score?.key" class="ms-2 mb-0">{{ score?.key }}</h4>
                    <h4 v-else class="ms-2 mb-0 empty-info">?</h4>
                </div>
                <div style="text-align: center;" class="ms-2">
                    <h4 v-if="score?.timeSignatureTop" class="mb-0">{{ score?.timeSignatureTop }}</h4>
                    <h4 v-else class="mb-0 empty-info">?</h4>
                    <h5 class="mb-0" style="line-height:0.5;">⏤</h5>
                    <h4 v-if="score?.timeSignatureBase" class="mb-0">{{ score?.timeSignatureBase }}</h4>
                    <h4 v-else class="mb-0 empty-info">?</h4>
                </div>
            </div>
            <div style="display:flex;" class="d-flex align-items-center me-5">
                <p v-if="score?.author" class="mb-0"><b>Author:</b> {{ score?.author }}</p>
                <p v-else class="mb-0 empty-info"><b>Author:</b> Score Author </p>
            </div>
        </div>

        <!-- Score Notes -->
        <div class="ms-5 me-5 mt-5">
            <div v-for="(note, index) in score?.notes" :key="index" class="note">
                <SingleNote :note="note" class="note" />
                <div v-if="barBehind(index)" class="note">
                    <div v-for="number in 4" :key="number" class="hidden-note-deco">·</div>
                    <span> | </span>
                    <div v-for="number in 4" :key="number" class="hidden-note-deco">·</div>
                    <div v-for="number in 4" :key="number" class="hidden-note-deco">-</div>
                </div>
            </div>

            <!-- Add New Note-->
            <div class="note">
                <b-button v-b-modal="'new-note-model'" variant="light"><b-icon-plus
                        scale="1.5"></b-icon-plus></b-button>
                <div v-for="number in 6" :key="number" class="hidden-note-deco">·</div>
            </div>
            <b-modal id="new-note-model" title="Creating New Note" hide-header-close @ok="handleNoteSubmit">
                <form @submit="handleSubmit">
                    <b-form-group id="input-group-1" label="Note:" label-for="note-input"
                        invalid-feedback="Note is required">
                        <b-form-select id="note-input" v-model="form.note" :options="notes" required></b-form-select>
                    </b-form-group>
                    <b-form-group id="input-group-2" label="Pitch:" label-for="pitch-input"
                        invalid-feedback="Pitch is required">
                        <b-form-select id="pitch-input" v-model="form.pitch" :options="pitches"
                            required></b-form-select>
                    </b-form-group>
                    <b-form-group id="input-group-3" label="Duration:" label-for="duration-input"
                        invalid-feedback="Duration is required">
                        <b-form-select id="duration-input" v-model="form.duration" :options="durations"
                            required></b-form-select>
                    </b-form-group>
                    <b-form-group id="input-group-4" label="Color:" label-for="color-input"
                        invalid-feedback="Color is required">
                        <b-form-select id="color-input" v-model="form.color" :options="colors" required></b-form-select>
                    </b-form-group>
                </form>
            </b-modal>
        </div>


        <!-- Toolbox -->
        <div style="position: fixed; right: 10px; bottom: 0px;">
            <b-avatar v-if="showIcons" class="avatar-toolbox" size="lg"><b-icon-share variant="light"
                    scale="1.4"></b-icon-share></b-avatar>
            <b-avatar v-if="showIcons" class="avatar-toolbox" size="lg"><b-icon-download variant="light"
                    scale="1.5"></b-icon-download></b-avatar>
            <b-avatar v-if="showIcons" class="avatar-toolbox" size="lg"><b-icon-question variant="light"
                    scale="2"></b-icon-question></b-avatar>
            <b-avatar class="avatar-toolbox" size="lg"><b-icon-box-seam variant="light" scale="1.5"
                    @click="toolboxOnClick"></b-icon-box-seam></b-avatar>
        </div>

        <!-- User Icons -->
        <div style="position: fixed; left: 0px; bottom: 10px;">
            <b-avatar :text="user.preferred_username.slice(0, 2)" class="avatar-user"></b-avatar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref, Ref, inject } from 'vue'
import { Score, Note } from '../../../server/data'
import SingleNote from '../components/SingleNote.vue'

const score: Ref<Score> | Ref<undefined> = ref(undefined)
const showIcons: Ref<boolean> = ref(false)
const user: Ref<any> = inject("user")!

// Note Form
const defaultForm = { note: 1, pitch: 0, duration: 1, color: "black" }
const form = ref({ ...defaultForm })
const notes = [1, 2, 3, 4, 5, 6, 7]
const pitches = [0, 1, 2, 3, -1, -2, -3]
const durations = [1, 0.5, 0.25, 0.125, 0.0625]
const colors = ["black", "blue", "red"]

// Score Form
const formScore = { title: score.value?.title, author: score.value?.author, key: score.value?.key, timeSignatureTop: score.value?.timeSignatureTop, timeSignatureBase: score.value?.timeSignatureBase }
const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C#', 'D#', '#F', '#G', 'A#', 'Db', 'Eb', 'Gb', 'Ab', 'Bb']

// props
interface Props {
    scoreId?: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
    scoreId: undefined,
})

async function refresh() {
    console.log("Accessing Score page...")
    console.log("Accessing the score given...")
    if (props.scoreId) {
        try {
            console.log("Accessing backend /api/score/:scoreId")
            const response = await fetch("/api/score/" + props.scoreId);
            console.log("The response is", response.status)
            if (!response.ok) {
                if (response.status === 403) {
                    alert('You do not have permission to view this data.');
                    score.value = undefined; // Clear scores if not authorized
                } else {
                    alert('An error occurred while fetching the data.');
                }
                return; // Exit the function early
            } else {
                score.value = await response.json();
            }
        } catch (error) {
            console.error('Failed to fetch score:', error);
            alert('An error occurred while fetching the score data.');
        }
    }
}

onMounted(refresh)

function barBehind(index: number): boolean {
    if (index === 0 && score.value?.timeSignatureTop != 1) {
        return false //Assumed for now that the biggest duration is 1 so the first note won't have bar behind anyways
    }

    const previousDurationSum = durationTill(index - 1)
    const currentDurationSum = previousDurationSum + score.value.notes[index].duration
    const previousDurationInterval = Math.floor(previousDurationSum / score.value?.timeSignatureTop)
    const currentDurationInterval = Math.floor(currentDurationSum / score.value?.timeSignatureTop)

    if (previousDurationInterval < currentDurationInterval) {
        // console.log("bar behind index:",index)
        return true
    } else {
        return false
    }
}

function durationTill(index: number): number {
    let total = 0;
    for (let i = 0; i <= index; i++) {
        total += score.value.notes[i].duration
    }

    return total;
}

function toolboxOnClick() {
    showIcons.value = !showIcons.value
}



async function handleNoteSubmit() {
    console.log("Submit button clicked:", form.value)
    const newNote: Note = { number: form.value.note as any, pitch: form.value.pitch as any, duration: form.value.duration as any, color: form.value.color as any }
    await fetch("/api/score/" + encodeURIComponent(props.scoreId as any) + "/newnote",
        {
            headers: { "Content-Type": "application/json", },
            method: "PUT",
            body: JSON.stringify(newNote)
        })
    resetForm()
    window.location.reload();
}

function resetForm() {
    form.value = { ...defaultForm }
}

async function handleScoreSubmit() {
    console.log("Congifure form is submitted.")
    await fetch("/api/score/" + encodeURIComponent(props.scoreId as any),
        {
            headers: { "Content-Type": "application/json", },
            method: "PUT",
            body: JSON.stringify(formScore)
        })
    window.location.reload();
}
</script>