import { useState } from 'react';
import { Gif } from '../types/Gif';

interface GifCardProps {
    gif: Gif;
}

function GifCard({ gif }: GifCardProps): JSX.Element {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = async (): Promise<void> => {
        try {
            await navigator.clipboard.writeText(gif.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            console.log("Something Went Wrong")
        }
    };

    return (
        <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded shadow hover:scale-105 transition-transform duration-200">
            <img
                src={gif.images.fixed_width.url}
                alt={gif.title}
                loading="lazy"
                className="w-full h-auto object-cover"
            />

            {/* Hover Action Buttons Container */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                    onClick={handleCopy}
                    className="mb-2 px-3 py-1 bg-white text-sm rounded text-black shadow hover:bg-gray-200 transition"
                >
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>

                <a
                    href={gif.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-sm text-white rounded shadow hover:bg-blue-700 transition"
                >
                    View on Giphy
                </a>
            </div>
        </div>
    );
}

export default GifCard;
