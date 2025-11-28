import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'

const initialState = {
    questions: [],
    status: "loading", //loading, error, ready, active, finished,
    index: 0,
}

function reducer(state, action) {
    switch (action.type) {
        case 'dataReceived':
            return { ...state, questions: action.payload, status: "ready" }
            break;
        case 'dataFailed':
            return { ...state, status: "error" }
            break;
        case 'start':
        	return {...state, status: "active"}
        	break;
        default:
            throw new Error("action unknown")
    }
}
export default function Quiz() {
    // const [quiz, setQuiz] = useState([])

    const [{ questions, status, index }, dispatch] = useReducer(reducer, initialState)
    const qcount = questions.length;

    useEffect(function() {
        axios.get('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
            .then(res => {
                // console.log(res.data)
                // setQuiz(res.data.results || []);
                dispatch({ type: "dataReceived", payload: res.data.results })
            })
            .catch(error => {
                // console.error('Error fetching quiz:', error);
                dispatch({ type: "dataFailed" })
            })
    }, [])

    return (

        <div className="bg-yellow-100">
    		{status == "loading" && <div className="bg-gray-500 p-2"><svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><rect width="24" height="24" fill="white"/><circle cx="12" cy="12" r="9" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12V6" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"/></svg> Loading</div>}
    		{status == "error" && <div className="text-rose-600 p-2">Error</div>}
    		{status == "ready" && <div className="p-4" >
    			<div className="text-2xl text-orange-600">Quiz</div>
    			<p>{qcount} questions</p>
    			<button className="button" onClick={dispatch({type: 'start'})}>Lets start</button>
    		</div>}
	        
    		{status == "active" && <div className="p-4">
    			<h3 className="text-xl">{questions[index].question}</h3>
    			<div className="grid grid-cols-2 gap-2">
    				{questions[index].incorrect_answers.map((item, ind) => (
    					<button className="button bg-yellow-400" key={ind}>{item}</button>
    				))}
    				<button className="button bg-yellow-400">{questions[index].correct_answer}</button>
    			</div>
    		</div>}
	        
    	</div>

    )
}