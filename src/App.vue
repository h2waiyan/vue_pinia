<template>
  <main>
    <header>
      <img src="./assets/pinia-logo.svg" alt="">
      <h1>Pinia Task Management</h1>
    </header>

    <div>
      <!-- <MapPage /> -->
    </div>

    <!-- new task form -->
    <!-- <div class="new-task-form">
      <TaskForm />
    </div> -->

    <!-- filter -->
    <nav class="filter">
      <button @click="filter = 'all'">Animation</button>
      <button @click="filter = 'favs'">Markers</button>
    </nav>

    <div class="" v-if="filter === 'all'">
      <div>

        <AnimateMarker />
      </div>
      <!-- <p>You have {{ taskStore.totalCount }} tasks.</p>
      <div v-for="task in taskStore.tasks">
        <TaskDetails :task="task" />
      </div> -->
    </div>

    <div class="" v-if="filter === 'favs'">
      <div>

        <MapPage />
      </div>
      <!-- <p>You have {{ taskStore.favCount }} tasks.</p>
      <div v-for="task in taskStore.favs">
        <TaskDetails :task="task" />
      </div> -->
    </div>


  </main>
</template>

<script>
import { ref } from 'vue'
import TaskDetails from './components/TaskDetails.vue'
import TaskForm from './components/TaskForm.vue'
import MapPage from './components/MapPage.vue';
import AnimateMarker from './components/AnimateMarker.vue';
import { useTaskStore } from './stores/TaskStore';
export default {
  components: {
    TaskDetails,
    MapPage,
    TaskForm,
    AnimateMarker
  },
  setup() {
    const taskStore = useTaskStore()

    const filter = ref('all')
    return {
      taskStore,
      filter
    }
  }
}
</script>./store/TaskStore./components/MapPage.vue
