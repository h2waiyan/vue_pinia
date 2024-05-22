<template>
  <main>
    <header>
      <img src="./assets/pinia-logo.svg" alt="">
      <h1>Pinia Task Managemment</h1>
    </header>

      <!-- TASKS -->
      <div class="task-list">
        <div v-for="task in taskStore.tasks">
          <TaskDetails :task="task" :key="task.id" />
        </div>
      </div>
     
  </main>
</template>

<script>
import TaskDetails from './components/TaskDetails.vue'
import { useTaskStore } from './stores/TaskStore';
  export default {
    components: {
      TaskDetails
    },
    setup () {
      const taskStore = useTaskStore()
      return {
        taskStore
      }
    }
  }
</script>./store/TaskStore
