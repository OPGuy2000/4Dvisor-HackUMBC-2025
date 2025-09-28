import React from "react";

export type Course = [string, string, number, boolean];
export type TermObject = { [termName: string]: Course[] };

interface CarouselProps {
  coursePlan: TermObject[];
  onSelectCourse?: (course: Course) => void; // callback to parent
}

const Carousel: React.FC<CarouselProps> = ({ coursePlan, onSelectCourse }) => {
  return (
    <div id="planCarousel" className="carousel slide">
      <div className="carousel-inner" style={{ width: "80%", margin: "auto" }}>
        {coursePlan.map((termObj, termIndex) => {
          const termName = Object.keys(termObj)[0];
          const classes = termObj[termName];

          return (
            <div key={termIndex} className={`carousel-item ${termIndex === 0 ? "active" : ""}`}>
              <h2 className="termName">{termName}</h2>
              <div className="list-group">
                {classes.map((cls, clsIndex) => (
                  <button
                    key={clsIndex}
                    type="button"
                    className="list-group-item list-group-item-action class-button"
                    style={{ margin: "1px" }}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => onSelectCourse?.(cls)}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 12px rgba(0, 4, 219, 0.77)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
                  >
                    {cls[0]}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bootstrap controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#planCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#planCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
