import "../css/App.css";
import React, { useState } from "react";
import Header from "../components/Header.tsx";

const Home: React.FC = () => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const invalidTextE = document.getElementById("invalid-format-text");
  const pattern = /^[A-Z]{2}\d{5}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (!isvalidID(newValue) && newValue.length === 7) {
      invalidTextE!.style.display = "block";
      setIsValid(false);
    } else {
      if (newValue.length === 7) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
      invalidTextE!.style.display = "none";
    }



    function isvalidID(id: string): boolean {
      return pattern.test(id);
    }
  };

  return (
    <div className="Home">
      <Header />
      <div id="cover-container">
        <div id="discoverText" className="cover-item">
          <div id="discover">DISCOVER <br /> YOUR <br /> </div>
          <div id="crave">ACADEMIC FUTURE</div>
        </div>
        <div className="cover-item" id="inner-cover">
          <div id="cover-paragraph">
            Our state of the art advisor calculates the best classes for you based on your past classes and your intended major.
            You can also see internships and research oppertunities, or see what you have to do to change your major in case you want to jump ship.
          </div>
          <br />
          <form>
            <div className="mb-3" id="enter-your-campus-id">
              Enter your campus ID:<input onChange={handleChange} maxLength={7} type="text" className="form-control" aria-describedby="emailHelp" placeholder="XX00000"></input>
              <div style={{ display: "none" }} id="invalid-format-text">Invalid ID!</div>
            </div>

            <button id="tryit-button" type="button" className="btn btn-primary" onClick={() => {

              /*                ===========================
                                ===========================
                                BACKEND CALL #1 OCCURS HERE
                                ===========================
                                ===========================
                                
              */
              const doesTheIDExist: boolean = true;

              if (isValid) {
                if(doesTheIDExist)
                  window.location.href = "/foodform";
                else 
                  alert("There are no students with that ID! Please try again.");
              } else {
                alert("That is not a valid ID format! Please try again.");
              }

            }}>
              Try It
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 
              1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
              </svg>
            </button>
          </form>

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

                  /*                ===========================
                                    ===========================
                                    BACKEND CALL #1 OCCURS HERE
                                    ===========================
                                    ===========================
                                    
                  */
                  const doesTheIDExist: boolean = false;

                  if (isValid && doesTheIDExist) {
                    window.location.href = "/foodform";
                  } else {
                    alert("There are no students with that ID! Please try again.");
                  }

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
