import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]); 
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(9);

  
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://dummyapi.online/api/movies`);
      setMovies(response.data);
      setDisplayedMovies(response.data.slice(0, displayCount));
    } catch (err) {
      setError('Failed to load movies');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);


  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.movie.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
    setDisplayedMovies(filtered.slice(0, displayCount));
  }, [movies, searchTerm, displayCount]);

  
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !loading) {
      setDisplayCount((prevCount) => prevCount + 9); 
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && movies.length === 0) {
    return <div className='flex h-screen items-center justify-center'>
      <span className="loading loading-dots loading-lg"></span>
    </div>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
       
        <label className="input input-bordered flex items-center gap-2">
  <input type="text" className="grow" placeholder="Search"  onChange={(e) => setSearchTerm(e.target.value)}/>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 opacity-70">
    <path
      fillRule="evenodd"
      d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
      clipRule="evenodd" />
  </svg>
</label>
      </div>

      <div className="grid grid-cols-3 gap-4  mt-8">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <div key={movie.id} className=" p-2 rounded hover:border h-fit transition-all shadow-lg flex gap-8">
              <img
                src="ShawshankRedemptionMoviePoster.jpg"
                alt={movie.movie}
                className="h-44 object-cover mb-4 rounded"
              />
              <div>
              <h2 className="font-bold text-xl">{movie.movie}</h2>
              <p className="text-sm mb-2 ">Rating: {movie.rating}</p>
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
