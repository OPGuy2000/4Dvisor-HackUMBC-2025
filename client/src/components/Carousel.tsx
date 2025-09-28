import React from "react";

type Course = [string, string, number, boolean];
export type TermObject = { [termName: string]: Course[] };

interface CarouselProps {
  coursePlan: TermObject[];
}

const Carousel: React.FC<CarouselProps> = ({ coursePlan }) => {
  return (
    <div id="planCarousel" className="carousel slide">
      <div className="carousel-inner" style={{ width: "80%", margin: "auto" }}>
        {coursePlan.map((termObj, termIndex) => {
          const termName = Object.keys(termObj)[0];
          const classes = termObj[termName];

          return (
            <div
              key={termIndex}
              className={`carousel-item ${termIndex === 0 ? "active" : ""}`}
            >
              <h1>{termName}</h1>
              <div className="list-group">
                {classes.map((cls, clsIndex) => (
                  <button
                    key={clsIndex}
                    type="button"
                    className="list-group-item list-group-item-action"
                    data-classname={cls[0]}
                    data-desc={cls[1]}
                    data-credits={cls[2]}
                    data-ismajor={cls[3]}
                    onClick={(e) => {
                      const target = e.currentTarget;
                      const classData = {
                        name: target.dataset.classname,
                        desc: target.dataset.desc,
                        credits: Number(target.dataset.credits),
                        isMajor: target.dataset.ismajor === "true",
                      };
                      console.log("Clicked class data:", classData);
                    }}
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
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#planCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#planCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
