const grokModels = {
  // =====================
  // TEXT / CHAT MODELS
  // =====================
  text: [
    {
      id: 'grok-4.7',
      name: 'Grok 4.7',
      context: 500_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 2.0, cachedInput: 0.5, output: 6.0 },
        long: { input: 4.0, cachedInput: 1.0, output: 12.0 }
      },
      notes:
        'Flagship model. Configurable reasoning (low/medium/high/xhigh). Knowledge cutoff: May 2026. Always returns encrypted reasoning on Responses API.'
    },
    {
      id: 'grok-4.6',
      name: 'Grok 4.6',
      context: 500_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 2.0, cachedInput: 0.5, output: 6.0 },
        long: { input: 4.0, cachedInput: 1.0, output: 12.0 }
      }
    },
    {
      id: 'grok-4.5',
      name: 'Grok 4.5',
      context: 500_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 2.0, cachedInput: 0.3, output: 6.0 },
        long: { input: 4.0, cachedInput: 0.6, output: 12.0 }
      }
    },
    {
      id: 'grok-4.3',
      name: 'Grok 4.3',
      context: 1_000_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 1.25, cachedInput: 0.2, output: 2.5 },
        long: { input: 2.5, cachedInput: 0.4, output: 5.0 }
      }
    },
    {
      id: 'grok-4.20-0309-reasoning',
      name: 'Grok 4.20-0309 Reasoning',
      context: 1_000_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 1.25, cachedInput: 0.2, output: 2.5 },
        long: { input: 2.5, cachedInput: 0.4, output: 5.0 }
      }
    },
    {
      id: 'grok-4.20-0309-non-reasoning',
      name: 'Grok 4.20-0309 Non-Reasoning',
      context: 1_000_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 1.25, cachedInput: 0.2, output: 2.5 },
        long: { input: 2.5, cachedInput: 0.4, output: 5.0 }
      }
    },
    {
      id: 'grok-4.20-multi-agent-0309',
      name: 'Grok 4.20 Multi-Agent 0309',
      context: 1_000_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 1.25, cachedInput: 0.2, output: 2.5 },
        long: { input: 2.5, cachedInput: 0.4, output: 5.0 }
      }
    },
    {
      id: 'grok-build-0.1',
      name: 'Grok Build 0.1',
      context: 256_000,
      longContextThreshold: 200_000,
      pricing: {
        short: { input: 1.0, cachedInput: 0.2, output: 2.0 },
        long: { input: 2.0, cachedInput: 0.4, output: 4.0 }
      }
    }
  ],

  // =====================
  // IMAGINE (IMAGE / VIDEO)
  // =====================
  imagine: {
    image: [
      { id: 'grok-imagine-image-2.0', name: 'Grok Imagine Image 2.0', costPerImage: 0.04 },
      { id: 'grok-imagine-image', name: 'Grok Imagine Image', costPerImage: 0.02 },
      { id: 'grok-imagine-image-quality', name: 'Grok Imagine Image Quality', costPerImage: 0.05 }
    ],
    video: [
      { id: 'grok-imagine-video-1.5', name: 'Grok Imagine Video 1.5', costPerSecond: 0.08 },
      { id: 'grok-imagine-video', name: 'Grok Imagine Video', costPerSecond: 0.05 }
    ]
  },

  // =====================
  // VOICE
  // =====================
  voice: {
    speechToSpeech: {
      id: 'grok-voice-think-fast-2.0',
      name: 'Speech to Speech (grok-voice-think-fast-2.0)',
      cost: {
        audioPerMinute: 0.08, // $4.80 / hr
        textInputPerChar: 0.004 // note: original said $0.004 / text input
      }
    },
    speechToText: {
      rest: { costPerHour: 0.1 },
      streaming: { costPerHour: 0.2 }
    },
    textToSpeech: {
      costPerMillionChars: 15.0
    }
  },

  // =====================
  // HELPER / META
  // =====================
  meta: {
    recommended: {
      code: 'grok-4.7',
      chat: 'grok-4.7',
      images: 'grok-imagine-image-2.0',
      videos: 'grok-imagine-video-1.5',
      voice: 'Grok Voice API'
    },
    knowledgeCutoff: {
      'grok-4.7': 'May 2026'
    },
    notes: [
      'Prices are per 1 million tokens unless otherwise noted.',
      'Models with long-context pricing charge the higher rate for the entire request once the prompt reaches the threshold.',
      'No access to realtime events without search tools enabled.',
      'Chat models have no role-order limitation.',
      'logprobs / top_logprobs are not supported on grok-4.20 and newer.',
      'Image input: max 20 MiB, unlimited number of images, jpg/jpeg or png only.',
      'Batch API is not supported on every model.'
    ]
  }
}

// Optional: flat lookup by model id
const grokModelsById = Object.fromEntries([
  ...grokModels.text.map((m) => [m.id, { ...m, category: 'text' }]),
  ...grokModels.imagine.image.map((m) => [m.id, { ...m, category: 'imagine-image' }]),
  ...grokModels.imagine.video.map((m) => [m.id, { ...m, category: 'imagine-video' }]),
  [grokModels.voice.speechToSpeech.id, { ...grokModels.voice.speechToSpeech, category: 'voice' }]
])

export { grokModels, grokModelsById }
