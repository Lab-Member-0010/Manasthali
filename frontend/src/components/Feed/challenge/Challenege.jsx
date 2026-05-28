import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from "../../../apis/Api";

const Challenge = () => {
    const [challenge, setChallenge] = useState(null);
    const [status, setStatus] = useState(null);

    const userId = useSelector((state) => state.user?.user?._id);
    const token = useSelector((state) => state.user?.token);

    const showToast = (message, type) => {
        const options = {
            position: "top-right",
        };

        if (type === 'error') {
            toast.error(message, options); 
        } else {
            toast.success(message, options);  
        }
    };

    const handleChallenge = async () => {

        try {
            const response = await axios.get(`${Api.GET_DAILY_CHALLENGE}/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.challenge) {
                setChallenge(response.data.challenge);
            } else {
                showToast("No challenge found for today", "error");
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to fetch challenge', "error");
        }
    };

    const handleComplete = () => {
        setStatus("Completed");
        showToast("Challenge marked as completed", "success");
    };

    const handleIncomplete = () => {
        setStatus("Incomplete");
        showToast("Challenge marked as incomplete", "error");
    };

    return (
        <div className="p-4 text-center">
            <h2>Daily Challenge</h2>
            {!challenge &&
                <div>
                    <button onClick={handleChallenge} className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Get Today's Challenge
                    </button>
                </div>
            }
            {challenge && (
                <div className="mt-4">
                    <h3 className="text-gray-900">Today's Challenge:</h3>
                    <p className="text-gray-900">{challenge}</p>

                    <div className="flex justify-evenly items-center">
                        <button onClick={handleComplete} className="bg-green-600 text-white border-none px-4 py-2 rounded">
                            Complete
                        </button>
                        <button onClick={handleIncomplete} className="bg-red-600 text-white border-none px-4 py-2 rounded">
                            Incomplete
                        </button>
                    </div>

                    {status && (
                        <div className="text-gray-900 mt-5">
                            <p><b>Challenge status:</b> {status}</p>
                        </div>
                    )}
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Challenge;