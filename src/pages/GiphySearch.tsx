import { useState } from 'react';
import axios from 'axios';
import GifCard from '../components/GifCard';
import { Gif, GiphyApiResponse } from '../types/Gif';

function GiphySearch(): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('');
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(false);

    const LIMIT = 20;

    const fetchGifs = async (isLoadMore: boolean = false): Promise<void> => {
        if (!searchTerm.trim()) return;
        setLoading(true);
        setError(null);

        try {
            setHasSearched(true);
            const response = await axios.get<GiphyApiResponse>(
                'https://api.giphy.com/v1/gifs/search',
                {
                    params: {
                        // eslint-disable-next-line camelcase
                        api_key: process.env.REACT_APP_GIPHY_API_KEY,
                        q: searchTerm,
                        limit: LIMIT,
                        offset: isLoadMore ? offset : 0,
                        rating: 'g',
                    },
                }
            );

            const newGifs = response.data.data;
            const totalAvailable = response.data.pagination.total_count;

            if (isLoadMore) {
                setGifs((prev) => [...prev, ...newGifs]);
                setOffset((prev) => prev + LIMIT);
            } else {
                setGifs(newGifs);
                setOffset(LIMIT);
            }

            setHasMore(offset + LIMIT < totalAvailable);
        } catch {
            setError('Something Went Wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-4">
            <h1 className="text-3xl font-bold text-center mb-6 dark:text-white">Giphy Search</h1>

            <div className="flex justify-center gap-2 mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for GIFs..."
                    className="px-4 py-2 w-64 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => fetchGifs(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </div>

            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && gifs.length === 0 && hasSearched && !error && (
                <p className="text-center text-gray-500">No results found.</p>
            )}

            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4 px-4">
                {loading
                    ? Array.from({ length: LIMIT }).map((_, idx) => (
                        <div
                            key={idx}
                            className="mb-4 w-full h-[200px] bg-gray-300 animate-pulse rounded"
                        />
                    ))
                    : gifs.map((gif) => <GifCard key={gif.id} gif={gif} />)}
            </div>


            {!loading && hasMore && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => fetchGifs(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}

export default GiphySearch;
