import React from 'react';
import Header from '../components/Header';
import '../css/Info.css';
import teja from '../assets/teja.png';
import RadialCircle from '../components/RadialCircle';
import { useState } from 'react';
import temp from "../assets/food_background.jpg"

const Info: React.FC = () => {

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

                        <div id="carouselExample" className="carousel slide information-grandchild">
                            <div className="carousel-inner" style={{ width: "80%", margin: "auto" }}>
                                <div className="carousel-item active">
                                    <h1>Fall 2025</h1>
                                    <div className="list-group">
                                        <button type="button" className="list-group-item list-group-item-action">MATH141</button>
                                        <button type="button" className="list-group-item list-group-item-action">ENES100</button>
                                        <button type="button" className="list-group-item list-group-item-action">CLAS170</button>
                                        <button type="button" className="list-group-item list-group-item-action" >CHEM135</button>
                                        <button type="button" className="list-group-item list-group-item-action" >UNIV100</button>

                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <h1>Spring 2026</h1>
                                    <div className="list-group">
                                        <button type="button" className="list-group-item list-group-item-action">MATH004</button>
                                        <button type="button" className="list-group-item list-group-item-action">MATH007</button>
                                        <button type="button" className="list-group-item list-group-item-action">STAT100</button>
                                        <button type="button" className="list-group-item list-group-item-action" >CMSC216</button>
                                        <button type="button" className="list-group-item list-group-item-action" >CMNS100</button>
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>

       
    );
};

export default Info;