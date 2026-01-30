<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="w-full border-b border-sidebar-border bg-card/50 backdrop-blur-sm">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="rounded-md bg-primary p-2 text-primary-foreground font-bold">TN</div>
          <RouterLink to="/create-workflow" class="font-semibold text-sm"
            >Create Workflow</RouterLink
          >
        </div>
        <div class="flex items-center gap-2">
          <!-- placeholder for future controls (theme, profile) -->
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router'
</script>
