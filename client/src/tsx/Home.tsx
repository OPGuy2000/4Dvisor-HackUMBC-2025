import "../css/App.css";
import React, { useState, useEffect } from "react";
import Header from "../components/Header.tsx";

const Home: React.FC = () => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [invalidTextVisible, setInvalidTextVisible] = useState(false);
  const pattern = /^[A-Z]{2}\d{5}$/;

  // Local ID format validation
  const validateIdFormat = (id: string): boolean => {
    return id.length === 7 && pattern.test(id);
  };

  // API call to check if ID exists
  const checkIdExists = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`http://localhost:8000/student/${id}`);
      const result = await response.json();
      return Object.keys(result).length > 0;
    } catch (error) {
      console.error("Error checking ID:", error);
      return false;
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase(); // optional: force uppercase
    setValue(newValue);

    const valid = validateIdFormat(newValue);
    setIsValid(valid);
    setInvalidTextVisible(!valid && newValue.length === 7);
  };

  return (
    <div className="Home">
      <Header />
      <div id="cover-container">
        <div id="discoverText" className="cover-item">
          <div id="discover">DISCOVER <br /> YOUR <br /></div>
          <div id="crave">ACADEMIC FUTURE</div>
        </div>
        <div className="cover-item" id="inner-cover">
          <div id="cover-paragraph">
            Our state of the art advisor calculates the best classes for you based on your past classes and your intended major.
            You can also see internships and research opportunities, or see what you have to do to change your major in case you want to jump ship.
          </div>
          <br />
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-3" id="enter-your-campus-id">
              Enter your campus ID:
              <input
                value={value}
                onChange={handleChange}
                maxLength={7}
                type="text"
                className="form-control"
                placeholder="XX00000"
              />
              {invalidTextVisible && <div id="invalid-format-text">Invalid ID!</div>}
            </div>

            <button id="tryit-button" type="submit" className="btn btn-primary" onClick={async () => {
              const doesTheIDExist: boolean = await checkIdExists(value)

              if (isValid) {
                const studentId = document.querySelector("div input")?.value 
                if(doesTheIDExist || value === "XX00000")
                  window.location.href = "/profile?Id=" + studentId;
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
