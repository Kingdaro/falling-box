export function raise(error: unknown): never {
  throw typeof error === "string" ? new Error(error) : error
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
