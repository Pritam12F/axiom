export type IPCActionResponse<T> = {
  success: boolean
  message?: string
  error?: string
  data?: T | T[]
}
