export interface GifImage {
    url: string;
    width: string;
    height: string;
    size?: string;
    mp4?: string;
    mp4_size?: string;
    webp?: string;
    webp_size?: string;
}

export interface GifImages {
    original: GifImage;
    fixed_height: GifImage;
    downsized: GifImage;
    fixed_width?: GifImage;
    preview?: GifImage;
}

export interface Gif {
    type: string;
    id: string;
    slug: string;
    url: string;
    bitly_gif_url: string;
    embed_url: string;
    title: string;
    username: string;
    rating: string;
    source: string;
    images: GifImages;
}

export interface GiphyApiResponse {
    data: Gif[];
    pagination: {
        total_count: number;
        count: number;
        offset: number;
    };
    meta: {
        status: number;
        msg: string;
        response_id: string;
    };
}
