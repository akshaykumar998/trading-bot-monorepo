<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">My Workflows</h1>
        <p class="text-muted-foreground mt-1">Manage your trading workflows</p>
      </div>
      <RouterLink to="/create-workflow">
        <Button>
          <span class="mr-2">+</span>
          Create Workflow
        </Button>
      </RouterLink>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading workflows...</p>
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <p class="text-destructive">{{ error }}</p>
    </div>

    <div v-else-if="workflows.length === 0" class="text-center py-12">
      <div class="text-4xl mb-4">📊</div>
      <h3 class="text-lg font-semibold mb-2">No workflows yet</h3>
      <p class="text-muted-foreground mb-4">Create your first workflow to get started</p>
      <RouterLink to="/create-workflow">
        <Button>Create Workflow</Button>
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="workflow in workflows"
        :key="workflow._id"
        class="bg-card border border-sidebar-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToWorkflow(workflow._id)"
      >
        <div class="flex items-start justify-between mb-4">
          <h3 class="font-semibold text-lg">{{ workflow.name || `Workflow ${workflow._id.slice(-6)}` }}</h3>
          <span
            class="px-2 py-1 text-xs rounded-full"
            :class="workflow.published ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'"
          >
            {{ workflow.published ? 'Published' : 'Draft' }}
          </span>
        </div>
        <div class="space-y-2 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <span>📊</span>
            <span>{{ workflow.nodes?.length || 0 }} nodes</span>
          </div>
          <div class="flex items-center gap-2">
            <span>🔗</span>
            <span>{{ workflow.edges?.length || 0 }} connections</span>
          </div>
          <div v-if="workflow.updatedAt" class="flex items-center gap-2">
            <span>🕒</span>
            <span>{{ formatDate(workflow.updatedAt) }}</span>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            class="flex-1"
            @click.stop="navigateToWorkflow(workflow._id)"
          >
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="flex-1"
            @click.stop="navigateToExecutions(workflow._id)"
          >
            Executions
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/http'
import { Button } from '@/components/ui/button'


const router = useRouter()

const workflows = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const fetchWorkflows = async () => {
  try {
    loading.value = true
    const response = await api.getWorkflows()
    workflows.value = response.data || []
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load workflows'
  } finally {
    loading.value = false
  }
}

const navigateToWorkflow = (workflowId: string) => {
  router.push(`/workflow/${workflowId}`)
}

const navigateToExecutions = (workflowId: string) => {
  router.push(`/workflow/${workflowId}/executions`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

onMounted(() => {
  fetchWorkflows()
})
</script>
