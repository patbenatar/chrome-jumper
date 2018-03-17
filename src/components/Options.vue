<template>
  <div>
    <label for="github-api-key">GitHub API Key</label>
    <input type="text" id="github-api-key" v-model="githubApiKey">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import promisify from 'promisify-node'
import { storageGet } from '../lib/storage'

export default Vue.extend({
  data() {
    return {
      githubApiKey: ''
    }
  },
  async mounted() {
    const data = await storageGet('githubApiKey')
    this.githubApiKey = data.githubApiKey
  },
  watch: {
    githubApiKey: function (newValue, oldValue) {
      chrome.storage.local.set({ githubApiKey: newValue })
    }
  }
})
</script>