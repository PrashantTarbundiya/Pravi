import { OpenRouter } from "@openrouter/sdk"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env reliably regardless of where script is launched from
dotenv.config({ path: path.resolve(__dirname, '../.env') })
dotenv.config() // fallback

const apiKey = process.env.OPENROUTER_API_KEY || "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"

console.log("Using API Key:", apiKey ? `${apiKey.substring(0, 14)}...` : "NONE")

const openrouter = new OpenRouter({
  apiKey
})

async function test() {
  try {
    console.log("Calling OpenRouter with model nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free ...")

    // We use OpenRouter chat.send with streaming
    const stream = await openrouter.chat.send({
      chatRequest: {
        model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages: [
          {
            role: "user",
            content: "You are an AI for road infrastructure inspection. How do you assess road potholes and verify photo evidence? Answer concisely in 2 sentences."
          }
        ],
        stream: true,
        maxTokens: 300
      }
    })

    let response = ""
    let reasoning = ""

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta
      const content = delta?.content
      // Delta may also contain reasoning text in reasoning-enabled models
      const reasoningChunk = delta?.reasoning || delta?.reasoning_details?.[0]?.text

      if (reasoningChunk) {
        reasoning += reasoningChunk
        process.stdout.write(`[Thinking] ${reasoningChunk}`)
      }

      if (content) {
        response += content
        process.stdout.write(content)
      }

      // Usage information comes in the final chunk
      if (chunk.usage) {
        console.log("\n\nUsage Stats:")
        console.log("- Total tokens:", chunk.usage.totalTokens)
        console.log("- Reasoning tokens:", chunk.usage.completionTokensDetails?.reasoningTokens || 0)
      }
    }

    console.log("\n\nFinished successfully!")
  } catch (err) {
    console.error("OpenRouter Test Error:", err)

    // If upstream Nvidia worker hits temporary free limit (16/16), explain gracefully
    if (err?.message?.includes("Worker local total request limit reached")) {
      console.log("\n[Note: Nvidia free endpoint temporarily congested. Automatic fallback kicks in for production pipeline.]")
    }
  }
}

test()
