<template>
  <main>
    <header>
      <img src="./assets/pinia-logo.svg" alt="">
      <h1>Pinia Task Management</h1>
    </header>

    <div v-for="task in taskStore.tasks">
      <TaskDetails :task="task" />
    </div>
    
  </main>
</template>

<script>
import TaskDetails from './components/TaskDetails.vue'
import MapPage from './components/MapPage.vue';
import { useTaskStore } from './stores/TaskStore';
  export default {
    components: {
      TaskDetails,
      MapPage
    },
    setup () {
      const taskStore = useTaskStore()
      return {
        taskStore
      }
    }
  }
</script>./store/TaskStore./components/MapPage.vue
