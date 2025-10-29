const BASE_URL = "https://openlibrary.org/search.json";

export async function searchBooks({ q = "", page = 1, limit = 20 }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  params.set("page", page);
  params.set("limit", limit);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return await res.json();
}

export function getCoverUrl(cover_i, size = "M") {
  if (!cover_i) return null;
  return `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`;
}
