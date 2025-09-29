import React, { useState } from "react";
import { Search, MapPin, X, Navigation } from "lucide-react";

export default function CitySearch({ onSearch }) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
      setInput("");
    }
  };

  const clearInput = () => {
    setInput("");
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center rounded-2xl shadow-sm transition-all duration-300 ${isFocused ? "ring-2 ring-blue-500 ring-opacity-50" : ""}`}>
          <div className="absolute left-4 text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter city name..."
            className="w-full py-4 pl-12 pr-12 text-gray-700 bg-white border-0 rounded-2xl focus:outline-none focus:ring-0"
          />
          {input && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-12 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Navigation size={20} />
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
        <MapPin size={14} className="mr-1" />
        <span>Search for any city worldwide</span>
      </div>
    </div>
  );
}