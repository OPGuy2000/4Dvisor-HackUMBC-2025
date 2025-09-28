import React from 'react';
import Header from '../components/Header';
import '../css/Info.css';
import teja from '../assets/teja.png';
import RadialCircle from '../components/RadialCircle';
import { useState } from 'react';
import temp from "../assets/food_background.jpg"
import Carousel from "../components/Carousel";
import type { TermObject } from "../components/Carousel";



const Info: React.FC = () => {

    const coursePlan: TermObject[] = [
  { "Fall 2025": [
      ["CLAS170", "desc", 3, true],
      ["ENES100", "desc", 3, false],
      ["CHEM135", "desc", 3, true]
    ]
  },
  { "Spring 2026": [
      ["MATH141", "desc", 4, true],
      ["PHYS161", "desc", 3, true],
      ["PHYS167", "desc", 1, true]
    ]
  }
];



    const [creditCompleted, setCreditCompleted] = useState(85);
    const [degreeReqsCompleted, setDegreeReqsCompleted] = useState(45);

    const numberToColor = (num: number): string => {
        switch (true) {
            case (num >= 90):
                return "#00FF00"; // Green
            case (num >= 70):
                return "#7FFF00"; // Chartreuse
            case (num >= 50):
                return "#FFFF00"; // Yellow
            case (num >= 30):
                return "#FF7F00"; // Orange
            case (num >= 20):
                return "#FF0000"; // Red
            default:
                return "#8B0000"; // Dark Red

        }

    };


    return (
        <div className="Info" style={{ width: "100vw" }}>
            <Header />
            <div style={{ display: "flex" }}>
                <div className='splitscreen-half' style={{ flex: 1 }}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title" >Teja Krishna Anumalasetty</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">ID: XX00000</h6>
                            <img className="rounded-image" src={teja} style={{ width: "10em", height: "10em" }}></img>
                            <p className="card-text">
                                <b>Major:</b> Computer Science<br></br>
                                <b>Enrollment Date:</b> August 27 2025<br></br>
                                <b>Expected Graduation:</b> May 2029
                            </p>
                            <RadialCircle progress={creditCompleted} size={120} strokeWidth={12} fillColor={numberToColor(creditCompleted)}>
                                <span style={{ fontSize: "24px", fontWeight: "bold", }}>{creditCompleted}%</span><br></br>
                                <span style={{ fontSize: "10px", fontWeight: "bold" }}>Credits 102/120</span>
                            </RadialCircle>
                            <RadialCircle progress={degreeReqsCompleted} size={120} strokeWidth={12} fillColor={numberToColor(degreeReqsCompleted)}>
                                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{degreeReqsCompleted}%</span> <br></br>
                                <span style={{ fontSize: "10px", fontWeight: "bold" }}>Degree Reqs 36/80</span>
                            </RadialCircle>
                        </div>
                    </div>
                </div>
                <div className='splitscreen-half' id="information-container" style={{ flex: 3 }}>
                    <div className='information-child' id="four-year-plan">
                        <Carousel coursePlan={coursePlan} />
                    </div>
                </div>
            </div>

        </div>


    );
};

export default Info;