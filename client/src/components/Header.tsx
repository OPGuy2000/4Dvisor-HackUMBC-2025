import '../css/Header.css';
import advisorLogo from '../assets/4dvisor.svg';

const Header: React.FC = () => {
  return (
    <header className="Header">
      <nav className="navbar">
        <div className="container d-flex align-items-center">
          <button
            type="button"
            id="navbar-toggler"
            onClick={() => (window.location.href = "/")}
            style={{ background: "transparent", border: "none" }}
          >
            <img
              src={advisorLogo}
              alt="4dvisor Logo"
              id="fast"
              style={{ height: "2em" }}
            />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
