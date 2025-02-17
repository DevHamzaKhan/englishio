'use server'

import { createAI } from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

export const AI = createAI({
  actions: {
    // Add any AI actions here
  },
  initialUIState: [],
  initialAIState: []
})