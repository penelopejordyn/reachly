const axios = require('axios');
const cheerio = require('cheerio');

// Interface for Post
interface Post {
  title: string;
  content: string;
  link: string;
  user: string;
}

// Scraper function
async function scrapeStackOverflow(keywords: string[]): Promise<Post[]> {
  try {
    const formattedKeywords = keywords.map(k => encodeURIComponent(k.trim())).join('%20');
    const url = `https://stackoverflow.com/questions/tagged/${formattedKeywords}?sort=Newest&edited=true`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const posts: Post[] = [];

    // Find all post elements
    const postElements = $('.s-post-summary');
    console.log(`Found ${postElements.length} post elements.`);

    // Iterate over each post element and extract details
    for (let i = 0; i < postElements.length; i++) {
      const el = postElements[i];
      const titleElement = $(el).find('h3 a');
      const userElement = $(el).find('div.s-user-card div a');
      const link = 'https://stackoverflow.com' + titleElement.attr('href');
      const title = titleElement.text().trim();
      const user = userElement.text().trim();

      // Fetch post content from the post link
      const postContent = await scrapePostContent(link);

      // Add the post details to the array
      posts.push({
        title,
        content: postContent, // Store the scraped post content
        link,
        user,
      });
    }

    return posts; // Return the scraped posts
  } catch (error) {
    console.error('Error scraping Stack Overflow:', error);
    return []; // Return an empty array in case of error
  }
}

// Helper function to scrape content of a specific post
async function scrapePostContent(postLink: string): Promise<string> {
  try {
    const { data } = await axios.get(postLink);
    const $ = cheerio.load(data);

    // Selector for the main content of the post
    const postBody = $('.s-prose.js-post-body').text().trim(); // Ensure you're targeting the correct class

    if (postBody) {
      return postBody;
    } else {
      return 'No content found';
    }
  } catch (error) {
    console.error(`Error scraping post content from ${postLink}:`, error);
    return 'Error fetching post content';
  }
}

export default scrapeStackOverflow;
