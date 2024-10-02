'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a Post
interface Post {
  title: string;
  content: string;
  link: string;
  relevanceSummary: string;
  user: string;
}

// Define the context shape
interface PostsContextType {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

// Create the context with default values
const PostsContext = createContext<PostsContextType | undefined>(undefined);

// Create a provider component
export const PostsProvider = ({ children }: { children: ReactNode }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <PostsContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

// Create a custom hook to use the PostsContext
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
};
