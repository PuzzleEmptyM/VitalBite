// components/SearchBar.tsx

import React, { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Search...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-md flex items-center space-x-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Search Lifestyle Tips"
        className="flex-grow py-2 px-4 rounded-3xl border border-black bg-mint focus:outline-none font-playfair text-forest_green placeholder-black"
      />
      <button
        type="button"
        onClick={handleSearch}
        className="py-2 px-6 font-bold rounded-3xl bg-mint border border-black text-black font-playfair shadow-md hover:bg-dark_green transition-colors duration-200"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
