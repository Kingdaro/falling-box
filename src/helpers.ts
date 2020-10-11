export function raise(error: unknown): never {
  throw typeof error === "string" ? new Error(error) : error
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function compare<T>(
  getValue: (item: T) => number,
  { reverse = false } = {},
) {
  return (first: T, second: T) => {
    let firstValue = getValue(first)
    let secondValue = getValue(second)
    if (reverse) {
      ;[firstValue, secondValue] = [secondValue, firstValue]
    }
    return firstValue - secondValue
  }
}
