'use client';

import { useState } from 'react';
import { usePosts } from '../PostsContext'; // Assuming you're using a context to store the scraped posts data

export default function OutreachPage() {
  const { posts } = usePosts(); // Access the posts from context, make sure posts is an array
  const [outreachMessages, setOutreachMessages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  // Ensure that posts is at least an empty array to avoid undefined issues
  const postList = posts || [];

  const generateOutreach = async (index: number, postContent: string) => {
    setLoading((prev) => ({ ...prev, [index]: true }));

    try {
      const companyInfo = 'Your Company Name'; // Replace this with your company's information

      const res = await fetch('/api/generateOutreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postContent, companyInfo }),
      });

      const data = await res.json();
      if (data.outreachMessage) {
        setOutreachMessages((prev) => ({ ...prev, [index]: data.outreachMessage }));
      }
    } catch (error) {
      console.error('Failed to generate outreach:', error);
    } finally {
      setLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-purple-600">Your Leads</h1>
        </div>

        {/* Info Section */}
        <div className="mb-4 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700">{postList.length} contacts found</span>
          <span className="text-sm text-gray-500">
            Source code at <a href="#" className="text-blue-500 hover:underline">github.com/penelopejordyn</a>
          </span>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto overflow-y-hidden">
          <table className="min-w-full table-auto bg-white rounded-lg text-left">
            {/* Table Head */}
            <thead className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100">
              <tr className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                <th className="py-3 px-6">Select</th>
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Relevance</th>
                <th className="py-3 px-6">Post Content</th>
                <th className="py-3 px-6">Link</th>
                <th className="py-3 px-6">Generate Outreach Message</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-800">
              {postList.map((post, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </td>
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <img
                      src="https://via.placeholder.com/32"
                      alt="profile"
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <span className="font-semibold">{post.user}</span>
                  </td>
                  <td className="py-4 px-6">{post.relevanceSummary}</td>
                  <td className="py-4 px-6 max-h-20 max-w-60 overflow-hidden text-ellipsis">
                    {post.content.length > 200 ? post.content.slice(0, 200) + '...' : post.content}
                  </td>
                  <td className="py-4 px-6">
                    <a
                      href={post.link}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-green-500 transition duration-300 ease-in-out"
                      onClick={() => generateOutreach(index, post.content)}
                      disabled={loading[index]}
                    >
                      {loading[index] ? 'Generating...' : 'Generate'}
                    </button>
                    {outreachMessages[index] && (
                      <div className="mt-2 text-sm text-gray-600 max-h-40 overflow-auto">
                        <strong>Outreach Message:</strong> {outreachMessages[index]}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
