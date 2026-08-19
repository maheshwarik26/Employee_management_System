import {useState} from "react";
import "./LoginPage.css";
import axios from "axios";

const API_URL = 
import.meta.env.VITE_API_URL ||
"http://localhost:5000";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]  = useState("");
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`,{
        email,
        password,
      });

      const {token, user} = response.data;

      localStorage.setItem("token",token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login successful:",user);
      alert("Login successful");
    }catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-heading">
          <p className="login-label">
            EMPLOYEE MANAGEMENT SYSTEM </p>
          <h1>Login</h1>
          <p>Sign in to access your account</p>
        </div>
            
        <form onSubmit={handleSubmit} className="login-form">
              
          <label htmlFor="email">Email</label>
            {error && <p className="error-message">{error}</p>}
              <input
                id = "email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  />

                  <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;