import React from "react"
import './Forms.css'
import axios from 'axios'
import ResultPage from "./ResultPage";

import { Link, NavLink } from "react-router-dom";
export default function Form(){

    const [formData, setFormData] = React.useState(
    {id:"",image:"",friendId:"",password:""}
    )
    const [error, setError] = React.useState(null);
    const [comparisonResult, setComparisonResult] = React.useState(null);
    const [showComponent2, setShowComponent2] = React.useState(false);    
    
    const handleButtonClick = (e) => {
        //e.preventDefault();
        setShowComponent2(true);
      };

    function handleChange(event)
    {   console.log(event.target.value)
      setFormData(prevFormData=>{
        return{
            ...prevFormData,
            [event.target.name]: event.target.type === "file" ? event.target.files[0] : event.target.value

        }
      })

    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
           
            const response = await axios.post(
                'http://localhost:3001/api/addUser',
                formData,
                {
                    headers: {
                        "Content-type": "multipart/form-data",
                    }
                }
            );

            console.log('Response from backend:', response.data);
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    }
    async function handleCompareNgrams(event) {
        event.preventDefault();

        try {
            const response = await axios.get('http://localhost:3001/api/compareNgrams');

            setComparisonResult(response.data);
            setError(null);
            setShowComponent2(true);
            console.log('N-Gram Comparison Result:', response.data);
        } catch (error) {
            console.error('Error comparing n-grams:', error);
            setError('Insufficient user fields');
            setComparisonResult(null);
            setShowComponent2(true);
        }
       
       // handleButtonClick()
    }
   
    return(
       
       <div className="form-box">
        <h1>BAAVLIBUCH</h1>
        <form >
            <div className="field1">
            <input
            type="text"
            placeholder="ID"
            onChange={handleChange}
            name="id"
            value={formData.id}
            ></input>
            <input
            type="text"
            placeholder="Password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            ></input>
            <input
            type="text"
            placeholder="FriendID"
            onChange={handleChange}
            name="friendId"
            value={formData.friendId}
            ></input>
            <input
            type="file"
            onChange={handleChange}
            name="image"
            >
               
            </input>
            {/* <img src={formData.image}></img> */}
            <br/>
            <br/>
            </div>
            <button onClick = {handleSubmit}className="submitBtn">Submit</button>
            <button onClick={handleCompareNgrams} className="compareBtn">Compare N-Grams</button>
            {showComponent2 && <ResultPage comparisonResult={comparisonResult} error={error}/>}

                
               

                    <NavLink to="/user-list">
            <button className="userListBtn">Show All Users</button>
          </NavLink>

             
        </form>
        </div>
        
    )

}