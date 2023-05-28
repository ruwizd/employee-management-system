import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

import NavBar from './NavBar';
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { toast } from "react-toastify";
import EditModal from "./EditModal";
export default function Admin() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                // ...
                // console.log("uid", uid)
            } else {
                // User is signed out
                // ...
                navigate("/");
            }
        });

    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");

            toast.success('Signed out successfully')
        }).catch((error) => {
            // An error happened.
        });
    }

    const fetchData = async () => {
        await getDocs(collection(db, "employee"))
            .then((querySnapshot) => {
                const data = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }))
                console.log(data);
                setData(data);
            }).catch((error) => {
                toast.error(error)
            })
    }

    useEffect(() => {
        fetchData();
    }, [])


    return (
        <>
            <NavBar handleLogout={handleLogout} />
            <div className="max-w-screen-xl flex mx-auto flex-col mt-10">
                <div className="mt-20 flex m-2 justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee List</h2>
                    <Modal fetchData={fetchData} />
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Salary
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Gender
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Position
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Department
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Last Prediction Data
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Prediction
                                </th>
                                <th scope="col" className="px-6 py-3">
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row) => (
                                <tr className={"bg-white border-b dark:bg-gray-900 dark:border-gray-700" + (row.prediction === 0 ? " bg-red-700  dark:bg-red-800" : "")}>
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {row.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {row.Salary}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.Gender}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.Position}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.Department}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row?.last_prediction}
                                    </td>
                                    <td className="px-6 py-4">
                                        {row.prediction === 1 ? 'Satisfied' : 'Not Satisfied'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <EditModal fetchData={fetchData} row={row} />
                                    </td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
