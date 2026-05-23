import React from "react";
import { useTheme } from "../context/useTheme";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-16 h-8 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out`}
      aria-label="Toggle Theme"
    >
      <div
        className={`absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <BsMoonFill className="text-gray-800 text-xs transition-opacity duration-300" />
        ) : (
          <BsSunFill className="text-yellow-500 text-xs transition-opacity duration-300" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
