"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { movieApi, type Movie } from "../../lib/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";

// SVG Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const FilmIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
    <line x1="7" y1="2" x2="7" y2="22" />
    <line x1="17" y1="2" x2="17" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
  </svg>
);

// Genre tabs
const genres = ["全部", "剧情", "科幻", "动作", "爱情", "悬疑", "动画", "恐怖", "纪录片"];

// Default movies for display
const defaultMovies = [
  { movieId: 1, title: "肖申克的救赎", posterImage: "https://upload.wikimedia.org/wikipedia/en/1/19/Shawshank_Redemption_ver2.jpg", releaseDate: "1994-09-10", runtime: 142, genre: "剧情 / 犯罪", averageScore: 9.7 },
  { movieId: 2, title: "低俗小说", posterImage: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg", releaseDate: "1994-10-14", runtime: 154, genre: "剧情 / 犯罪", averageScore: 8.9 },
  { movieId: 3, title: "星际穿越", posterImage: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interpreter_ver5.jpg", releaseDate: "2014-11-05", runtime: 169, genre: "科幻 / 冒险", averageScore: 9.4 },
  { movieId: 4, title: "沙丘", posterImage: "https://upload.wikimedia.org/wikipedia/en/8/8e/Dune_%282021_film%29.jpg", releaseDate: "2021-09-03", runtime: 155, genre: "科幻 / 冒险", averageScore: 8.5 },
  { movieId: 5, title: "教父", posterImage: "https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg", releaseDate: "1972-03-24", runtime: 175, genre: "剧情 / 犯罪", averageScore: 9.3 },
  { movieId: 6, title: "黑暗骑士", posterImage: "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg", releaseDate: "2008-07-18", runtime: 152, genre: "动作 / 犯罪", averageScore: 9.0 },
  { movieId: 7, title: "寄生虫", posterImage: "https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png", releaseDate: "2019-05-21", runtime: 132, genre: "剧情 / 惊悚", averageScore: 8.6 },
  { movieId: 8, title: "千与千寻", posterImage: "https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png", releaseDate: "2001-07-20", runtime: 125, genre: "动画 / 奇幻", averageScore: 8.9 },
  { movieId: 9, title: "阿甘正传", posterImage: "https://upload.wikimedia.org/wikipedia/en/6/67/Forrest_Gump_poster.jpg", releaseDate: "1994-07-06", runtime: 142, genre: "剧情 / 爱情", averageScore: 8.8 },
  { movieId: 10, title: "盗梦空间", posterImage: "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg", releaseDate: "2010-07-16", runtime: 148, genre: "科幻 / 动作", averageScore: 8.9 },
  { movieId: 11, title: "霸王别姬", posterImage: "https://upload.wikimedia.org/wikipedia/en/3/38/FarewellMyConcubine.jpg", releaseDate: "1993-01-01", runtime: 171, genre: "剧情 / 爱情", averageScore: 9.6 },
  { movieId: 12, title: "泰坦尼克号", posterImage: "https://upload.wikimedia.org/wikipedia/en/1/18/Titanic_%281997_film%29_poster.png", releaseDate: "1997-12-19", runtime: 194, genre: "爱情 / 灾难", averageScore: 8.5 },
];

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeGenre, setActiveGenre] = useState("全部");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const data = await movieApi.getAll();
      setMovies(data.length > 0 ? data : defaultMovies);
    } catch (error) {
      console.error("Failed to load movies:", error);
      setMovies(defaultMovies);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      loadMovies();
      return;
    }
    try {
      setLoading(true);
      const data = await movieApi.search(searchKeyword);
      setMovies(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreClick = (genre: string) => {
    setActiveGenre(genre);
    if (genre === "全部") {
      loadMovies();
    } else {
      // Filter movies by genre
      const filtered = defaultMovies.filter(m => m.genre.includes(genre));
      setMovies(filtered);
    }
  };

  const openLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span className="section-label" style={{ marginBottom: "16px", display: "inline-block" }}>电影库</span>
            <h1 className="page-title">发现精选好电影</h1>
            <p className="page-subtitle">探索无限可能，找到你的下一部心头好</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-content">
            <form onSubmit={handleSearch} className="search-box" style={{ flex: 1, maxWidth: "400px" }}>
              <div className="search-input-wrapper">
                <span className="search-icon">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="搜索电影名称..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </form>

            <div className="filter-tabs">
              {genres.map((genre) => (
                <button
                  key={genre}
                  className={`filter-tab ${activeGenre === genre ? "active" : ""}`}
                  onClick={() => handleGenreClick(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <section className="section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : movies.length > 0 ? (
            <div className="movie-grid">
              {movies.map((movie) => (
                <Link href={`/movies/${movie.movieId}`} key={movie.movieId} className="movie-card">
                  <div className="movie-poster">
                    <img src={movie.posterImage} alt={movie.title} />
                    <div className="movie-overlay">
                      <div className="movie-quick-info">
                        <span>{movie.runtime} 分钟</span>
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="movie-genre">{movie.genre}</span>
                      <span className="movie-score">
                        <StarIcon />
                        {movie.averageScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FilmIcon />
              </div>
              <h3>暂无电影</h3>
              <p>暂无符合条件的电影，试试其他搜索条件</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onSwitchMode={() => setAuthMode(authMode === "login" ? "register" : "login")}
      />
    </div>
  );
}
