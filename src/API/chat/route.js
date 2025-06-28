async function handler({ message, model = "claude-3.5-sonnet" }) {
  if (!message || typeof message !== "string") {
    return { error: "Message is required and must be a string" };
  }

  try {
    // Enhanced system prompt with integration capabilities
    const systemPrompt = `You are MavinoAI, an advanced AI assistant with access to 30+ powerful integrations. You can help users with:

🎨 Image Generation (Stable Diffusion V3, DALL-E 3)
🌐 Translation & Search (Google Translate, Google Search, Image Search)
📍 Location Services (Google Places, Local Business Data, Weather)
📧 Communication (Email Check, Text-to-Speech, Audio Transcription)
🌍 Web Services (Domain Whois, Web Scraping, QR Codes)
📄 Document Processing (PDF Generation, File Converter, PDF Parser)
🛒 Business Tools (Product Search, Sales Tax Calculator, SEO Research)
📚 Entertainment (Books, Movies/TV, Anime/Manga, Basketball stats)
💻 Development (Code Runner, Charts, UI Libraries)
🛡️ Moderation & Safety (Text Moderation)

When users ask for something that requires these integrations, provide helpful responses and explain what you found. If results aren't perfect, suggest how they can research more deeply. Be conversational and helpful, never say you "can't do this" - instead explain what you discovered and how to explore further.

Always provide value and actionable information. Make your responses engaging and informative.`;

    const response = await fetch("/integrations/anthropic-claude-sonnet-3-5/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return { response: data.choices[0].message.content };
    } else {
      throw new Error("Unexpected response format from Claude API");
    }
  } catch (error) {
    console.error("Error calling Claude API:", error);
    return {
      error:
        "I encountered an issue processing your request. Please try again, and I'll do my best to help you!",
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
