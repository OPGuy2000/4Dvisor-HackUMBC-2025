import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import '../css/Info.css';
import teja from '../assets/teja.png';
import RadialCircle from '../components/RadialCircle';
import Carousel from "../components/Carousel";
import type { TermObject, Course } from "../components/Carousel";

type Student = {
    name: string;
    degreeId: string;
    coreCreditsRequired: number;
    electiveCreditsRequired: number;
    expectedGraduation: string;
    enrollmentDate: string;
    learningStyle: string;
    creditCompleted: number;
    requirementsCompleted: number;
    totalRequirements: number;
    percentRequirementsCompleted: number;
}

function transformSemesters(data) {
  const startYear = 2025; // starting academic year
  return data.semesters.map((sem, idx: number) => {
    // alternate between Fall / Spring
    const term = idx % 2 === 0 ? "Fall" : "Spring";
    const year = startYear + Math.floor(idx / 2);
    const semesterName = `${term} ${year}`;

    // restructure courses
    const courses = sem.courses.map(c => [
      c.courseId,
      c.courseName,
      c.credits,
      c.requirementGroupId?.startsWith("REQ-CORE") || false
    ]);

    return { [semesterName]: courses };
  });
}

const Info: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [coursePlan, setCoursePlan] = useState<TermObject[]>([]);
    const [student, setStudent] = useState<Student>({
        name: "string",
        degreeId: "safd",
        coreCreditsRequired: 21,
        electiveCreditsRequired: 23,
        expectedGraduation: "string",
        enrollmentDate: "string",
        learningStyle: "string",
        creditCompleted: 32,
        requirementsCompleted: 32,
        totalRequirements: 23,
        percentRequirementsCompleted: 0.7
    });

    // STATE TO STORE SELECTED COURSE FOR MODAL
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        //  console.log("hel")
        const fetchData = async () => {
          try {
           
            const id = searchParams.get("Id");
            const response = await fetch(`http://localhost:8000/student/${id}`);
            const response2 = await fetch(`http://localhost:8000/plan/${id}`);
        
            setCoursePlan(transformSemesters(await response2.json()))

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const student = await response.json();
            setStudent(student);
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
                <div id="student-card" className="splitscreen-half" style={{ flex: 1 }}>
                    <div className="card">
                        <div className="card-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                            <h5 id="personName" className="card-title">Teja Krishna Anumalasetty</h5>
                            <h6 id="studentID" className="card-subtitle mb-2 text-body-secondary">ID: XX00000</h6>
                            <img
                                className="rounded-image"
                                src={teja}
                                style={{ width: "10em", height: "10em" }}
                            />
                            <p className="card-text">
                                <b>Major:</b> {student.degreeId}<br />
                                <b>Enrollment Date:</b> {student.enrollmentDate}<br />
                                <b>Expected Graduation:</b> {student.expectedGraduation}
                            </p>

                            {/* Wrap radial circles in a flex container */}
                            <div className="radial-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2em", marginTop: "1em" }}>
                                <RadialCircle
                                    progress={student.creditCompleted}
                                    size={120}
                                    strokeWidth={12}
                                    fillColor={numberToColor(student.creditCompleted)}
                                >
                                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>{student.creditCompleted}%</span><br />
                                    <span style={{ fontSize: "10px", fontWeight: "bold" }}>Credits 102/120</span>
                                </RadialCircle>

                                <RadialCircle
                                    progress={student.percentRequirementsCompleted}
                                    size={120}
                                    strokeWidth={12}
                                    fillColor={numberToColor(student.percentRequirementsCompleted)}
                                >
                                    <span style={{ fontSize: "24px", fontWeight: "bold" }}>{student.percentRequirementsCompleted}%</span><br />
                                    <span style={{ fontSize: "10px", fontWeight: "bold" }}>Degree Reqs 36/80</span>
                                </RadialCircle>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='splitscreen-half' id="information-container" style={{ flex: 3 }}>
                    <div className='information-child' id="four-year-plan">
                        <h1 id="fourplanner-header"><span style={{ color: "#fff8e0" }}>4</span>Planner</h1>
                        <Carousel coursePlan={coursePlan} onSelectCourse={setSelectedCourse} />
                    </div>
                    <div className='information-child' id="internships-research">
                        <h1>Internships</h1>
                        <div className="card interncard" style={{ width: "18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title"><a href='https://www.google.com'>Company Name Here - Position</a></h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Posted: 6/7/25</h6>
                                <p className="card-text">Locationhere City, MD <br></br>Term: Winter 2025-26</p>
                            </div>
                        </div>
                        <div className="card interncard" style={{ width: "18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title"><a href='https://www.google.com'>Company Name Here - Position</a></h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Posted: 6/7/25</h6>
                                <p className="card-text">Locationhere City, MD <br></br>Term: Summer 2026</p>
                            </div>
                        </div>
                        <div className="card interncard" style={{ width: "18rem" }}>
                            <div className="card-body">
                                <h5 className="card-title"><a href='https://www.google.com'>Company Name Here - Position</a></h5>
                                <h6 className="card-subtitle mb-2 text-body-secondary">Posted: 6/7/25</h6>
                                <p className="card-text">Locationhere City, MD <br></br>Term: FY 2026</p>
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
