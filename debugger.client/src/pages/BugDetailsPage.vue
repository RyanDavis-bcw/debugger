<template>
  <div class="container-fluid" v-if="state.bug.creator">
    <div class="bugDetails" v-if="state.loaded">
      <div class="row my-3">
        <div class="col-3">
          <h2>{{ state.bug.title }}</h2>
          <h4>{{ state.bug.creator.name }}</h4>
        </div>
        <div class="col-2 offset-7">
          <p>
            Status:
            <span v-if="!state.bug.closed" class="text-success">Open</span>
            <span v-else class="text-danger">Closed</span>
          </p>
        </div>
      </div>
      <div class="row">
        <div class="card box">
          {{ state.bug.description }}
        </div>
        <button class="btn btn-danger" @click="close">
          Close
        </button>
      </div>
      <div class="notes">
        <NoteComponent v-for="note in state.notes" :key="note._id" :note-prop="note" />
      </div>
      <div class="row">
        <div class="col-8 offset-4">
          <form @submit.prevent="create">
            <textarea name="noteBody"
                      id="noteBody"
                      rows="3"
                      v-model="state.newNote.body"
            >
            </textarea>
            <button class="btn btn-success" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { AppState } from '../AppState'
import { logger } from '../utils/Logger'
import { bugsService } from '../services/BugsService'
import { notesService } from '../services/NotesService'
import { useRoute } from 'vue-router'
import NotificationService from '../services/NotificationService'
export default {
  name: 'BugDetails',
  setup() {
    const route = useRoute()
    const state = reactive({
      bug: computed(() => AppState.activeBug),
      account: computed(() => AppState.account),
      notes: computed(() => AppState.notes[route.params.id]),
      newNote: {},
      loaded: false
    })
    onMounted(async() => {
      try {
        await bugsService.getOne(route.params.id)
      } catch (error) {
        logger.error(error)
      }
      try {
        await notesService.getAllNotes(route.params.id)
      } catch (error) {
        logger.error(error)
      } finally {
        state.loaded = true
      }
    })
    return {
      state,
      async create() {
        try {
          await notesService.create(state.newNote, state.bug.id)
        } catch (error) {
          logger.error(error)
        }
      },

      async close() {
        try {
          if (await NotificationService.confirm()) {
            await bugsService.close(state.bug.id, state.activeBug)
          } else {
            alert('changes not saved')
          }
        } catch (error) {
          logger.error(error)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
