import { useState, useEffect } from "react";
import axios from "axios";

export default function Interview() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
    const [connections, setConnections] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [link, setLink] = useState("");
    const [referralEmail, setReferralEmail] = useState("");

    useEffect(() => {
        fetchJobs();
        fetchConnections();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get("/api/jobs/all");
            setJobs(res.data);
        } catch (err) {
            console.error("Fetch jobs error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchConnections = async () => {
        try {
            const res = await axios.get(`/api/requests/user/${user.id}`);
            // Get IDs of alumni this student is connected to
            const accepted = res.data
                .filter(r => r.status === "accepted")
                .map(r => r.sender._id === user.id ? r.recipient._id : r.sender._id);
            setConnections(accepted);
        } catch (err) {
            console.error("Fetch connections error:", err);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/jobs/add", {
                postedBy: user.id,
                company,
                role,
                description,
                link,
                referralEmail
            });
            setShowModal(false);
            fetchJobs();
            // Reset form
            setCompany(""); setRole(""); setDescription(""); setLink(""); setReferralEmail("");
            alert("Job posted! You earned 100 coins. 🎉");
        } catch (err) {
            alert("Error posting job");
        }
    };

    const isConnected = (alumniId) => connections.includes(alumniId);

    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Internships & Job Board</h1>
                    <p style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>Opportunity hub for students and alumni.</p>
                </div>
                {user.role === "alumni" && (
                    <button className="btn-primary" onClick={() => setShowModal(true)}>+ Post Opportunity</button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <span className="spinner"></span>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map(job => (
                        <div key={job._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{job.role}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--emerald-400)', borderRadius: '4px', fontWeight: 600 }}>
                                        {job.company}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Posted by {job.postedBy?.name}</p>
                            </div>

                            <p style={{ fontSize: '0.875rem', color: 'var(--slate-300)', lineHeight: '1.5', flex: 1, marginBottom: '1.5rem' }}>
                                {job.description}
                            </p>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Referral Email</div>
                                {isConnected(job.postedBy?._id) || user.id === job.postedBy?._id ? (
                                    <div style={{ fontSize: '0.875rem', color: 'var(--accent-light)', fontWeight: 600 }}>{job.referralEmail}</div>
                                ) : (
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>
                                        🔒 Visible to mentored students only.
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        await axios.post("/api/students/apply-job", { studentId: user.id });
                                        window.open(job.link, "_blank");
                                        alert("Applied! +50 coins earned.");
                                    } catch (err) {
                                        window.open(job.link, "_blank");
                                    }
                                }}
                                className="btn-primary"
                                style={{ width: '100%', textAlign: 'center' }}
                            >
                                Apply Now
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Post Job Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="glass-card" style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}>
                        <h2 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'left' }}>Post an Opportunity</h2>
                        <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Company Name</label>
                                <input className="form-input" value={company} onChange={e => setCompany(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role / Position</label>
                                <input className="form-input" value={role} onChange={e => setRole(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Job Description</label>
                                <textarea className="form-input" value={description} onChange={e => setDescription(e.target.value)} rows="3" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Application Link</label>
                                <input className="form-input" value={link} onChange={e => setLink(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Referral Email (Hidden from public)</label>
                                <input className="form-input" type="email" value={referralEmail} onChange={e => setReferralEmail(e.target.value)} required />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Post & Earn 100 Coins</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
