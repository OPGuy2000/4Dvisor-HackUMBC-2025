import "../css/App.css";
import Header from "../components/Header.tsx";

const Home: React.FC = () => {


  return (
    <div className="Home">
      <Header />
      <div id="cover-container">
        <div id="discoverText" className="cover-item">
          DISCOVER <br /> WHAT YOU <br />
          <div id="crave">CRAVE</div>
        </div>
        <div className="cover-item" id="inner-cover">
          <div id="cover-paragraph">
            Our state of the art recommendation engine finds the foods around you to satisfy that craving.
            Completely tailored to your tastes and history. Start finding your next meal today!
          </div>
          <br />
          <button id="tryit-button" type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#signInPrompt">
            Try It
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              className="bi bi-caret-right-fill" viewBox="0 0 16 16">
              <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 
              1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg>
          </button>
        </div>
      </div>

      <div id="signInPrompt" className="modal fade" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sign In</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Signing in with a Google account helps us keep track of your tastes and reccommend more options depending on your history. FastEats does work without signing in, but choices will only be saved locally.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const modal = document.getElementById("signInPrompt");
                  if (modal) {
                    (window as any).bootstrap?.Modal.getOrCreateInstance(modal).hide();
                  }
                  window.location.href = "/foodform";
                }}
              >
                Use as Guest
              </button>
              <button type="button" className="btn btn-primary">Sign in with Google</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
