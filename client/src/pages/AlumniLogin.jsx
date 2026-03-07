import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AlumniLogin() {
    const navigate = useNavigate();
    const [rollNumber, setRollNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "error") => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!rollNumber.trim() || !password) return showToast("Please enter roll number and password");

        setLoading(true);
        try {
            const res = await axios.post("/api/alumni/login", { rollNumber, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            showToast("Welcome back! 👋", "success");
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (err) {
            showToast(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper">
            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

            <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem 2.25rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "52px",
                            height: "52px",
                            borderRadius: "0.875rem",
                            background: "linear-gradient(135deg, var(--cyan-500), var(--primary))",
                            marginBottom: "0.875rem",
                            fontSize: "1.5rem",
                        }}
                    >
                        💼
                    </div>
                    <h1 className="page-title">Alumni Login</h1>
                    <p className="page-subtitle">Sign in to mentor the next generation</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                    <div className="form-group">
                        <label className="form-label">Roll Number <span className="req">*</span></label>
                        <input className="form-input" placeholder="Enter your roll number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password <span className="req">*</span></label>
                        <input className="form-input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: "0.375rem" }} disabled={loading}>
                        {loading && <span className="spinner" />}
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <div className="divider" />

                <div style={{ textAlign: "center", fontSize: "0.8125rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    <p style={{ color: "var(--slate-500)" }}>
                        Don't have an account?{" "}
                        <span className="link" onClick={() => navigate("/alumni/register")}>Create one</span>
                    </p>
                    <span className="link-muted" onClick={() => navigate("/")}>← Back to Home</span>
                </div>
            </div>
        </div>
    );
}
