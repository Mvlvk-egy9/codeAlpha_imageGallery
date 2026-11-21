import axios from "axios";

const API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;
const BASE_URL = "https://pixabay.com/api/";

export const CATEGORIES = [
  "All",
  "Nature",
  "Architecture",
  "Minimal",
  "Art",
  "Animals",
  "Travel",
  "Technology",
  "Food",
  "Fashion",
  "Black & White",
  "Coffee",
  "Music",
  "Books",
  "Street",
  "Fitness",
  "Sunset",
  "Ocean",
  "Mountains",
  "Forest",
  "Space",
];

export const INITIAL_PHOTOS = [
  {
    id: 1,
    title: "Misty Pine Ridge",
    category: "Nature",
    photographer: "Elena Rostova",
    thumb:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80",
    src:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=85",
    alt: "Sunlight filtering through tall green forest trees",
  },
  {
    id: 2,
    title: "Geometric Concrete Facade",
    category: "Architecture",
    photographer: "Marcus Vance",
    thumb:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    src:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    alt: "Modern glass and concrete building looking upward",
  },
  {
    id: 3,
    title: "Quiet Shadow & Stone",
    category: "Minimal",
    photographer: "Sora Takahashi",
    thumb:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
    src:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=85",
    alt: "Minimalist architectural detail with soft shadows",
  },
  {
    id: 4,
    title: "Warm Ochre Brushstrokes",
    category: "Art",
    photographer: "Camille Laurent",
    thumb:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=800&q=80",
    src:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1600&q=85",
    alt: "Abstract textured painting with warm earth tones",
  },
];

function normalizePixabayPhoto(item, fallbackCategory = "General") {
  const firstTag = item.tags ? item.tags.split(",")[0].trim() : "";
  return {
    id: item.id,
    title: firstTag || item.tags || `Photo #${item.id}`,
    category: fallbackCategory,
    photographer: item.user || "Unknown",
    thumb: item.webformatURL || item.largeImageURL,
    src: item.largeImageURL || item.webformatURL,
    alt: item.tags || `Photo by ${item.user}`,
    width: item.imageWidth,
    height: item.imageHeight,
    tags: item.tags ? item.tags.split(",").map((t) => t.trim()) : [],
  };
}

export async function fetchPixabayPhotos({
  category = "All",
  query = "",
  page = 1,
  perPage = 12,
}) {
  if (!API_KEY) {
    throw new Error("Missing VITE_PIXABAY_API_KEY in .env");
  }

  const trimmedQuery = query.trim();
  const searchTerm = trimmedQuery
    ? trimmedQuery
    : category !== "All"
    ? category
    : "yellow flowers";

  const { data } = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchTerm,
      image_type: "photo",
      page,
      per_page: perPage,
      safesearch: true,
    },
  });

  const activeTag = trimmedQuery || category;

  return (data.hits || []).map((item) =>
    normalizePixabayPhoto(item, activeTag)
  );
}