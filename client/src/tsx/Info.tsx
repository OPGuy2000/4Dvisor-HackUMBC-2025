import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import '../css/Info.css';
import teja from '../assets/teja.png';
import RadialCircle from '../components/RadialCircle';
import Carousel from "../components/Carousel";
import type { TermObject, Course } from "../components/Carousel";

const Info: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const coursePlan: TermObject[] = [
        {
            "Fall 2025": [
                ["CLAS170", "desc", 3, true],
                ["ENES100", "desc", 3, false],
                ["CHEM135", "desc", 3, true],
                ["CHEM145", "desc", 3, true],
                ["CHEM167", "desc", 3, true],
            ]
        },
        {
            "Spring 2026": [
                ["MATH141", "desc", 4, true],
                ["PHYS161", "desc", 3, true],
                ["PHYS167", "desc", 1, true]
            ]
        }
    ];

    const [creditCompleted, setCreditCompleted] = useState(85);
    const [degreeReqsCompleted, setDegreeReqsCompleted] = useState(45);

    // STATE TO STORE SELECTED COURSE FOR MODAL
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const id = searchParams.get("Id");
            const response = await fetch(`http://localhost:8000/api/student/${id}`); // Replace with your API endpoint
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCreditCompleted(data.creditsCompleted);
            setDegreeReqsCompleted(data.percentRequirementsCompleted);
          } catch (error) {
            console.error('Error fetching data:', error);
          } 
        };
        fetchData();
      }, []);

    const numberToColor = (num: number): string => {
        switch (true) {
            case (num >= 90): return "#00FF00";
            case (num >= 70): return "#7FFF00";
            case (num >= 50): return "#FFFF00";
            case (num >= 30): return "#FF7F00";
            case (num >= 20): return "#FF0000";
            default: return "#8B0000";
        }
    };

    return (
        <div className="Info" style={{ width: "100vw" }}>
            <Header />
            <div id='main-container' style={{ display: "flex" }}>
                <div className='splitscreen-half' style={{ flex: 1 }}>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Teja Krishna Anumalasetty</h5>
                            <h6 className="card-subtitle mb-2 text-body-secondary">ID: XX00000</h6>
                            <img className="rounded-image" src={teja} style={{ width: "10em", height: "10em" }} />
                            <p className="card-text">
                                <b>Major:</b> Computer Science<br />
                                <b>Enrollment Date:</b> August 27 2025<br />
                                <b>Expected Graduation:</b> May 2029
                            </p>
                            <RadialCircle progress={creditCompleted} size={120} strokeWidth={12} fillColor={numberToColor(creditCompleted)}>
                                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{creditCompleted}%</span><br />
                                <span style={{ fontSize: "10px", fontWeight: "bold" }}>Credits 102/120</span>
                            </RadialCircle>
                            <RadialCircle progress={degreeReqsCompleted} size={120} strokeWidth={12} fillColor={numberToColor(degreeReqsCompleted)}>
                                <span style={{ fontSize: "24px", fontWeight: "bold" }}>{degreeReqsCompleted}%</span><br />
                                <span style={{ fontSize: "10px", fontWeight: "bold" }}>Degree Reqs 36/80</span>
                            </RadialCircle>
                        </div>
                    </div>
                </div>
                <div className='splitscreen-half' id="information-container" style={{ flex: 3 }}>
                    <div className='information-child' id="four-year-plan">
                        <h1>4Planner</h1>
                        <Carousel coursePlan={coursePlan} onSelectCourse={setSelectedCourse} />
                    </div>
                    <div className='information-child' id="internships-research">
                        <h1>Internships</h1>
                        <div className="card interncard" style={{width: "18rem"}}>
                            <div className="card-body">
                                <h5 className="card-title"><a href='https://www.google.com'>Company Name Here - Position</a></h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Posted: 6/7/25</h6>
                                <p className="card-text">Locationhere City, MD</p>
                            </div>
                        </div>
                        <div className="card interncard" style={{width: "18rem"}}>
                            <div className="card-body">
                                <h5 className="card-title"><a href='https://www.google.com'>Company Name Here - Position</a></h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Posted: 6/7/25</h6>
                                <p className="card-text">Locationhere City, MD</p>
                            </div>
                        </div>
                        <div className="card interncard" style={{width: "18rem"}}>
                            <div className="card-body">
                                <h5 className="card-title"><a href='https://www.google.com'>Company Name Here - Position</a></h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Posted: 6/7/25</h6>
                                <p className="card-text">Locationhere City, MD</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">

                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">{selectedCourse?.[0]}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedCourse?.[1]}<br />
                            Credits: {selectedCourse?.[2]}<br />
                            {selectedCourse?.[3] ? "Major Requirement" : "Elective"}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Info;
