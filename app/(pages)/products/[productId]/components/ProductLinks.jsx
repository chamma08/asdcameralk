"use client";

import { useState } from 'react';

export default function ProductLinks({ links }) {
  // Safely parse links if they're a string
  let parsedLinks = [];
  try {
    parsedLinks = typeof links === 'string' ? JSON.parse(links) : links;
  } catch (error) {
    console.error("Error parsing links:", error);
    return null;
  }
  
  // If no links are provided or the array is empty, don't render anything
  if (!parsedLinks || !Array.isArray(parsedLinks) || parsedLinks.length === 0) {
    return null;
  }

  return (
    <div className="py-3">
      <h3 className="font-medium text-lg mb-2">Related Links</h3>
      <div className="space-y-2">
        {parsedLinks.map((link, index) => {
          // Skip links that don't have both title and url
          if (!link.title || !link.url) return null;
          return <LinkCard key={index} link={link} />;
        })}
      </div>
    </div>
  );
}

function LinkCard({ link }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href={link.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`block p-3 border rounded-lg transition-all duration-200 ${
        isHovered ? 'bg-gray-100 border-gray-400' : 'border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center bg-gray-100 text-black rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
            </svg>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-blue-600">{link.title}</h4>
          <p className="text-xs text-gray-500 truncate">{link.url}</p>
        </div>
        <div className="ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </a>
  );
}