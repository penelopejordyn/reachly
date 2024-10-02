import { NextResponse } from 'next/server';
import scrapeStackOverflow from '../../scripts/scraper'; // Ensure the path is correct
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { keywords, description } = await req.json(); // Parse the request body

    if (!keywords || keywords.length === 0) {
      return NextResponse.json({ error: 'Keywords are required for scraping' }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ error: 'Business description is required' }, { status: 400 });
    }

    // Step 1: Scrape Stack Overflow using the provided keywords
    const posts = await scrapeStackOverflow(keywords); // Await the scraper function

    if (!posts || posts.length === 0) {
      return NextResponse.json({ error: 'No posts found for the given keywords' }, { status: 404 });
    }

    // Step 2: Use GPT-4 Turbo to filter relevant posts
    const relevantPosts = [];
    for (const post of posts) {
      const relevanceCheckPrompt = `
        You are an AI assistant. The user runs a business described as: "${description}". 
        Analyze the following Stack Overflow post to determine if it describes a pain point this business can solve. 
        If it's relevant, summarize why, max 300 chracters. Otherwise, just respond "Not relevant."
        
        Post Title: ${post.title}
        Post Content: ${post.content}
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: relevanceCheckPrompt }],
      });

      const analysis = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content 
        ? response.choices[0].message.content.trim() 
        : 'Not relevant';

      // Only include relevant posts
      if (!analysis.includes('Not relevant')) {
        relevantPosts.push({
          ...post,
          relevanceSummary: analysis, // Store the reason why the post is relevant
        });
      }
    }
    console.log(relevantPosts)
    return NextResponse.json({ posts: relevantPosts }, { status: 200 });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
