import React from "react"
import './Forms.css'
import axios from 'axios'
export default function Form(){

    const [formData, setFormData] = React.useState(
    {id:"",image:"",friendId:"",password:""}
    )

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
    
    return(
       
       <div className="form-box">
        <h1>BAAVLIBUCH</h1>
        <form onSubmit={handleSubmit}>
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
        </form>
        </div>
    )

}