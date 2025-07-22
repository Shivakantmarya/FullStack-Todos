import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // const apiUrl = import.meta.env.VITE_API_URL;
  const apiUrl = "https://mytodos-rvpc.onrender.com";
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const changeData = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiUrl}/api/user-routes/login`, data);
      //  console.log("Api response : ", res.data);
      localStorage.setItem("token", res.data.token);

      if (res.data.message === "Login Successfull!") {
        navigate("/home", { state: { userName: res.data.user.userName } });
      }
    } catch (e) {
      console.log("Internal error ", e);
    }

    setData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="box">
      <form onSubmit={submitData} className="formData">
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

        <button type="submit">Login</button>
      </form>
      <p>
        <span>
          <Link to="/">Signup</Link>
        </span>{" "}
        if not have an acc!
      </p>
    </div>
  );
}
