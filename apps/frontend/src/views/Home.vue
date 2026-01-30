<template>
  <div class="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
    <div class="max-w-4xl w-full text-center space-y-8">
      <div class="space-y-4">
        <h1 class="text-5xl font-bold tracking-tight">Trading Bot Platform</h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create automated trading workflows with visual node-based editor. Connect triggers and actions to build powerful trading strategies.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <RouterLink to="/dashboard">
          <Button size="lg" class="w-full sm:w-auto">
            Get Started
          </Button>
        </RouterLink>
        <RouterLink to="/create-workflow">
          <Button variant="outline" size="lg" class="w-full sm:w-auto">
            Create Workflow
          </Button>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        <div class="p-6 rounded-lg border border-sidebar-border bg-card">
          <div class="text-3xl mb-3">🎯</div>
          <h3 class="font-semibold mb-2">Visual Editor</h3>
          <p class="text-sm text-muted-foreground">
            Drag and drop nodes to create complex trading workflows visually
          </p>
        </div>
        <div class="p-6 rounded-lg border border-sidebar-border bg-card">
          <div class="text-3xl mb-3">⚡</div>
          <h3 class="font-semibold mb-2">Real-time Execution</h3>
          <p class="text-sm text-muted-foreground">
            Monitor and track your workflow executions in real-time
          </p>
        </div>
        <div class="p-6 rounded-lg border border-sidebar-border bg-card">
          <div class="text-3xl mb-3">🔌</div>
          <h3 class="font-semibold mb-2">Multiple Exchanges</h3>
          <p class="text-sm text-muted-foreground">
            Connect to HyperLiquid, Lighter, Backpack and more
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
</script>
