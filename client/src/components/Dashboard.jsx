import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

import NavBar from './NavBar';
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { toast } from "react-toastify";
import EditModal from "./EditModal";
import { Pie } from "react-chartjs-2";


ChartJS.register(ArcElement, Tooltip, Legend);

export default function Admin() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [piChart, setPieChart] = useState({
        labels: ['Satisfied', 'Not Satisfied'],
        datasets: [
            {
                labels: ['Satisfied', 'Not Satisfied'],
                data: [1, 2],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    })


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
                const satisfied = data.filter((item) => item.prediction == '1');
                const nSatisfied = data.filter((item) => item.prediction == '0');
                setData([satisfied.length, nSatisfied.length]);
            }).catch((error) => {
                toast.error(error)
            })
    }

    useEffect(() => {
        setPieChart({
            labels: ['Satisfied', 'Not Satisfied'],
            datasets: [
                {
                    labels: ['Satisfied', 'Not Satisfied'],
                    data: data,
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        })

    }, [data])

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <NavBar handleLogout={handleLogout} />
            <div className="max-w-screen-xl flex mx-auto flex-col mt-10">
                <div className="mt-20 flex m-2 justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Report</h2>
                </div>

                <div className="relative overflow-x-auto  sm:rounded-lg mt-10">
                    <div style={{ width: '400px' }} className="m-auto">
                        <Pie data={piChart} />
                    </div>
                </div>
            </div>
        </>
    )
}
