import { defineStore } from "pinia";

export const useTaskStore = defineStore("taskStore", {
    state: () => ({
        tasks: [
            { id: 1, title: "Task 1", isFav: false },
            { id: 2, title: "Task 2", isFav: true },
            { id: 3, title: "Task 3", isFav: false },
        ],
        name: "Yoshi"
    }),
    getters: {
        favs () {
            return this.tasks.filter(task => task.isFav);
        },
        favCount () {
            return this.tasks.reduce((acc, task) => task.isFav ? acc + 1 : acc, 0);
        },
        totalCount (state) {
            return state.tasks.length;
        }
    },
    actions: {
        addTask(task) {
            this.tasks.push(task);
        },
        deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
        },
        toggleFav(id) {
            const task = this.tasks.find(task => task.id === id);
            task.isFav = !task.isFav;
        },
    },
});
