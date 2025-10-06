import React, { useState } from "react";
import { Search, MapPin, X, Navigation } from "lucide-react";

export default function CitySearch({ onSearch, theme }) {
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

  const isLight = theme === "light";

  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center rounded-2xl shadow-sm transition-all duration-300 backdrop-blur-sm border ${
          isFocused 
            ? `ring-2 ${isLight ? "ring-blue-500 ring-opacity-50" : "ring-blue-400 ring-opacity-50"}`
            : ""
        } ${
          isLight 
            ? "bg-white/95 border-gray-200" 
            : "bg-slate-800/60 border-slate-600/50"
        }`}>
          <div className={`absolute left-4 ${
            isLight ? "text-gray-600" : "text-slate-400"  // Changed from text-gray-400 to text-gray-600
          }`}>
            <Search size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter city name..."
            className={`w-full py-4 pl-12 pr-12 rounded-2xl border-0 focus:outline-none focus:ring-0 backdrop-blur-sm ${
              isLight 
                ? "text-gray-800 bg-transparent placeholder-gray-500"  // Changed text-gray-700 to text-gray-800
                : "text-white bg-transparent placeholder-slate-400"
            }`}
          />
          {input && (
            <button
              type="button"
              onClick={clearInput}
              className={`absolute right-12 transition-colors ${
                isLight 
                  ? "text-gray-500 hover:text-gray-700"  // Changed from text-gray-400 to text-gray-500
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <X size={20} />
            </button>
          )}
          <button
            type="submit"
            disabled={!input.trim()}
            className={`absolute right-2 p-2 rounded-full transition-all ${
              isLight
                ? "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:opacity-50"
                : "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-700 disabled:opacity-50"
            } disabled:cursor-not-allowed`}
          >
            <Navigation size={20} />
          </button>
        </div>
      </form>
      <div className={`flex items-center justify-center mt-3 text-sm ${
        isLight ? "text-gray-600" : "text-slate-400"  // Changed from text-gray-500 to text-gray-600
      }`}>
        <MapPin size={14} className="mr-1" />
        <span>Search for any city worldwide</span>
      </div>
    </div>
  );
}