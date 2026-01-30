<template>
  <div
    class="p-3 rounded-md border bg-card text-card-foreground shadow-sm w-44 min-w-[10rem] flex flex-col gap-1"
  >
    <div class="text-sm font-medium">Price Trigger</div>
    <div class="text-xs text-muted-foreground">{{ data.asset }} @ {{ data.price }}</div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script lang="ts" setup>
import { Handle, Position, type HandleConnectable } from '@vue-flow/core'
import type { PriceTriggerMetaData } from 'common/types';

defineProps<{
  data: PriceTriggerMetaData
  connectable: HandleConnectable
}>()
</script>
