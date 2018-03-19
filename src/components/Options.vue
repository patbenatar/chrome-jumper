<template>
  <div>
    <label for="api-key">API Key</label>
    <input type="text" id="api-key" v-model="options.apiKey">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import promisify from 'promisify-node'
import { storageGet, getOptions } from '../lib/storage'

const defaultOptions = {
  apiKey: ''
}

export default Vue.extend({
  data() {
    return {
      options: defaultOptions
    }
  },
  async mounted() {
    const options = await getOptions()
    if (options !== undefined) this.options = options
  },
  watch: {
    options: {
      handler: function (newValue, oldValue) {
        chrome.storage.local.set({ options: JSON.stringify(newValue) })
      },
      deep: true
    }
  }
})
</script>
