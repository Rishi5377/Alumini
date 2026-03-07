import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null);

    const handleContinue = () => {
        if (selectedRole === "student") navigate("/student/register");
        else if (selectedRole === "alumni") navigate("/alumni/register");
    };

    return (
        <div className="page-wrapper">
            <div className="glass-card" style={{ width: "100%", maxWidth: "580px", padding: "3rem 2.5rem" }}>
                {/* Brand */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "56px",
                            height: "56px",
                            borderRadius: "1rem",
                            background: "linear-gradient(135deg, var(--primary), var(--cyan-500))",
                            marginBottom: "1rem",
                            fontSize: "1.5rem",
                        }}
                    >
                        🎓
                    </div>
                    <h1 className="page-title" style={{ fontSize: "2rem" }}>
                        Alumni Connect
                    </h1>
                    <p className="page-subtitle" style={{ marginTop: "0.5rem" }}>
                        Bridging the gap between students &amp; alumni
                    </p>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "0.5rem",
                            marginTop: "0.75rem",
                            fontSize: "0.75rem",
                            color: "var(--slate-500)",
                        }}
                    >
                        <span style={{ color: "var(--primary-300)" }}>✦</span> Mentorship
                        <span style={{ color: "var(--cyan-400)" }}>✦</span> Guidance
                        <span style={{ color: "var(--emerald-400)" }}>✦</span> Networking
                    </div>
                </div>

                {/* Role Selection */}
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        color: "var(--slate-400)",
                        marginBottom: "1rem",
                    }}
                >
                    Choose your role to get started
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem", marginBottom: "1.75rem" }}>
                    <div
                        className={`role-card ${selectedRole === "student" ? "selected" : ""}`}
                        onClick={() => setSelectedRole("student")}
                    >
                        <span className="role-icon">🎓</span>
                        <span className="role-title">Student</span>
                        <br/>
                        <span className="role-desc">Find mentors &amp; grow your career</span>
                    </div>

                    <div
                        className={`role-card ${selectedRole === "alumni" ? "selected" : ""}`}
                        onClick={() => setSelectedRole("alumni")}
                    >
                        <span className="role-icon">💼</span>
                        <span className="role-title">Alumni</span>
                        <br/>
                        <span className="role-desc">Mentor students &amp; give back to the community.</span>
                    </div>
                </div>

                {/* Continue */}
                <button className="btn-primary" disabled={!selectedRole} onClick={handleContinue}>
                    {selectedRole
                        ? `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} →`
                        : "Select a role to continue"}
                </button>

                {/* Divider + Login links */}
                <div className="divider" />
                <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--slate-500)" }}>
                    Already have an account?{" "}
                    <span className="link" onClick={() => navigate("/student/login")}>Student Login</span>
                    <span style={{ margin: "0 0.375rem", color: "var(--slate-600)" }}>·</span>
                    <span className="link" onClick={() => navigate("/alumni/login")}>Alumni Login</span>
                </p>
            </div>
        </div>
    );
}
