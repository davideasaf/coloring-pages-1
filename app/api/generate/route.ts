import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  const { prompt } = await request.json();
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url",
    });
    const url = response.data?.[0]?.url ?? null;
    return NextResponse.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
