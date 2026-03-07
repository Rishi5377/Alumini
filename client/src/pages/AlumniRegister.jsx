import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AlumniRegister() {
    const navigate = useNavigate();
    const [phase, setPhase] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [passedYear, setPassedYear] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [about, setAbout] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [experience, setExperience] = useState("");
    const [skills, setSkills] = useState("");
    const [resume, setResume] = useState(null);

    const showToast = (msg, type = "error") => {
        setToast({ message: msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handlePhase1Next = (e) => {
        e.preventDefault();
        if (!name.trim() || !rollNumber.trim() || !passedYear || !password) {
            return showToast("Please fill in all required fields");
        }
        if (password.length < 6) return showToast("Password must be at least 6 characters");
        if (password !== confirmPassword) return showToast("Passwords do not match");
        setPhase(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("name", name);
            fd.append("rollNumber", rollNumber);
            fd.append("passedYear", passedYear);
            fd.append("linkedinUrl", linkedinUrl);
            fd.append("githubUrl", githubUrl);
            fd.append("phoneNumber", phoneNumber);
            fd.append("password", password);
            fd.append("about", about);
            fd.append("jobDescription", jobDescription);
            fd.append("experience", experience);
            fd.append("skills", skills);
            if (resume) fd.append("resume", resume);

            const res = await axios.post("/api/alumni/register", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            showToast("Registration successful! 🎉", "success");
            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            showToast(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let y = currentYear; y >= currentYear - 30; y--) yearOptions.push(y);

    return (
        <div className="page-wrapper">
            {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

            <div className="glass-card" style={{ width: "100%", maxWidth: "560px", padding: "2.5rem 2.25rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>💼</span>
                    <h1 className="page-title">Alumni Registration</h1>
                    <p className="page-subtitle">Create your profile to mentor students</p>
                </div>

                {/* Stepper */}
                <div className="phase-stepper">
                    <div className="phase-step">
                        <div className={`phase-num ${phase === 1 ? "active" : "done"}`}>
                            {phase > 1 ? "✓" : "1"}
                        </div>
                        <span className={`phase-label ${phase === 1 ? "active" : "done"}`}>Basic Info</span>
                    </div>
                    <div className={`phase-connector ${phase > 1 ? "done" : "pending"}`} />
                    <div className="phase-step">
                        <div className={`phase-num ${phase === 2 ? "active" : "pending"}`}>2</div>
                        <span className={`phase-label ${phase === 2 ? "active" : "pending"}`}>Professional</span>
                    </div>
                </div>

                {/* Phase 1 */}
                {phase === 1 && (
                    <form onSubmit={handlePhase1Next} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div className="section-title" style={{ color: "var(--primary-300)", marginBottom: "0.25rem" }}>
                            <span className="dot indigo" /> Basic Information
                        </div>

                        <div className="form-group">
                            <label className="form-label">Full Name <span className="req">*</span></label>
                            <input className="form-input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Roll Number <span className="req">*</span></label>
                                <input className="form-input" placeholder="e.g. 18CS205" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Passed Year <span className="req">*</span></label>
                                <select className="form-input" value={passedYear} onChange={(e) => setPassedYear(e.target.value)} required>
                                    <option value="">Select year</option>
                                    {yearOptions.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">LinkedIn <span className="opt">optional</span></label>
                                <input className="form-input" placeholder="linkedin.com/in/..." value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">GitHub <span className="opt">optional</span></label>
                                <input className="form-input" placeholder="github.com/..." value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Phone Number <span className="opt">optional</span></label>
                            <input className="form-input" type="tel" placeholder="+91 98765 43210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Password <span className="req">*</span></label>
                                <input className="form-input" type="password" placeholder="Min 6 chars" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password <span className="req">*</span></label>
                                <input className="form-input" type="password" placeholder="Re-enter" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }}>
                            Continue to Professional Details →
                        </button>

                        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--slate-500)" }}>
                            Already registered?{" "}
                            <span className="link" onClick={() => navigate("/alumni/login")}>Sign in</span>
                        </p>
                    </form>
                )}

                {/* Phase 2 */}
                {phase === 2 && (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div className="section-title" style={{ color: "var(--cyan-400)", marginBottom: "0.25rem" }}>
                            <span className="dot cyan" /> Professional Details
                        </div>

                        <div className="form-group">
                            <label className="form-label">About Yourself</label>
                            <textarea className="form-input" rows="3" placeholder="Brief intro — your journey, passions, and what drives you..." value={about} onChange={(e) => setAbout(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Current Job / Role</label>
                            <input className="form-input" placeholder="e.g. Senior SDE at Google" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Experience</label>
                            <textarea className="form-input" rows="3" placeholder="Describe your professional experience..." value={experience} onChange={(e) => setExperience(e.target.value)} />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Skills</label>
                            <input className="form-input" placeholder="React, Node.js, AWS, …" value={skills} onChange={(e) => setSkills(e.target.value)} />
                            <span className="form-hint">Separate multiple skills with commas</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Resume</label>
                            <div className={`file-drop ${resume ? "has-file" : ""}`}>
                                <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span>{resume ? `📄 ${resume.name}` : "Click to upload resume (PDF, DOC)"}</span>
                                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                            <button type="button" className="btn-secondary" style={{ flex: "0 0 auto", minWidth: "100px" }} onClick={() => setPhase(1)}>
                                ← Back
                            </button>
                            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                                {loading && <span className="spinner" />}
                                {loading ? "Registering…" : "Complete Registration"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
