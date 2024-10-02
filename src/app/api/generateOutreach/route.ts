
import { NextResponse } from 'next/server';
import OpenAI from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Handler for the POST request
export async function POST(req: Request) {
  try {
    const { postContent, companyInfo } = await req.json();

    // Create a prompt for OpenAI
    const prompt = `
      You are an expert in business outreach. Generate an outreach message to a potential client based on the following StackOverflow post:
      
      Post Content: "${postContent}"
      
      Mention how our company, ${companyInfo}, can solve their problem. Keep the tone professional and focused on offering a solution to their problem.
    `;

    // Call OpenAI's GPT API
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = response.choices[0].message.content;

    // Return the generated message
    return NextResponse.json({ outreachMessage: message });
  } catch (error) {
    console.error('Error generating outreach message:', error);
    return NextResponse.json({ error: 'Failed to generate outreach message' }, { status: 500 });
  }
}
