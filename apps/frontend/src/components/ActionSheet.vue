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
              <SelectItem v-for="action in actionNodes" :key="action.slug" :value="action.slug">
                <div class="flex flex-col">
                  <span class="font-medium">{{ action.title }}</span>
                  <span class="text-xs text-muted-foreground">{{ action.description }}</span>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <template v-if="selectedNode">
          <div v-if="selectedNode.credentialsType?.length" class="mt-2 flex flex-col gap-2">
            <Label class="text-muted-foreground">Credentials</Label>
            <div
              v-for="cred in selectedNode.credentialsType"
              :key="cred.key"
              class="flex flex-col gap-1"
            >
              <Label :for="cred.key">{{ cred.title }}</Label>
              <Input
                :id="cred.key"
                :type="cred.key === 'password' ? 'password' : 'text'"
                v-model="credentials[cred.key]"
                class="w-full"
              />
            </div>
          </div>
          <div v-if="selectedNode.metadataNodeSchema?.length" class="mt-2 flex flex-col gap-2">
            <Label class="text-muted-foreground">Trade</Label>
            <template v-for="field in selectedNode.metadataNodeSchema" :key="field.fieldKey">
              <div v-if="field.type === 'select'" class="flex flex-col gap-1">
                <Label :for="field.fieldKey">{{ field.title }}</Label>
                <Select
                  :model-value="(metadata[field.fieldKey] as string)"
                  @update:model-value="(v) => setMetadataField(field.fieldKey, v)"
                  class="w-full"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue :placeholder="`Select ${field.title}`" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="opt in field.options"
                        :key="opt"
                        :value="opt"
                      >
                        {{ opt }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div v-else-if="field.type === 'number'" class="flex flex-col gap-1">
                <Label :for="field.fieldKey">{{ field.title }}</Label>
                <Input
                  :id="field.fieldKey"
                  type="number"
                  :model-value="Number(metadata[field.fieldKey]) || 0"
                  @update:model-value="(v) => setMetadataField(field.fieldKey, v != null ? Number(v) : 0)"
                  class="w-full"
                />
              </div>
              <div v-else-if="field.type === 'asset'" class="flex flex-col gap-1">
                <Label :for="field.fieldKey">{{ field.title }}</Label>
                <AssetSelect
                  :model-value="(metadata[field.fieldKey] as 'ETH' | 'SOL' | 'BTC')"
                  @update:model-value="(v) => setMetadataField(field.fieldKey, v)"
                  class="w-full"
                />
              </div>
            </template>
          </div>
        </template>
      </SheetHeader>

      <SheetFooter>
        <Button type="submit" @click="createFlow" class="w-full"> Create Flow </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ref, computed, onMounted } from 'vue'
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
import { type TradingMetaData } from 'common/types'
import AssetSelect from './AssetSelect.vue'
import { api } from '@/lib/http'

export type CredentialType = { key: string; title: string; required: boolean }
export type MetadataNodeField = {
  fieldKey: string
  title: string
  type: 'select' | 'number' | 'asset' | 'text'
  required?: boolean
  options?: string[]
}
export type ActionNode = {
  _id: string
  slug: string
  title: string
  description: string
  type: string
  credentialsType?: CredentialType[]
  metadataNodeSchema?: MetadataNodeField[]
}

const actionNodes = ref<ActionNode[]>([])
const sheetModel = defineModel<boolean>('sheet-model')
const selectedAction = ref<string>('')
const credentials = ref<Record<string, string>>({})
const metadata = ref<Record<string, unknown>>({ type: 'LONG', qty: 0, symbol: 'ETH' })

const selectedNode = computed(() =>
  actionNodes.value.find((n) => n.slug === selectedAction.value)
)

function setMetadataField(key: string, value: unknown) {
  metadata.value = { ...metadata.value, [key]: value }
}

onMounted(async () => {
  try {
    const res = await api.getNodes()
    const nodes = Array.isArray(res.data) ? res.data : []
    actionNodes.value = nodes.filter((n: ActionNode) => n.type === 'ACTION')
  } catch {
    actionNodes.value = []
  }
})

const handleSelect = (value: string | null) => {
  if (value) {
    selectedAction.value = value
    credentials.value = {}
    const node = selectedNode.value
    node?.credentialsType?.forEach((c) => {
      credentials.value[c.key] = ''
    })
    metadata.value = { type: 'LONG', qty: 0, symbol: 'ETH' }
    node?.metadataNodeSchema?.forEach((f) => {
      if (f.fieldKey === 'type') metadata.value.type = 'LONG'
      if (f.fieldKey === 'qty') metadata.value.qty = 0
      if (f.fieldKey === 'symbol') metadata.value.symbol = 'ETH'
    })
  }
}

const emit = defineEmits<{
  'action-selected': [TradingMetaData]
}>()

const createFlow = () => {
  const node = selectedNode.value
  if (!node) return
  const typeVal = (metadata.value.type as string) || 'LONG'
  emit('action-selected', {
    action: selectedAction.value,
    type: typeVal === 'SHORT' ? 'SHORT' : 'LONG',
    qty: Number(metadata.value.qty) || 0,
    symbol: (metadata.value.symbol as TradingMetaData['symbol']) || 'ETH',
    credentials: { ...credentials.value },
    nodeId: String(node._id),
  })
  sheetModel.value = false
}
</script>
