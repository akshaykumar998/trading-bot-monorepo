<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="w-full border-b border-sidebar-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div class="flex items-center gap-6">
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="rounded-md bg-primary p-2 text-primary-foreground font-bold">TN</div>
            <span class="font-semibold hidden sm:inline">Trading Bot</span>
          </RouterLink>
          <nav v-if="authStore.isAuthenticated" class="hidden md:flex items-center gap-4">
            <RouterLink
              to="/dashboard"
              class="text-sm font-medium hover:text-primary transition-colors"
              active-class="text-primary"
            >
              Dashboard
            </RouterLink>
            <RouterLink
              to="/create-workflow"
              class="text-sm font-medium hover:text-primary transition-colors"
              active-class="text-primary"
            >
              Create Workflow
            </RouterLink>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <template v-if="authStore.isAuthenticated">
            <Button variant="ghost" size="sm" @click="handleSignout">
              Sign Out
            </Button>
          </template>
          <template v-else>
            <RouterLink to="/auth">
              <Button variant="outline" size="sm">Sign In</Button>
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'

const router = useRouter()
const authStore = useAuthStore()

const handleSignout = () => {
  authStore.signout()
  router.push('/')
}
</script>
