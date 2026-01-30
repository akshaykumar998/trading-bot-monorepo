<template>
  <Sheet defaultOpen>
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
                v-for="trigger in SUPPORTED_TRIGGERS"
                :key="trigger.id"
                :value="trigger.id"
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
          <Input id="timer" type="text" v-model.number="metadata.time" class="w-full"></Input>
        </div>
        <div
          v-if="selectedTrigger === 'price-trigger' && metadata.type === 'price-trigger'"
          class="mt-2 flex flex-col gap-2"
        >
          <Label for="price">Price</Label>
          <Input id="price" type="text" v-model.number="metadata.price" class="w-full"></Input>
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
import { ref, watch } from 'vue'
import type { PriceTriggerMetaData } from '@/nodes/triggers/PriceTrigger.vue'
import type { TimerNodeMetaData } from '@/nodes/triggers/TimersNode.vue'
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

const SUPPORTED_TRIGGERS = ref([
  {
    id: 'timer',
    title: 'Timer',
    description: 'Run this trigger every x seconds/minutes',
  },
  {
    id: 'price-trigger',
    title: 'Price Trigger',
    description: 'Runs whenever the price goes above or below a certain number',
  },
])

type NodeKind = 'price-trigger' | 'timer'

const selectedTrigger = ref<NodeKind | null>(null)

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
  if (selectedTrigger.value === 'timer' && metadata.value.type === 'timer') {
    emit('trigger-selected', {
      type: 'timer',
      data: {
        time: metadata.value.time,
      },
    })
  }

  if (selectedTrigger.value === 'price-trigger' && metadata.value.type === 'price-trigger') {
    emit('trigger-selected', {
      type: 'price-trigger',
      data: {
        asset: metadata.value.asset,
        price: metadata.value.price,
        decimals: metadata.value.decimals,
      },
    })
  }
}
</script>
