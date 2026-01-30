<template>
  <div class="h-screen bg-background flex items-center justify-center p-6">
    <TriggerSheet @trigger-selected="handleTriggerSelected"></TriggerSheet>
    <ActionSheet
      v-model:sheet-model="openActionSheet"
      @action-selected="handleActionSelected"
    ></ActionSheet>
    <div
      class="w-full max-w-6xl h-[calc(100vh-4rem)] bg-card border border-sidebar-border rounded-lg shadow-md overflow-hidden"
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
import { VueFlow, useVueFlow, type Node, type Edge } from '@vue-flow/core'
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

const { onConnect, onConnectStart, onConnectEnd, addEdges, addNodes, project } = useVueFlow()

let connectionSucceeded: boolean = false
let sourceNodeId: string | undefined | null = null
let position: Dimension = {
  x: 0,
  y: 0,
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
