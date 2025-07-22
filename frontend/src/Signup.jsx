import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Signup() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrl = "https://mytodos-rvpc.onrender.com";
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const changeData = (e) =>{
     const {name, value} = e.target;
     setData((prevData)=> ({
        ...prevData,
        [name] : value
     }))
  }

  const submitData = async (e) =>{
     e.preventDefault();
      await axios.post(`${apiUrl}/api/user-routes/register`, data)
      .then((user)=>{
        navigate("/login");
        console.log(user.data)
      })
      .catch((e)=> {console.log("error found", e)})

    //  console.log("submit data is : ", response.data);
     setData({
        name : "",
        email : "",
        password: ""
     })
  }

  return (
    <div className="box">
      <form onSubmit={submitData} className="formData">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="your name.."
          value={data.name}
          onChange={changeData}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="your email.."
          value={data.email}
          onChange={changeData}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="your password.."
          value={data.password}
          onChange={changeData}
        />

        <button type="submit">Signup</button>
      </form>
      <p>
        <span><Link to= '/login'>Login</Link></span> if already have an acc!
      </p>
    </div>
  );
}
