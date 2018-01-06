class ShimStorage {
  constructor() {
    this._data = {}
  }

  get length(): number {
    return Object.keys(this._data).length
  }

  key(index: number): ?string {
    return Object.keys(this._data).sort()[index]
  }

  getItem(key: string): ?string {
    return this._data[key]
  }

  setItem(key: string, value: string): void {
    this._data[key] = value
  }

  removeItem(key: string): void {
    delete this._data[key]
  }

  clear(): void {
    this._data = {}
  }
}

function hasStorage(storage) {
  const testKey = '__testLocalStorageExists'
  try {
    const oldVal = storage.getItem(testKey)
    storage.setItem(testKey, testKey)
    if (oldVal === null || typeof oldVal === 'undefined') {
      storage.removeItem(testKey)
    } else {
      storage.setItem(testKey, oldVal)
    }

    return true
  } catch (e) {
    return false
  }
}

export const localStorage =
  hasStorage(window.localStorage) ? window.localStorage : new ShimStorage()

export const sessionStorage =
  hasStorage(window.sessionStorage) ? window.sessionStorage : new ShimStorage()
