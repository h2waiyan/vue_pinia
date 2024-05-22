<template>
  <main>
    <header>
      <img src="./assets/pinia-logo.svg" alt="">
      <h1>Floor Plan Managemment</h1>
    </header>

      <MapPage />
     
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
