import React, { useRef } from 'react'
import { collection, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import axios from 'axios';
import moment from "moment";
import { toast } from 'react-toastify';

export default function Modal({ fetchData }) {
    const [showModal, setShowModal] = React.useState(false);
    const [form, setForm] = React.useState({});

    const addForm = async (e) => {
        e.preventDefault()
        try {

            axios.post(process.env.REACT_APP_BACKEND_URL + '/predict',
                {
                    "Salary": form.Salary,
                    "PerformanceScore": form.PerformanceScore,
                    "EngagementSurvey": form.EngagementSurvey,
                    "SpecialProjectsCount": form.SpecialProjectsCount,
                    "DaysLateLast30": form.DaysLateLast30,
                    "Absences": form.Absences,
                    "Position": form.Position,
                    "DateOfBirth": form.DateOfBirth,
                    "DateOfHire": form.DateOfHire,
                    "Gender": form.Gender,
                    "MaritalStatus": form.MaritalStatus,
                    "ManagerName": form.ManagerName,
                    "Department": form.Department,
                    "RecruitmentSource": form.RecruitmentSource
                }).then(async (response) => {
                    console.log(response.data.data);
                    setForm({ ...form, prediction: response.data.data })
                    uploadForm(response.data.data)
                    // setForm({});
                    // setShowModal(false)

                })
        } catch (error) {
            console.log(error);

        }
        // await uploadForm()

    }

    const uploadForm = async (prediction) => {
        // console.log(prediction);
        // return;
        setForm({ ...form, prediction: prediction })
        try {
            const docRef = await addDoc(collection(db, "employee"), {
                ...form,
                prediction,
                last_prediction: moment().format("DD-MM-YYYY")
            });
            console.log("Document written with ID: ", docRef);
            setForm({});
            fetchData()
            setShowModal(false)

            toast.success('Employee Added Successfully')
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }



    return (
        <>
            <button onClick={() => setShowModal(true)} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add Employee </button>
            {showModal ? (
                <>
                    <div
                        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"

                    >
                        <div className="relative w-auto my-6 mx-auto max-w-3xl" style={{ width: '700px' }}>
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                    <h3 className="text-3xl font-semibold">
                                        Add Employee
                                    </h3>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                                            ×
                                        </span>
                                    </button>
                                </div>
                                <form onSubmit={addForm}>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        <div className="w-full">
                                            <div className="mb-6">
                                                <label for="name" className="block mb-2 text-sm font-medium ">Name</label>
                                                <input type="text" id="name" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, name: e.target.value }) }} required value={form.name} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="DateOfBirth" className="block mb-2 text-sm font-medium ">Date Of Birth</label>
                                                <input type="date" id="DateOfBirth" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, DateOfBirth: e.target.value }) }} required value={form.DateOfBirth} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="Gender" className="block mb-2 text-sm font-medium ">Gender</label>
                                                <select id="Gender" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, Gender: e.target.value }) }}
                                                    required value={form.Gender}>
                                                    <option value="" selected hidden>Select</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Male">Male</option>
                                                </select>
                                            </div>
                                            <div className="mb-6">
                                                <label for="MaritalStatus" className="block mb-2 text-sm font-medium ">Marital Status</label>
                                                <select id="MaritalStatus" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, MaritalStatus: e.target.value }) }}
                                                    required value={form.MaritalStatus}>
                                                    <option value="" selected hidden>Select</option>
                                                    <option value="Married">Divorced</option>
                                                    <option value="Single">Married</option>
                                                    <option value="Separated">Separated</option>
                                                    <option value="Single">Single</option>
                                                    <option value="Widowed">Widowed</option>
                                                </select>
                                            </div>
                                            <div className="mb-6">
                                                <label for="Position" className="block mb-2 text-sm font-medium ">Position</label>
                                                <select id="Position" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, Position: e.target.value }) }}
                                                    required value={form.Position}>
                                                    <option value="" selected hidden>Select</option>
                                                    <option value="Architect">Architect</option>
                                                    <option value="Director">Director</option>
                                                    <option value="Engineer">Engineer</option>
                                                    <option value="Manager">Manager</option>
                                                    <option value="TechnicianI">Technician I</option>
                                                    <option value="TechnicianII">Technician II</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div className="mb-6">
                                                <label for="RecruitmentSource" className="block mb-2 text-sm font-medium ">Recruitment Source</label>
                                                <select id="RecruitmentSource" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, RecruitmentSource: e.target.value }) }}
                                                    required value={form.RecruitmentSource}>
                                                    <option value="" selected hidden>Select</option>
                                                    <option value="CareerBuilder">Career Builder</option>
                                                    <option value="DiversityJobFair">Diversity Job Fair</option>
                                                    <option value="EmployeeReferral">Employee Referral</option>
                                                    <option value="GoogleSearch">Google Search</option>
                                                    <option value="Indeed">Indeed</option>
                                                    <option value="LinkedIn">LinkedIn</option>
                                                    <option value="On-lineWebApplication">On-line Web Application</option>
                                                    <option value="Website">Website</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            <div className="mb-6">
                                                <label for="DateOfHire" className="block mb-2 text-sm font-medium ">Date Of Hire</label>
                                                <input type="date" id="DateOfHire" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, DateOfHire: e.target.value }) }} required value={form.DateOfHire} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="Salary" className="block mb-2 text-sm font-medium ">Salary</label>
                                                <input type="text" id="Salary" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, Salary: e.target.value }) }} required value={form.Salary} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="PerformanceScore" className="block mb-2 text-sm font-medium ">Performance Score</label>
                                                <input type="text" id="PerformanceScore" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, PerformanceScore: e.target.value }) }} required value={form.PerformanceScore} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="SpecialProjectsCount" className="block mb-2 text-sm font-medium ">Special Projects Count</label>
                                                <input type="text" id="SpecialProjectsCount" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, SpecialProjectsCount: e.target.value }) }} required value={form.SpecialProjectsCount} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="EngagementSurvey" className="block mb-2 text-sm font-medium ">Engagement Survey</label>
                                                <input type="text" id="EngagementSurvey" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, EngagementSurvey: e.target.value }) }} required value={form.EngagementSurvey} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="DaysLateLast30" className="block mb-2 text-sm font-medium ">Days Late Last 30</label>
                                                <input type="text" id="DaysLateLast30" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, DaysLateLast30: e.target.value }) }} required value={form.DaysLateLast30} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="Absences" className="block mb-2 text-sm font-medium ">Absences</label>
                                                <input type="text" id="Absences" className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, Absences: e.target.value }) }} required value={form.Absences} />
                                            </div>
                                            <div className="mb-6">
                                                <label for="Department" className="block mb-2 text-sm font-medium ">Department</label>
                                                <select id="Department" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, Department: e.target.value }) }}
                                                    required value={form.Department}>
                                                    <option value="" selected hidden>Select</option>
                                                    <option value="AdminOffices">Admin Offices</option>
                                                    <option value="ExecutiveOffice">Executive Offices</option>
                                                    <option value="IT/IS">IT/IS</option>
                                                    <option value="Production">Production</option>
                                                    <option value="Sales">Sales</option>
                                                    <option value="SoftwareEngineering">Software Engineering</option>
                                                </select>
                                            </div>
                                            <div className="mb-6">
                                                <label for="ManagerName" className="block mb-2 text-sm font-medium ">Manager Name</label>
                                                <select id="ManagerName" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                    onChange={(e) => { setForm({ ...form, ManagerName: e.target.value }) }}
                                                    required value={form.ManagerName}>
                                                    <option value="" selected hidden>Select</option>
                                                    <option value="AlexSweetwater">Alex Sweetwater</option>
                                                    <option value="AmyDunn">Amy Dunn </option>
                                                    <option value="BoardofDirectors">Board of Directors</option>
                                                    <option value="BrandonR.LeBlanc">Brandon R. LeBlanc</option>
                                                    <option value="BrannonMiller">Brannon Miller</option>
                                                    <option value="BrianChampaigne">Brian Champaigne</option>
                                                    <option value="DavidStanley">David Stanley </option>
                                                    <option value="DebraHoulihan">Debra Houlihan</option>
                                                    <option value="ElijiahGray">Elijiah Gray</option>
                                                    <option value="EricDougall">Eric Dougall</option>
                                                    <option value="JanetKing">Janet King</option>
                                                    <option value="JenniferZamora">Jennifer Zamora</option>
                                                    <option value="JohnSmith">John Smith</option>
                                                    <option value="KelleySpirea">Kelley Spirea</option>
                                                    <option value="KetsiaLiebig">Ketsia Liebig</option>
                                                    <option value="KissySullivan">Kissy Sullivan</option>
                                                    <option value="LynnDaneault">Lynn Daneault</option>
                                                    <option value="MichaelAlbert">Michael Albert</option>
                                                    <option value="PeterMonroe">Peter Monroe</option>
                                                    <option value="SimonRoup">Simon Roup </option>
                                                    <option value="WebsterButler">Webster Butler</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                            type="submit"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    )
}
