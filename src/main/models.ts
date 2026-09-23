// models.js
import { grokModels, grokModelsById } from '@main/constants/models'
import { fetchGrokModels } from './app/actions/models'

let modelsCache = null
let lastFetched = 0
const CACHE_TTL = 1000 * 60 * 60 * 6 // 6 hours

export async function getGrokModels({ force = false } = {}) {
  const now = Date.now()

  if (!force && modelsCache && now - lastFetched < CACHE_TTL) {
    return modelsCache
  }

  try {
    // Option A: Scrape / parse the official page (fragile but free)
    // Option B: Hit your own backend that keeps the data fresh
    // Option C: Use a community pricing API if one appears
    const fresh = await fetchGrokModels()
    modelsCache = fresh
    lastFetched = now
    return fresh
  } catch (err) {
    console.warn('Failed to fetch latest Grok models, using fallback', err)
    return {
      grokModels,
      grokModelsById
    }
  }
}
