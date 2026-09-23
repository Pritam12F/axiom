import { GrokLanguageModelsResponse } from '@main/types/model'
import 'dotenv/config'

export async function fetchGrokModels() {
  const res = await fetch('https://api.x.ai/v1/language-models', {
    headers: {
      Authorization: `Bearer ${process.env.XAI_API_KEY}`,
      Accept: 'application/json'
    }
  })

  if (!res.ok) throw new Error(`Failed: ${res.status}`)
  const data = await res.json()
  return data.models as GrokLanguageModelsResponse // array of models with full pricing & metadata
}
