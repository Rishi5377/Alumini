import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Mentoring from "./Mentoring";
import Chat from "./Chat";
import Interview from "./Interview";
import Leaderboard from "./Leaderboard";
import TrainingPage from "./TrainingPage";
import axios from "axios";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [requests, setRequests] = useState([]);

    const [viewingStudent, setViewingStudent] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            navigate("/");
            return;
        }
        setUser(JSON.parse(stored));
        fetchRequests(JSON.parse(stored).id);
    }, [navigate]);

    const fetchRequests = async (userId) => {
        try {
            const res = await axios.get(`/api/requests/user/${userId}`);
            setRequests(res.data);
        } catch (err) {
            console.error("Fetch requests error:", err);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            await axios.post("/api/requests/action", { requestId, action });
            fetchRequests(user.id);
            setViewingStudent(null);
        } catch (err) {
            alert("Error updating request");
        }
    };

    const handleRemoveMentor = async (requestId, reason) => {
        try {
            await axios.post("/api/requests/remove-mentor", { requestId, reason });
            fetchRequests(user.id);
            alert("Mentor removed.");
        } catch (err) {
            alert("Error removing mentor");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    if (!user) return null;

    const isAlumni = user.role === "alumni";

    return (
        <div style={{ background: 'var(--slate-950)', minHeight: '100vh', color: 'white' }}>
            <nav className="navbar">
                <a href="/dashboard" className="nav-logo">
                    <span style={{ color: 'var(--accent-light)' }}>🎓</span> AlumniConnect
                </a>
                <div className="nav-links">
                    <button className={`nav-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
                    <button className={`nav-link ${activeTab === "mentoring" ? "active" : ""}`} onClick={() => setActiveTab("mentoring")}>Mentoring</button>
                    <button className={`nav-link ${activeTab === "training" ? "active" : ""}`} onClick={() => setActiveTab("training")}>Training</button>
                    <button className={`nav-link ${activeTab === "interview" ? "active" : ""}`} onClick={() => setActiveTab("interview")}>Job Description</button>
                    <button className={`nav-link ${activeTab === "chat" ? "active" : ""}`} onClick={() => setActiveTab("chat")}>Chat</button>
                    <button className={`nav-link ${activeTab === "leaderboard" ? "active" : ""}`} onClick={() => setActiveTab("leaderboard")}>Leaderboard</button>
                    <button className="btn-secondary" style={{ height: '2.5rem', fontSize: '0.8rem' }} onClick={handleLogout}>Sign Out</button>
                </div>
            </nav>

            <div className="dashboard-container">
                <aside className="sidebar">
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--slate-800)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '2px solid var(--accent)' }}>
                                {user.role === 'student' ? '🎓' : '💼'}
                            </div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{user.name}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>{user.role}</p>
                        </div>

                        <div className="divider" style={{ margin: '1.5rem 0' }}></div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="stat-item" style={{ background: 'transparent', border: 'none', padding: '0.5rem 0' }}>
                                <div className="stat-label">Coins</div>
                                <div className="stat-value" style={{ fontSize: '1rem', color: 'var(--amber-400)', fontWeight: 700 }}>🪙 {user.coins || 0}</div>
                            </div>
                            <div className="stat-item" style={{ background: 'transparent', border: 'none', padding: '0.5rem 0' }}>
                                <div className="stat-label">Roll Number</div>
                                <div className="stat-value" style={{ fontSize: '0.875rem' }}>{user.rollNumber}</div>
                            </div>
                            <div className="stat-item" style={{ background: 'transparent', border: 'none', padding: '0.5rem 0' }}>
                                <div className="stat-label">Status</div>
                                <div className="stat-value" style={{ fontSize: '0.875rem', color: 'var(--emerald-400)' }}>● Active</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem', marginTop: '1rem' }}>
                        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</h3>
                        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem' }}>Edit Profile</button>
                        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'rgba(255,255,255,0.03)' }}>Notifications</button>
                    </div>
                </aside>

                <main className="dashboard-main">
                    {activeTab === "overview" && (
                        <>
                            <div className="hero-banner">
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Our College Excellence</h1>
                                <p style={{ fontSize: '1rem', color: 'var(--slate-300)', maxWidth: '600px' }}>
                                    Empowering students and alumni through a dedicated mentorship network. Discover opportunities, share knowledge, and build the future together.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div className="glass-card" style={{ padding: '2rem' }}>
                                    <h2 className="section-title"><span className="dot indigo"></span> Recent Activity</h2>
                                    <div style={{ marginTop: '1.5rem', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                                        {requests.length === 0 ? "No recent activities found." : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {requests.slice(0, 3).map(req => (
                                                    <div key={req._id} style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        {req.sender._id === user.id ?
                                                            `You sent a request to ${req.recipient.name}` :
                                                            `${req.sender.name} sent you a guidance request`}
                                                        <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Status: {req.status}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isAlumni && (
                                    <div className="glass-card" style={{ padding: '2rem' }}>
                                        <h2 className="section-title"><span className="dot cyan"></span> Pending Requests</h2>
                                        <div style={{ marginTop: '1.5rem' }}>
                                            {requests.filter(r => r.recipient._id === user.id && r.status === "pending").length === 0 ? (
                                                <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>No pending requests.</p>
                                            ) : (
                                                requests.filter(r => r.recipient._id === user.id && r.status === "pending").map(req => (
                                                    <div key={req._id} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)', marginBottom: '1rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <div style={{ fontWeight: 600 }}>{req.sender.name}</div>
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{req.sender.presentYear || "Student"}</span>
                                                        </div>
                                                        <div style={{ fontSize: '0.8125rem', color: 'var(--slate-400)', margin: '0.5rem 0', fontStyle: 'italic' }}>"{req.message}"</div>

                                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Skills</div>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                                                {req.sender.skills?.map((s, i) => (
                                                                    <span key={i} style={{ fontSize: '0.7rem', color: 'var(--accent-light)' }}>• {s}</span>
                                                                ))}
                                                            </div>
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginTop: '0.75rem', marginBottom: '0.25rem' }}>About</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--slate-300)', lineHeight: '1.4' }}>{req.sender.about || "No profile bio provided."}</div>
                                                        </div>

                                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                            <button className="btn-primary" style={{ height: '2rem', padding: '0 1rem', fontSize: '0.75rem' }} onClick={() => handleAction(req._id, 'accepted')}>Accept</button>
                                                            <button className="btn-secondary" style={{ height: '2rem', padding: '0 1rem', fontSize: '0.75rem' }} onClick={() => setViewingStudent(req)}>View Profile</button>
                                                            <button className="btn-secondary" style={{ height: '2rem', padding: '0 1rem', fontSize: '0.75rem', background: 'transparent' }} onClick={() => handleAction(req._id, 'rejected')}>Ignore</button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}

                                {!isAlumni && (
                                    <div className="glass-card" style={{ padding: '2rem' }}>
                                        <h2 className="section-title"><span className="dot cyan"></span> Your Mentors</h2>
                                        <div style={{ marginTop: '1.5rem' }}>
                                            {requests.filter(r => (r.sender._id === user.id || r.recipient._id === user.id) && r.status === "accepted").length === 0 ? (
                                                <>
                                                    <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                                                        Check the Mentoring tab to find alumni from your field.
                                                    </p>
                                                    <button className="btn-primary" style={{ marginTop: '1.5rem', width: 'auto', padding: '0 1.5rem' }} onClick={() => setActiveTab("mentoring")}>Browse Alumni</button>
                                                </>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                    {requests.filter(r => (r.sender._id === user.id || r.recipient._id === user.id) && r.status === "accepted").map(req => {
                                                        const mentor = req.sender._id === user.id ? req.recipient : req.sender;
                                                        return (
                                                            <div key={req._id} style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 600 }}>{mentor.name}</div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{mentor.jobDescription || "Alumni"}</div>
                                                                </div>
                                                                <button
                                                                    className="btn-secondary"
                                                                    style={{ height: '2rem', padding: '0 0.75rem', fontSize: '0.7rem', color: 'var(--rose-400)', borderColor: 'rgba(251, 113, 133, 0.2)' }}
                                                                    onClick={() => {
                                                                        const reason = prompt("Reason for removing mentorship:");
                                                                        if (reason) handleRemoveMentor(req._id, reason);
                                                                    }}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === "mentoring" && <Mentoring />}
                    {activeTab === "interview" && <Interview />}
                    {activeTab === "chat" && <Chat />}
                    {activeTab === "leaderboard" && <Leaderboard />}
                    {activeTab === "training" && <TrainingPage />}
                </main>
            </div>

            {/* Profile Modal */}
            {viewingStudent && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="glass-card" style={{ maxWidth: '560px', width: '100%', padding: '2.5rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                        <button
                            onClick={() => setViewingStudent(null)}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--slate-400)', cursor: 'pointer', fontSize: '1.5rem' }}
                        >
                            &times;
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--slate-800)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', border: '3px solid var(--accent)' }}>
                                🎓
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{viewingStudent.sender.name}</h2>
                            <p style={{ color: 'var(--accent-light)', fontWeight: 600 }}>{viewingStudent.sender.presentYear}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Roll Number</h3>
                                <p style={{ fontSize: '0.9375rem' }}>{viewingStudent.sender.rollNumber}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Contact</h3>
                                <p style={{ fontSize: '0.9375rem' }}>{viewingStudent.sender.phoneNumber || "Not provided"}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>About</h3>
                            <p style={{ fontSize: '0.9375rem', color: 'var(--slate-300)', lineHeight: '1.6' }}>
                                {viewingStudent.sender.about || "This student hasn't written an 'About' section yet."}
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '1rem' }}>Skills</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {viewingStudent.sender.skills?.length > 0 ? (
                                    viewingStudent.sender.skills.map((skill, i) => (
                                        <span key={i} style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-400)', padding: '0.375rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span style={{ color: 'var(--slate-500)', fontSize: '0.875rem' }}>No skills listed.</span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                            {viewingStudent.sender.linkedinUrl && (
                                <a href={viewingStudent.sender.linkedinUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}>LinkedIn</a>
                            )}
                            {viewingStudent.sender.githubUrl && (
                                <a href={viewingStudent.sender.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex: 1, fontSize: '0.875rem' }}>GitHub</a>
                            )}
                            {viewingStudent.sender.resume && (
                                <a href={`/uploads/${viewingStudent.sender.resume}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}>📄 Resume</a>
                            )}
                        </div>

                        <div className="divider" style={{ margin: '2rem 0' }}></div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-primary" style={{ flex: 2 }} onClick={() => handleAction(viewingStudent._id, 'accepted')}>Accept Request</button>
                            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => handleAction(viewingStudent._id, 'rejected')}>Ignore</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
