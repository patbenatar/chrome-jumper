import Vue from 'vue'
import Options from './components/Options.vue'

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('options')) {
    console.log('initializing vue')
    new Vue({
      el: '#options',
      render: (h) => h(Options)
    })
  }
})