<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-card border border-sidebar-border rounded-lg shadow-lg p-8 space-y-6">
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-bold">{{ isSignup ? 'Sign Up' : 'Sign In' }}</h1>
          <p class="text-muted-foreground">
            {{ isSignup ? 'Create a new account' : 'Welcome back' }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="username">Username</Label>
            <Input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
              :disabled="loading"
            />
          </div>

          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p class="text-sm text-destructive">{{ error }}</p>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In' }}
          </Button>
        </form>

        <div class="text-center text-sm">
          <button
            type="button"
            @click="isSignup = !isSignup"
            class="text-primary hover:underline"
          >
            {{ isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const authStore = useAuthStore()

const isSignup = ref(false)
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    let result
    if (isSignup.value) {
      result = await authStore.signup(username.value, password.value)
      if (result.success) {
        // After signup, automatically sign in
        result = await authStore.signin(username.value, password.value)
      }
    } else {
      result = await authStore.signin(username.value, password.value)
    }

    if (result.success) {
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/dashboard')
    } else {
      error.value = result.error || 'An error occurred'
    }
  } catch (err) {
    error.value = (err as Error).message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>
