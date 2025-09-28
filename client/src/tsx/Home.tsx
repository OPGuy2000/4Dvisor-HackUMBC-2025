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
              const doesTheIDExist: boolean = false;

              if (isValid) {
                if(doesTheIDExist || value === "XX00000")
                  window.location.href = "/profile";
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

      

    </div>
  );
};

export default Home;
