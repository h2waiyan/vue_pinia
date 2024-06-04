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
    <div class="new-task-form">
      <TaskForm />
    </div>

    <!-- filter -->
    <nav class="filter">
      <button @click="filter = 'all'">All</button>
      <button @click="filter = 'favs'">Favs</button>
    </nav>

    <div class="task-list" v-if="filter === 'all'">
      <!-- <div> -->

        <!-- <AnimateMarker /> -->
      <!-- </div> -->
      <p>You have {{ totalCount }} tasks.</p>
      <div v-for="task in tasks">
        <TaskDetails :task="task" />
      </div>
    </div>

    <div class="task-list" v-if="filter === 'favs'">
      <!-- <div>

        <MapPage />
      </div> -->
      <p>You have {{ favCount }} tasks.</p>
      <div v-for="task in favs">
        <TaskDetails :task="task" />
      </div>
    </div>

    <button @click="taskStore.$reset">reset the state</button>
  </main>
</template>

<script>
import { storeToRefs } from 'pinia';
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

    const { tasks, loading, favs, totalCount, favCount } = storeToRefs(taskStore)

    taskStore.getTasks()

    const filter = ref('all')
    return {
      taskStore,
      filter,
      tasks, loading, favs, totalCount, favCount
    }
  }
}
</script>./store/TaskStore./components/MapPage.vue
