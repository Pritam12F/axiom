export type ModelEffortTier = 'low' | 'medium' | 'high' | 'extra_high'

/** Price is in USD cents per 100 million tokens */
type TokenPrice = number // e.g. 20000 = $2.00 / 1M tokens

export interface GrokLanguageModel {
  id: string
  object: 'model'
  owned_by: string
  created: number // Unix timestamp
  version: string
  fingerprint: string

  aliases: string[]

  input_modalities: ('text' | 'image' | string)[]
  output_modalities: ('text' | 'image' | string)[]

  // Standard pricing
  prompt_text_token_price: TokenPrice
  prompt_image_token_price: TokenPrice
  cached_prompt_text_token_price: TokenPrice
  completion_text_token_price: TokenPrice
  search_price: TokenPrice

  // Long-context pricing (0 means "use the standard price")
  long_context_threshold: number // tokens; 0 = no long-context tier
  prompt_text_token_price_long_context: TokenPrice
  cached_prompt_text_token_price_long_context: TokenPrice
  completion_text_token_price_long_context: TokenPrice
}

export interface GrokLanguageModelsResponse {
  models: GrokLanguageModel[]
}
