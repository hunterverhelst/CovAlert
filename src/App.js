import React, { useState } from "react";

import PersonToAlert from "./PersonToAlert"

import { BallTriangle } from  'react-loader-spinner'

import 'react-phone-number-input/style.css'

function App() {

  const [phoneNums, setPhoneNums] = useState([null])
  const [dateTimes, setDateTimes] = useState([null])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)
  
  const addNewPerson = e => {
    setPhoneNums(phoneNums.concat(null))
    setDateTimes(dateTimes.concat(null))
  }

  const removePerson = (targetIndex) => {
    if (phoneNums.length === 1) {
      return
    }
    
    let newPhoneNums = []
    let newDateTimes = []

    phoneNums.forEach((phoneNum, index) => {
      if (index != targetIndex) {
        newPhoneNums.push(phoneNum)
      }
    })
    dateTimes.forEach((dateTime, index) => {
      if (index != targetIndex)
        newDateTimes.push(dateTime)
    })

    setPhoneNums(newPhoneNums)
    setDateTimes(newDateTimes)
  }
  
  const handlePhoneNumChange = (newNum, targetIndex) => {
    setError(false)
    
    const newPhoneNums = phoneNums.map((phoneNum, index) => {
      if (index === targetIndex) {
        if (newNum == null)
          return null
        else
          return newNum
      }
      else
      return phoneNum
    })
    
    setPhoneNums(newPhoneNums)
  }
  
  const handleDateTimeChange = (newDate, targetIndex) => {
    
    const newDateTimes = dateTimes.map((dateTime, index) => {
      if (index === targetIndex)
      return newDate
      else
      return dateTime
    })
    
    setDateTimes(newDateTimes)
  }
  
  const handleSubmission = (e) => {
    e.preventDefault();
    
    for(const ind in phoneNums) {
      if(phoneNums[ind] == null || phoneNums[ind].length > 12) {
        setError(true)
        return
      }
    }
    
    setLoading(true)
    fetch('https://0bcb-128-61-112-232.ngrok.io/bot', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNums,
        dateTimes
      })
    })
    .then(response => {
      if(response.status === 200) {
        setConfirm(true)
      }
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      setLoading(false)
      setTimeout(() => setConfirm(false), 3000)
    })
  }
  
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-indigo-500 via-blue-400 to-purple-500">
      
      <img className="mt-5 p-4 w-3/12" src="/covalert-new-logo-purp.png" />

      <div className="flex flex-col items-center bg-white px-8 pt-8 mb-10 rounded shadow-2xl xl:w-5/12 lg:w-6/12 md:w-7/12 w-10/12 h-fit">

            <div className="flex flex-col items-center space-y-4 mb-5">


              <h2 className="mt-5 font-bold text-2xl text-center text-purple-600">Alert someone anonymously of COVID-19 exposure!</h2>

              <span className="w-10/12 text-center text-lg mb-5 border-b-2 border-b-purple-600 pb-4">
                Enter the phone numbers of those that you have been in close contact with in the past 5 days. Close contact is defined as being within 6 feet away from an infected person for a cumulative total of 15 minutes or more over a 24-hour period.
              </span>
    
              <div className="flex space-x-4 items-center px-3 py-1 rounded-lg ">
                <h1 className="">
                  Add Recipient
                </h1>
                <button className="bg-purple-400 p-2 rounded-lg hover:bg-purple-500" onClick={addNewPerson}>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between mb-3 items-center">
                  {error?
                    <span className="text-red-600 text-md">* Invalid phone field</span>
                    :
                    <div />
                  }
                  <span className="mr-10">Date of last contact:</span>
                </div>
                
                <div className="flex flex-col space-y-6">
                  {phoneNums.map((phoneNum, index) => (
                    <PersonToAlert key={index} index={index} phoneNum={phoneNum} dateTime={dateTimes[index]} phoneNumChange={handlePhoneNumChange} dateTimeChange={handleDateTimeChange} removeSelf={removePerson} />
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-3">
                {loading?
                  <BallTriangle color="#00BFFF" height={68} width={68} />
                  :
                  <button onClick={handleSubmission} className="bg-purple-500 w-32 rounded-lg mt-4 px-4 py-3 hover:bg-purple-400 text-lg font-bold text-black">Alert</button>
                }
                {confirm?
                  <div className="text-sm text-green-500 font-semibold">
                    Alert Successfully Sent!
                  </div>
                  :
                  <div className="h-5"></div>
                }
              </div>
              
            </div>
        </div>
    </div>
    </>
  );
}

export default App;
