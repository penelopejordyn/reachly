import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the request body
    const { description } = body;

    if (!description) {
      return NextResponse.json({ error: 'Business description is required' }, { status: 400 });
    }

    // Use OpenAI API to get keywords from business description
    const prompt = `Extract 5 keywords from this business description that users would sue to search for it. do not number them. seperate by commas. each keyword should be one word only:\n\n${description}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }
    const keywords = content.trim().split(',').map(k => k.trim());

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
