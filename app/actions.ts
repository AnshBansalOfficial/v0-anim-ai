"use server"

export async function callLangGraphAPI(prompt: string) {
  console.log("[v0] callLangGraphAPI called with prompt:", prompt)

  try {
    console.log("[v0] Starting mock API simulation...")
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log("[v0] Mock API returning response...")
    // Mock response with video URL
    const mockResponse = {
      success: true,
      text: `Generated animation for: "${prompt}"`,
      videoUrl:
        "https://pub-b215a097b7b243dc86da838a88d50339.r2.dev/media/videos/CircleToSquareTransformation/480p15/CircleToSquareTransformation.mp4",
    }

    console.log("[v0] Mock response:", mockResponse)
    return mockResponse
  } catch (error) {
    console.error("[v0] Error in mock API:", error)
    return {
      success: false,
      error: "Failed to generate animation. Please try again.",
    }
  }
}
