<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Workflow Executions</h1>
        <p class="text-muted-foreground mt-1">Execution history for workflow {{ workflowId.slice(-6) }}</p>
      </div>
      <RouterLink :to="`/workflow/${workflowId}`">
        <Button variant="outline">Back to Workflow</Button>
      </RouterLink>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading executions...</p>
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <p class="text-destructive">{{ error }}</p>
    </div>

    <div v-else-if="executions.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">📋</div>
      <h3 class="text-lg font-semibold mb-2">No executions yet</h3>
      <p class="text-muted-foreground">Executions will appear here when your workflow runs</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="execution in executions"
        :key="execution._id"
        class="bg-card border border-sidebar-border rounded-lg p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="font-semibold text-lg">Execution {{ execution._id.slice(-6) }}</h3>
            <p class="text-sm text-muted-foreground mt-1">
              Started: {{ formatDate(execution.startTime) }}
            </p>
          </div>
          <span
            class="px-3 py-1 text-sm rounded-full font-medium"
            :class="getStatusClass(execution.status)"
          >
            {{ execution.status }}
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <div class="text-sm text-muted-foreground mb-1">Start Time</div>
            <div class="font-medium">{{ formatDate(execution.startTime) }}</div>
          </div>
          <div v-if="execution.endTime">
            <div class="text-sm text-muted-foreground mb-1">End Time</div>
            <div class="font-medium">{{ formatDate(execution.endTime) }}</div>
          </div>
          <div v-if="execution.endTime && execution.startTime">
            <div class="text-sm text-muted-foreground mb-1">Duration</div>
            <div class="font-medium">{{ calculateDuration(execution.startTime, execution.endTime) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { api } from '@/lib/http'
import { Button } from '@/components/ui/button'

const route = useRoute()
const workflowId = computed(() => route.params.workflowId as string)

const executions = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const fetchExecutions = async () => {
  try {
    loading.value = true
    const response = await api.getWorkflowExecutions(workflowId.value)
    executions.value = response.data || []
    // Sort by start time, newest first
    executions.value.sort((a, b) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load executions'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const calculateDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  const diff = end - start
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`
  } else {
    return `${seconds}s`
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'bg-green-500/20 text-green-600 dark:text-green-400'
    case 'FAILURE':
      return 'bg-red-500/20 text-red-600 dark:text-red-400'
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
    default:
      return 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
  }
}

onMounted(() => {
  fetchExecutions()
})
</script>
