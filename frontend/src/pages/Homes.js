import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>PDF Manager</h1>
        <p>Gérez vos documents PDF facilement en ligne</p>

        <div className="home-buttons">
          {!token ? (
            <>
              <Link to="/register" className="btn primary">
                S'inscrire
              </Link>
              <Link to="/login" className="btn secondary">
                Se connecter
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn primary">
              Accéder au Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
