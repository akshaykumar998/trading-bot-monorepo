<template>
  <Sheet v-model:open="sheetModel">
    <SheetContent class="max-w-md mx-4 my-6">
      <SheetHeader class="flex flex-col gap-4">
        <SheetTitle class="text-lg font-semibold">Select Action</SheetTitle>
        <SheetDescription class="text-sm text-muted-foreground">
          Select the type of action that you need
        </SheetDescription>
        <Select v-model="selectedAction" @update="handleSelect" class="w-full">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select an Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="action in SUPPORTED_ACTIONS" :key="action.id" :value="action.id">
                <div class="flex flex-col">
                  <span class="font-medium">{{ action.title }}</span>
                  <span class="text-xs text-muted-foreground">{{ action.description }}</span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div
          v-if="
            selectedAction === 'hyperliquid' ||
            selectedAction === 'lighter' ||
            selectedAction === 'backpack'
          "
          class="mt-2 flex flex-col gap-2"
        >
          <Label for="metadata.type">Type</Label>
          <Select v-model="metadata.type" class="w-full">
            <SelectTrigger class="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel></SelectLabel>
                <SelectItem :value="'long'"> Long </SelectItem>
                <SelectItem :value="'short'"> Short </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Label for="qty">Qty</Label>
          <Input id="qty" type="text" v-model.number="metadata.qty" class="w-full"></Input>
          <Label for="metadata.asset">Symbol</Label>
          <AssetSelect v-model="metadata.symbol" class="w-full"></AssetSelect>
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
import { ref } from 'vue'
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
import SelectLabel from './ui/select/SelectLabel.vue'
import  { type TradingMetaData } from 'common/types';
import AssetSelect from './AssetSelect.vue'

const SUPPORTED_ACTIONS = ref([
  {
    id: 'hyperliquid',
    title: 'Hyperliquid',
    description: 'Place a trade on hyperliquid',
  },
  {
    id: 'lighter',
    title: 'Lighter',
    description: 'Place a trade on lighter',
  },
  {
    id: 'backpack',
    title: 'Backpack',
    description: 'Place a trade on backpack',
  },
])

const sheetModel = defineModel<boolean>('sheet-model')

const selectedAction = ref<string>('')

const handleSelect = (value: string | null) => {
  if (value) {
    selectedAction.value = value
  }
}

const emit = defineEmits<{
  'action-selected': [TradingMetaData]
}>()

const metadata = ref<TradingMetaData>({
  action: '',
  type: 'LONG',
  qty: 0,
  symbol: 'ETH',
})

const createFlow = () => {
  emit('action-selected', {
    action: selectedAction.value,
    type: metadata.value.type,
    qty: metadata.value.qty,
    symbol: metadata.value.symbol,
  })
}
</script>
