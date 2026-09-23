export function errorDecoder(err: unknown, message = 'Unknown error') {
  return err instanceof Error ? err.message : message
}
