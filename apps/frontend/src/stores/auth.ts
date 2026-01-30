import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/lib/http'

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const res = (error as { response?: { data?: { message?: unknown } } }).response?.data
    if (res && typeof res === 'object' && 'message' in res && typeof res.message === 'string') {
      return res.message
    }
  }
  return fallback
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const userId = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const signup = async (username: string, password: string) => {
    try {
      const response = await api.signup({ username, password })
      return { success: true, data: response.data }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Signup failed'),
      }
    }
  }

  const signin = async (username: string, password: string) => {
    try {
      const response = await api.signin({ username, password })
      const { token: newToken, id } = response.data
      token.value = newToken
      userId.value = id
      localStorage.setItem('token', newToken)
      return { success: true, data: response.data }
    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error, 'Signin failed'),
      }
    }
  }

  const signout = () => {
    token.value = null
    userId.value = null
    localStorage.removeItem('token')
  }

  return {
    token,
    userId,
    isAuthenticated,
    signup,
    signin,
    signout,
  }
})
