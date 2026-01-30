<template>
  <div
    class="p-3 rounded-md border bg-card text-card-foreground shadow-sm w-52 min-w-[12rem] flex flex-col gap-1"
  >
    HyperLiquid trade
    <div class="text-xs text-muted-foreground">{{ data.type }}</div>
    <div class="text-xs text-muted-foreground">{{ data.qty }}</div>
    <div class="text-xs text-muted-foreground">{{ data.symbol }}</div>
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>

<script lang="ts" setup>
import  { type TradingMetaData } from 'common/types';
import { Handle, Position } from '@vue-flow/core'

defineProps<{
  data: TradingMetaData
}>()
</script>
