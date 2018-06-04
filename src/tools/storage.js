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

  mergeObject(key: string, obj): void {
    const item = this._data[key]
    if (item) {
      const _obj = JSON.parse(item)
      this._data[key] = JSON.stringify({ ..._obj, ...obj })
    } else {
      this._data[key] = JSON.stringify(obj)
    }
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

export const localStorage = hasStorage(window.localStorage) ? window.localStorage : new ShimStorage()

export const sessionStorage = hasStorage(window.sessionStorage) ? window.sessionStorage : new ShimStorage()
