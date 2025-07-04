import React from 'react';
import './App.css';
import GiphySearch from './pages/GiphySearch';

function App() {
  return (
    <div className="w-full dark:bg-gray-800">
      <div className="max-w-[1450px] mx-auto">
        <GiphySearch />;
      </div>
    </div>

  );
}

export default App;
