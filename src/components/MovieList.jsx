import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]); // Movies currently displayed
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(9); // How many movies to display initially

  // Fetch all movies at once
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dummyapi.online/api/movies`);
      setMovies(response.data); // Store all movies
      setDisplayedMovies(response.data.slice(0, displayCount)); // Initially display a portion
    } catch (err) {
      setError('Failed to load movies');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Update displayed movies on search or load more
  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.movie.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
    setDisplayedMovies(filtered.slice(0, displayCount));
  }, [movies, searchTerm, displayCount]);

  // Handle infinite scroll (load more movies as user scrolls down)
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
      setDisplayCount((prevCount) => prevCount + 9); // Load more movies (in chunks of 9)
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && movies.length === 0) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          className=" hover:shadow-lg p-2 w-full rounded outline-none"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4  mt-8">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <div key={movie.id} className=" p-2 rounded hover:border transition-all shadow-lg flex gap-8">
              <img
                src="ShawshankRedemptionMoviePoster.jpg"
                alt={movie.movie}
                className="h-44 object-cover mb-4 rounded"
              />
              <div>
              <h2 className="font-bold text-xl">{movie.movie}</h2>
              <p className="text-sm mb-2">Rating: {movie.rating}</p>
              <a
                href={movie.imdb_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on IMDb
              </a>

              </div>
              
            </div>
          ))
        ) : (
          <p>No movies found for "{searchTerm}"</p>
        )}
      </div>

      {loading && <p>Loading more movies...</p>}
    </div>
  );
};

export default MovieList;
