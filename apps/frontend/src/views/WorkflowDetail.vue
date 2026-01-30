<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <p class="text-muted-foreground">Loading workflow...</p>
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
      <p class="text-destructive">{{ error }}</p>
      <RouterLink to="/dashboard">
        <Button variant="outline" class="mt-4">Back to Dashboard</Button>
      </RouterLink>
    </div>

    <div v-else-if="workflow" class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold">{{ workflow.name || `Workflow ${workflowId.slice(-6)}` }}</h1>
          <p class="text-muted-foreground mt-1">View and edit your workflow</p>
        </div>
        <div class="flex gap-2">
          <RouterLink :to="`/workflow/${workflowId}/executions`">
            <Button variant="outline">View Executions</Button>
          </RouterLink>
          <RouterLink to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </RouterLink>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-card border border-sidebar-border rounded-lg p-4">
          <div class="text-sm text-muted-foreground mb-1">Nodes</div>
          <div class="text-2xl font-bold">{{ workflow.nodes?.length || 0 }}</div>
        </div>
        <div class="bg-card border border-sidebar-border rounded-lg p-4">
          <div class="text-sm text-muted-foreground mb-1">Connections</div>
          <div class="text-2xl font-bold">{{ workflow.edges?.length || 0 }}</div>
        </div>
        <div class="bg-card border border-sidebar-border rounded-lg p-4">
          <div class="text-sm text-muted-foreground mb-1">Status</div>
          <div class="text-2xl font-bold">
            <span
              class="text-sm px-2 py-1 rounded-full"
              :class="workflow.published ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'"
            >
              {{ workflow.published ? 'Published' : 'Draft' }}
            </span>
          </div>
        </div>
      </div>

      <div class="bg-card border border-sidebar-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Workflow Visualization</h2>
        <div class="h-[600px] bg-background rounded-lg border border-sidebar-border">
          <VueFlow
            v-model:nodes="visualNodes"
            v-model:edges="visualEdges"
            fit-view-on-init
            class="vue-flow-basic-example h-full"
            :default-zoom="1.5"
            :min-zoom="0.2"
            :max-zoom="4"
          >
            <template #node-price-trigger="props">
              <PriceTrigger v-bind="props" />
            </template>

            <template #node-timer="props">
              <TimersNode v-bind="props" />
            </template>

            <template #node-hyperliquid="props">
              <HyperLiquid v-bind="props" />
            </template>
            <template #node-lighter="props">
              <LighterNode v-bind="props" />
            </template>
            <template #node-backpack="props">
              <BackPack v-bind="props" />
            </template>
          </VueFlow>
        </div>
      </div>

      <div class="bg-card border border-sidebar-border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Workflow Details</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Workflow ID:</span>
            <span class="font-mono text-sm">{{ workflowId }}</span>
          </div>
          <div v-if="workflow.createdAt" class="flex justify-between">
            <span class="text-muted-foreground">Created:</span>
            <span>{{ formatDate(workflow.createdAt) }}</span>
          </div>
          <div v-if="workflow.updatedAt" class="flex justify-between">
            <span class="text-muted-foreground">Last Updated:</span>
            <span>{{ formatDate(workflow.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { VueFlow, type Node, type Edge } from '@vue-flow/core'
import { api } from '@/lib/http'
import { Button } from '@/components/ui/button'
import PriceTrigger from '@/nodes/triggers/PriceTrigger.vue'
import TimersNode from '@/nodes/triggers/TimersNode.vue'
import HyperLiquid from '@/nodes/actions/HyperLiquid.vue'
import LighterNode from '@/nodes/actions/LighterNode.vue'
import BackPack from '@/nodes/actions/BackPack.vue'

const route = useRoute()
const workflowId = computed(() => route.params.workflowId as string)

const workflow = ref<any>(null)
const loading = ref(true)
const error = ref('')

const visualNodes = ref<Node[]>([])
const visualEdges = ref<Edge[]>([])

const fetchWorkflow = async () => {
  try {
    loading.value = true
    const response = await api.getWorkflow(workflowId.value)
    workflow.value = response.data

    // Transform backend nodes to Vue Flow format
    visualNodes.value = (workflow.value.nodes || []).map((node: any) => ({
      id: node.id,
      type: node.data?.kind === 'TRIGGER'
        ? (node.data.metadata?.asset ? 'price-trigger' : 'timer')
        : node.data?.metadata?.action || 'hyperliquid',
      position: node.position,
      data: node.data?.metadata || node.data,
    }))

    visualEdges.value = (workflow.value.edges || []).map((edge: any) => ({
      id: edge.id || `${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
    }))
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load workflow'
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
  })
}

onMounted(() => {
  fetchWorkflow()
})
</script>
