import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LOGIN_USER } from "../graphql/mutations";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loginUser] = useMutation(LOGIN_USER);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({
        variables: formData
      });

      // store token
      localStorage.setItem("token", data.login)
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div className="auth-page">
      <form
        onSubmit={handleSubmit}
        className="auth-form"
      >
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;