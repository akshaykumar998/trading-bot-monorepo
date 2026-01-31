<template>
  <div class="h-screen bg-background flex flex-col p-6">
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Create Workflow</h1>
        <p class="text-sm text-muted-foreground">Design your trading workflow</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" @click="handleSave" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save Draft' }}
        </Button>
        <Button @click="handlePublish" :disabled="publishing || nodes.length === 0">
          {{ publishing ? 'Publishing...' : 'Publish' }}
        </Button>
      </div>
    </div>
    <TriggerSheet @trigger-selected="handleTriggerSelected"></TriggerSheet>
    <ActionSheet
      v-model:sheet-model="openActionSheet"
      @action-selected="handleActionSelected"
    ></ActionSheet>
    <div
      class="flex-1 w-full max-w-6xl mx-auto bg-card border border-sidebar-border rounded-lg shadow-md overflow-hidden"
    >
      <VueFlow
        v-model:nodes="nodes"
        v-model:edges="edges"
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { VueFlow, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { api } from '@/lib/http'
import { Button } from '@/components/ui/button'
import TriggerSheet from '@/components/TriggerSheet.vue'
import PriceTrigger from '@/nodes/triggers/PriceTrigger.vue'
import TimersNode from '@/nodes/triggers/TimersNode.vue'
import type { PriceTriggerMetaData } from 'common/types'
import type { TimerNodeMetaData } from 'common/types'
import ActionSheet from '@/components/ActionSheet.vue'
import type { TradingMetaData } from 'common/types'
import HyperLiquid from '@/nodes/actions/HyperLiquid.vue'
import LighterNode from '@/nodes/actions/LighterNode.vue'
import BackPack from '@/nodes/actions/BackPack.vue'

type PriceNodeType = Node<PriceTriggerMetaData> & { type: 'price-trigger' }
type TimeNodeType = Node<TimerNodeMetaData> & { type: 'timer' }
type Dimension = {
  x: number
  y: number
}

const nodes = ref<(PriceNodeType | TimeNodeType)[]>([])

const edges = ref<Edge[]>([])

const openActionSheet = ref<boolean>(false)

const router = useRouter()
const { onConnect, onConnectStart, onConnectEnd, addEdges, addNodes, project } = useVueFlow()

const saving = ref(false)
const publishing = ref(false)

let connectionSucceeded: boolean = false
let sourceNodeId: string | undefined | null = null
let position: Dimension = {
  x: 0,
  y: 0,
}

// Transform nodes to backend format
const transformNodesForBackend = () => {
  return nodes.value.map((node) => {
    const nodeData = node.data
    const nodeId = nodeData && 'nodeId' in nodeData ? (nodeData as { nodeId?: string }).nodeId ?? '' : ''

    const isActionNode = node.type !== 'timer' && node.type !== 'price-trigger'
    let credentials: Record<string, unknown> = {}
    if (isActionNode && nodeData) {
      const tradingData = nodeData as unknown as TradingMetaData
      credentials = tradingData.credentials || {}
    }

    return {
      id: node.id,
      nodeId,
      credentials,
      position: node.position,
      type: node.type,
      data: {
        kind: node.type === 'timer' || node.type === 'price-trigger' ? 'TRIGGER' : 'ACTION',
        metadata: node.data,
      },
    }
  })
}

// Transform edges to backend format
const transformEdgesForBackend = () => {
  return edges.value.map((edge) => ({
    id: edge.id || crypto.randomUUID(),
    source: edge.source,
    target: edge.target,
  }))
}

const handleSave = async () => {
  if (nodes.value.length === 0) {
    alert('Please add at least one node to save')
    return
  }

  try {
    saving.value = true
    const workflowData = {
      nodes: transformNodesForBackend(),
      edges: transformEdgesForBackend(),
    }
    await api.createWorkflow(workflowData)
    alert('Workflow saved successfully!')
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    alert(error.response?.data?.message || 'Failed to save workflow')
  } finally {
    saving.value = false
  }
}

const handlePublish = async () => {
  if (nodes.value.length === 0) {
    alert('Please add at least one node to publish')
    return
  }

  try {
    publishing.value = true
    const workflowData = {
      nodes: transformNodesForBackend(),
      edges: transformEdgesForBackend(),
    }
    const response = await api.createWorkflow(workflowData)
    const workflowId = response.data.id
    router.push(`/workflow/${workflowId}`)
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    alert(error.response?.data?.message || 'Failed to publish workflow')
  } finally {
    publishing.value = false
  }
}

onConnectStart(({ nodeId }) => {
  connectionSucceeded = false
  sourceNodeId = nodeId
})

onConnect((params) => {
  console.log(params)

  addEdges([params])
  connectionSucceeded = true
})

const handleTriggerSelected = (
  payload:
    | { type: 'timer'; data: TimerNodeMetaData }
    | { type: 'price-trigger'; data: PriceTriggerMetaData },
) => {
  if (payload.type === 'timer') {
    addNodes([
      {
        id: crypto.randomUUID(),
        type: 'timer',
        position: { x: 250, y: 25 },
        data: payload.data,
      },
    ])
  }

  if (payload.type === 'price-trigger') {
    addNodes([
      {
        id: crypto.randomUUID(),
        type: 'price-trigger',
        position: { x: 250, y: 25 },
        data: payload.data,
      },
    ])
  }
}

const handleActionSelected = (payload: TradingMetaData) => {
  if (!sourceNodeId) {
    return
  }
  const targetNodeId = crypto.randomUUID()
  addNodes([
    {
      id: targetNodeId,
      type: payload.action,
      position: position,
      data: payload,
    },
  ])
  addEdges([
    {
      source: sourceNodeId,
      target: targetNodeId,
    },
  ])
}

onConnectEnd((event: MouseEvent | TouchEvent | undefined) => {
  if (!connectionSucceeded) {
    openActionSheet.value = true
    let clientX: number
    let clientY: number

    if (event instanceof MouseEvent) {
      clientX = event.clientX
      clientY = event.clientY
    } else {
      clientX = event?.changedTouches?.[0]?.clientX ?? 0
      clientY = event?.changedTouches?.[0]?.clientY ?? 0
    }

    // Convert screen coordinates to vue-flow viewport coordinates
    // so the new node appears where the user released the connection.
    const p = project ? project({ x: clientX, y: clientY }) : { x: clientX, y: clientY }
    position = {
      x: p.x,
      y: p.y,
    }
    console.log('Connection attempt ended', event, sourceNodeId)
  }
})
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
