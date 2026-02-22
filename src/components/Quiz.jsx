import React, { useEffect, useReducer } from 'react'
import axios from 'axios'

const initialState = {
    questions: [],
    status: "loading", //loading, error, ready, active, finished,
    index: 0,
    answer: null,
    points: 0,
}

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return {
                ...state,
                questions: action.payload.map(q => {
                    const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
                    return { ...q, options };
                }),
                status: "ready"
            }
        case 'dataFailed':
            return { ...state, status: "error" }
        case 'start':
            return { ...state, status: "active" }
        case 'newAnswer':
            const question = state.questions[state.index];
            const isCorrect = action.payload === question.correct_answer;
            return {
                ...state,
                answer: action.payload,
                points: isCorrect ? state.points + 10 : state.points
            }
        case 'nextQuestion':
            if (state.index + 1 < state.questions.length) {
                return { ...state, index: state.index + 1, answer: null }
            } else {
                return { ...state, status: "finished" }
            }
        case 'restart':
            return { ...initialState, questions: state.questions, status: "ready" }
        default:
            throw new Error("action unknown")
    }
}

export default function Quiz() {
    const [{ questions, status, index, answer, points }, dispatch] = useReducer(reducer, initialState)
    const qcount = questions.length;
    const hasAnswered = answer !== null;

    useEffect(function () {
        axios.get('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
            .then(res => {
                dispatch({ type: "dataReceived", payload: res.data.results })
            })
            .catch(error => {
                dispatch({ type: "dataFailed" })
            })
    }, [])

    if (status === "loading") return (
        <div className="flex items-center justify-center h-64 bg-slate-50 rounded-xl shadow-inner text-slate-500 font-medium">
            <svg className="animate-spin h-6 w-6 mr-3 text-indigo-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading questions...
        </div>
    )

    if (status === "error") return (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200">
            <h3 className="text-lg font-bold">Error</h3>
            <p>Something went wrong while fetching the quiz. Please try again later.</p>
        </div>
    )

    return (
        <div className=" mb-8 p-6 bg-white rounded-xl shadow-lg transition-all duration-300">
            {status === "ready" && (
                <div className="text-center py-10">
                    <h2 className="text-4xl font-extrabold text-indigo-900 mb-4">Welcome to the Quiz!</h2>
                    <p className="text-lg text-slate-600 mb-8">{qcount} challenging questions are waiting for you.</p>
                    <button
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                        onClick={() => dispatch({ type: 'start' })}
                    >
                        Let's start
                    </button>
                </div>
            )}

            {status === "active" && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl">
                        <span className="text-indigo-700 font-semibold">Question {index + 1} / {qcount}</span>
                        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">Points: {points}</span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-indigo-600 h-full transition-all duration-500"
                            style={{ width: `${((index + 1) / qcount) * 100}%` }}
                        ></div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 leading-tight" dangerouslySetInnerHTML={{ __html: questions[index].question }}></h3>

                    <div className="grid grid-cols-4 gap-3">
                        {questions[index].options.map((option, idx) => {
                            const isCorrect = option === questions[index].correct_answer;
                            const isSelected = option === answer;

                            let btnStyle = "bg-slate-100 hover:bg-indigo-50 border-2 border-slate-200 text-slate-700";
                            if (hasAnswered) {
                                if (isCorrect) btnStyle = "bg-green-100 border-green-500 text-green-700 font-bold";
                                else if (isSelected) btnStyle = "bg-red-100 border-red-500 text-red-700";
                                else btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                            }

                            return (
                                <button
                                    key={idx}
                                    className={`p-4 rounded-xl text-left text-lg transition-all duration-200 flex items-center justify-between ${btnStyle} ${!hasAnswered ? 'hover:-translate-y-1' : 'cursor-default'}`}
                                    onClick={() => !hasAnswered && dispatch({ type: 'newAnswer', payload: option })}
                                    disabled={hasAnswered}
                                    dangerouslySetInnerHTML={{ __html: option }}
                                >
                                </button>
                            );
                        })}
                    </div>

                    {hasAnswered && (
                        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <button
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md"
                                onClick={() => dispatch({ type: 'nextQuestion' })}
                            >
                                {index + 1 === qcount ? 'Show Results' : 'Next Question'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {status === "finished" && (
                <div className="text-center py-10 space-y-4">
                    <h2 className="text-4xl font-extrabold text-indigo-900">Quiz Completed!</h2>
                    <div className="text-6xl font-black text-indigo-600 py-6">
                        {points} <span className="text-2xl text-slate-400">/ {qcount * 10}</span>
                    </div>
                    <p className="text-xl text-slate-600 italic mb-8">
                        {points >= (qcount * 10 * 0.8) ? "Mastermind! 🏆" : points >= (qcount * 10 * 0.5) ? "Good Job! 👍" : "Better luck next time! 📚"}
                    </p>
                    <button
                        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                        onClick={() => dispatch({ type: 'restart' })}
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    )
}
