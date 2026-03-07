import { useState, useEffect } from "react";
import axios from "axios";

export default function Mentoring() {
    const [alumni, setAlumni] = useState([]);
    const [filters, setFilters] = useState({ company: "", skills: "", experience: "" });
    const [loading, setLoading] = useState(true);
    const [requestMsg, setRequestMsg] = useState("");
    const [selectedAlumni, setSelectedAlumni] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchAlumni();
    }, []);

    const fetchAlumni = async () => {
        try {
            setLoading(true);
            const res = await axios.get("/api/alumni/all");
            setAlumni(res.data);
        } catch (err) {
            console.error("Error fetching alumni:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const { company, skills, experience } = filters;
            const res = await axios.get(`/api/alumni/search?company=${company}&skills=${skills}&experience=${experience}`);
            setAlumni(res.data);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    const sendRequest = async () => {
        if (!selectedAlumni) return;
        try {
            await axios.post("/api/requests/send", {
                senderId: user.id,
                senderModel: user.role === "student" ? "Student" : "Alumni",
                recipientId: selectedAlumni._id,
                recipientModel: "Alumni",
                message: requestMsg,
            });
            alert("Request sent successfully!");
            setSelectedAlumni(null);
            setRequestMsg("");
        } catch (err) {
            alert(err.response?.data?.message || "Error sending request");
        }
    };

    return (
        <div className="dashboard-main">
            <h1 className="page-title" style={{ fontSize: '2rem' }}>Alumni Network</h1>
            <p className="page-subtitle">Connect with professionals for guidance and mentorship.</p>

            <div className="filter-bar">
                <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Company</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Google"
                        value={filters.company}
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                    />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Skills</label>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. React, Node"
                        value={filters.skills}
                        onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                    />
                </div>
                <button className="btn-primary" style={{ width: 'auto', padding: '0 2rem' }} onClick={handleSearch}>
                    Filter
                </button>
            </div>

            {loading ? (
                <div className="text-center" style={{ padding: '4rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem', width: '2rem', height: '2rem', borderTopColor: 'var(--accent)' }}></div>
                    <p>Finding alumni...</p>
                </div>
            ) : (
                <div className="mentor-grid">
                    {alumni.map((al) => (
                        <div key={al._id} className="mentor-card">
                            <span className="status-badge badge-emerald">Available</span>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--slate-800)', border: '1px solid var(--slate-700)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    💼
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{al.name}</h3>
                                    <p style={{ fontSize: '0.8125rem', color: 'var(--accent-light)' }}>{al.jobDescription || "Professional"}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1rem' }}>🏢</span> {al.experience || "Experience listed"}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {al.skills.map((skill, i) => (
                                    <span key={i} style={{ padding: '0.25rem 0.625rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', color: 'var(--slate-300)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <button className="btn-primary" style={{ height: '2.5rem' }} onClick={() => setSelectedAlumni(al)}>
                                Request Guidance
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {selectedAlumni && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '2rem' }}>
                        <h2 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Request Guidance</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', marginBottom: '1.5rem' }}>Send a message to {selectedAlumni.name} about why you'd like to connect.</p>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <textarea
                                className="form-input"
                                placeholder="Hi, I'm interested in learning more about your role at..."
                                value={requestMsg}
                                onChange={(e) => setRequestMsg(e.target.value)}
                                style={{ minHeight: '120px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedAlumni(null)}>Cancel</button>
                            <button className="btn-primary" style={{ flex: 2 }} onClick={sendRequest}>Send Request</button>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
