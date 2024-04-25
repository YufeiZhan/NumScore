<template> 
    <div >
        <!-- Title -->
        <h1 style="display: flex; justify-content: center;" class="m-5">{{ score?.title }}</h1>

        <!-- Score Information -->
        <div style="display:flex; justify-content: space-between;" >
            <div style="display:flex; justify-content: center;" class="d-flex align-items-center">
                <h4 class="ms-5 mb-0"> 1  =  </h4>
                <div style="text-align: center;" class="ms-2">
                    <h4 class="mb-0">{{ score?.timeSignatureTop }}</h4>
                    <h5 class="mb-0" style="line-height:0.5;">⏤</h5>
                    <h4 class="mb-0">{{ score?.timeSignatureBase }}</h4>
                </div>
            </div>
            <div style="display:flex;" class="d-flex align-items-center me-5">
                <p class="mb-0"><b>Author:</b> {{ score?.author }}</p>
            </div>
        </div>

        <!-- Score Notes -->
        <div class="ms-5 me-5 mt-5">
            <div v-for="(note, index) in score?.notes" :key="index" style="display: inline-block;"> 
                <Note :note="note" style="display: inline-block;"/>
                <div v-if="barBehind(index)" style="display: inline-block;" class="note">
                    <div v-for="number in 4" :key="number" class="hidden-note-deco">·</div>
                    <span> | </span>
                    <div v-for="number in 4" :key="number" class="hidden-note-deco">·</div>
                    <div v-for="number in 4" :key="number" class="hidden-note-deco">-</div>
                </div>
            </div >
        </div>

        <!-- Toolbox -->
        <div style="position: fixed; right: 10px; bottom: 0px;">
            <b-avatar v-if="showIcons" class="avatar-toolbox" size="lg"><b-icon-share variant="light" scale="1.4"></b-icon-share></b-avatar>
            <b-avatar v-if="showIcons" class="avatar-toolbox" size="lg"><b-icon-download variant="light" scale="1.5"></b-icon-download></b-avatar>
            <b-avatar v-if="showIcons" class="avatar-toolbox" size="lg"><b-icon-question variant="light" scale="2"></b-icon-question></b-avatar>
            <b-avatar class="avatar-toolbox" size="lg"><b-icon-box-seam variant="light" scale="1.5" @click="toolboxOnClick"></b-icon-box-seam></b-avatar>
        </div>

        <!-- User Icons -->
        <div style="position: fixed; left: 0px; bottom: 10px;">
            <b-avatar :text="user.preferred_username.slice(0,2)" class="avatar-user"></b-avatar>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { watch, onMounted, ref, Ref, inject } from 'vue'
    import { Score } from '../../../server/data'
    import Note from '../components/Note.vue'

    const score : Ref<Score> | Ref<undefined>= ref(undefined)
    const showIcons : Ref<boolean> = ref(true)
    const user: Ref<any> = inject("user")!

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

function barBehind(index : number) : boolean {
    if (index === 0 && score.value?.timeSignatureTop != 1){
        return false //Assumed for now that the biggest duration is 1 so the first note won't have bar behind anyways
    }

    const previousDurationSum = durationTill(index-1)
    const currentDurationSum = previousDurationSum + score.value.notes[index].duration
    const previousDurationInterval = Math.floor(previousDurationSum/score.value?.timeSignatureTop)
    const currentDurationInterval = Math.floor(currentDurationSum/score.value?.timeSignatureTop)
    
    if  (previousDurationInterval < currentDurationInterval) {
        // console.log("bar behind index:",index)
        return true
    } else {
        return false
    }
}

function durationTill(index : number) : number {
    let total = 0;
    for (let i=0; i<=index; i++){
        total+= score.value.notes[i].duration
    }

    return total;
}

function toolboxOnClick(){
    showIcons.value = !showIcons.value
}
</script>