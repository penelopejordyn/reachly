'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { usePosts } from './PostsContext'; // Context for storing posts

export default function HomePage() {
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isScraping, setIsScraping] = useState(false);
  const router = useRouter(); // Initialize the router
  const { setPosts } = usePosts(); // Use the context to set posts globally

  const fetchKeywords = async () => {
    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      setKeywords(data.keywords);
    } catch (error) {
      console.error('Error fetching keywords:', error);
    }
  };

  const scrapePosts = async () => {
    setIsScraping(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords, description }), // Send keywords and description
      });

      const data = await res.json();
      setPosts(data.posts); // Store scraped posts in context
      router.push('/outreach'); // Navigate to outreach page
    } catch (error) {
      console.error('Error scraping posts:', error);
    }
    setIsScraping(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Business Description</h1>
        
        {/* Textarea */}
        <textarea
          className="border border-gray-300 rounded-lg p-4 w-full mb-4 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300 transition duration-300 ease-in-out"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter your business description"
          rows={5}
        />

        {/* Generate Keywords Button */}
        <button
          onClick={fetchKeywords}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out"
        >
          Generate Keywords
        </button>

        {/* Keywords Section */}
        {Array.isArray(keywords) && keywords.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Keywords</h2>

            {keywords.map((keyword, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg p-3 flex-1 shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300 transition duration-300 ease-in-out"
                  value={keyword}
                  onChange={(e) => {
                    const updatedKeywords = [...keywords];
                    updatedKeywords[index] = e.target.value;
                    setKeywords(updatedKeywords);
                  }}
                />
                <button
                  onClick={() => setKeywords(keywords.filter((_, i) => i !== index))}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg ml-4 hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Add Keyword Button */}
            <button
              onClick={() => setKeywords([...keywords, ''])}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-600 transition duration-300 ease-in-out"
            >
              Add Keyword
            </button>

            {/* Scrape StackOverflow Button */}
            <button
              onClick={scrapePosts}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out mt-4"
            >
              Scrape Stack Overflow
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isScraping && (
          <div className="mt-6 text-blue-500">
            <p>Scraping Stack Overflow for relevant posts...</p>
          </div>
        )}
      </div>
    </div>
  );
}
