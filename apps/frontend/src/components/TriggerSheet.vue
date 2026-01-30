<template>
  <Sheet v-model:open="sheetOpen">
    <SheetContent class="max-w-md mx-4 my-6">
      <SheetHeader class="flex flex-col gap-4">
        <SheetTitle class="text-lg font-semibold">Select Trigger</SheetTitle>
        <SheetDescription class="text-sm text-muted-foreground">
          Select the type of trigger that you need
        </SheetDescription>
        <Select v-model="selectedTrigger" class="w-full">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a Trigger" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="trigger in triggerNodes"
                :key="trigger._id"
                :value="trigger.slug"
              >
                {{ trigger.title }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div
          v-if="selectedTrigger === 'timer' && metadata.type === 'timer'"
          class="mt-2 flex flex-col gap-2"
        >
          <Label for="timer">Timer</Label>
          <Input id="timer" type="number" v-model.number="metadata.time" class="w-full"></Input>
        </div>
        <div
          v-if="selectedTrigger === 'price-trigger' && metadata.type === 'price-trigger'"
          class="mt-2 flex flex-col gap-2"
        >
          <Label for="price">Price</Label>
          <Input id="price" type="number" v-model.number="metadata.price" class="w-full"></Input>
          <Label for="metadata.asset">Assets</Label>
          <AssetSelect v-model="metadata.asset" class="w-full"></AssetSelect>
        </div>
      </SheetHeader>
      <SheetFooter>
        <Button type="submit" @click="createFlow" class="w-full"> Create Flow </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref, watch, computed, onMounted } from 'vue'
import type { PriceTriggerMetaData, TimerNodeMetaData } from 'common/types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Input from './ui/input/Input.vue'
import Label from './ui/label/Label.vue'
import AssetSelect from './AssetSelect.vue'
import { api } from '@/lib/http'

type TriggerNode = {
  _id: string
  slug: string
  title: string
  description: string
  type: string
}

const triggerNodes = ref<TriggerNode[]>([])
const selectedTrigger = ref<string | null>(null)
const sheetOpen = ref(true)

const emit = defineEmits<{
  'trigger-selected': [
    payload:
      | { type: 'timer'; data: TimerNodeMetaData }
      | { type: 'price-trigger'; data: PriceTriggerMetaData },
  ]
}>()

type TriggerMetadata =
  | ({ type: 'timer' } & TimerNodeMetaData)
  | ({ type: 'price-trigger' } & PriceTriggerMetaData)

const metadata = ref<TriggerMetadata>({
  type: 'timer',
  time: 0,
})

const selectedTriggerNode = computed(() =>
  triggerNodes.value.find((n) => n.slug === selectedTrigger.value)
)

onMounted(async () => {
  try {
    const res = await api.getNodes()
    const nodes = Array.isArray(res.data) ? res.data : []
    triggerNodes.value = nodes.filter((n: TriggerNode) => n.type === 'TRIGGER')
  } catch {
    triggerNodes.value = []
  }
})

watch(selectedTrigger, (newVal) => {
  if (!newVal) return

  if (newVal === 'timer') {
    metadata.value = { type: 'timer', time: 0 }
  }

  if (newVal === 'price-trigger') {
    metadata.value = {
      type: 'price-trigger',
      asset: 'SOL',
      price: 0,
      decimals: 2,
    }
  }
})

const createFlow = () => {
  const node = selectedTriggerNode.value
  if (!node) return

  if (selectedTrigger.value === 'timer' && metadata.value.type === 'timer') {
    emit('trigger-selected', {
      type: 'timer',
      data: {
        time: Number(metadata.value.time) || 0,
        nodeId: node._id,
      },
    })
  }

  if (selectedTrigger.value === 'price-trigger' && metadata.value.type === 'price-trigger') {
    emit('trigger-selected', {
      type: 'price-trigger',
      data: {
        asset: metadata.value.asset,
        price: Number(metadata.value.price) || 0,
        decimals: Number(metadata.value.decimals) || 0,
        nodeId: node._id,
      },
    })
  }
  sheetOpen.value = false
}
</script>
