import React from 'react';
import { PlusCircle, Trash2 } from "lucide-react";
import moment from "moment";

const GoalList = ({ goals, onAddGoal, onDelete }) => {
    return(
        <div className="card">
            <div className="flex items-center justify-between">
                <div><h5 className="text-lg">Objektivat e kursimit</h5>
                    <p className="text-xs text-gray-400 mt-0 5">
                        Monitoro kursimet e tua me kalimin e kohës dhe zbulo si po rritet fondi yt.
                    </p></div>
                <div className="flex items-center justify-end gap-2">
                    <button className="add-btn" onClick={onAddGoal}>
                        <PlusCircle size={15} className="text-base" />
                        Shto Objektiv
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
                {/* display the goals */}
                {goals?.length === 0 ? (
                    <p className="text-gray-500 col-span-2 text-center">Nuk ka objektiva të shtuara ende.</p>
                ) : (
                    goals.map((goal) => {
                        const progressValue = (goal.savedAmount / goal.targetAmount) * 100;
                        const isAchieved = progressValue >= 100;

                        return (
                            <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Stili i ikonës tani është si te shpenzimet, pa ngjyrë të fortë */}
                                        <div className={`w-14 h-14 flex items-center justify-center text-[26px] rounded-full drop-shadow-xl ${goal.icon ? 'bg-gray-200' : 'bg-gray-200'}`}>
                                            {/* Përdorim img për të shfaqur ikonën e zgjedhur nga përdoruesi */}
                                            {goal.icon ? (
                                                <img src={goal.icon} alt="Goal Icon" className="w-12 h-12" />
                                            ) : (
                                                null
                                            )}
                                        </div>
                                        <div>
                                            <h6 className="text-sm text-gray-500 mb-1">Objektivi</h6>
                                            <span className="text-xl font-semibold">{goal.goalName}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => onDelete(goal.id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-600 font-medium">
                                        Kursyer: {goal.savedAmount.toLocaleString('sq-AL', { style: 'currency', currency: 'EUR' })}
                                    </p>
                                    <p className="text-gray-600 font-medium">
                                        Objektivi: {goal.targetAmount.toLocaleString('sq-AL', { style: 'currency', currency: 'EUR' })}
                                    </p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                                        <div
                                            className={`h-2.5 rounded-full ${isAchieved ? 'bg-green-600' : 'bg-blue-600'}`}
                                            style={{ width: `${Math.min(100, progressValue)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {progressValue.toFixed(1)}% e arritur · Përfundon: {moment(goal.endDate).format('Do MMM YYYY')}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default GoalList;