import { useState, useEffect } from "react";
import axios from "axios";

export default function TrainingPage() {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [skill, setSkill] = useState("");
    const [minCoins, setMinCoins] = useState("");
    const [maxCoins, setMaxCoins] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchTrainings();
    }, []);

    const fetchTrainings = async () => {
        try {
            const res = await axios.get("/api/training/all");
            setTrainings(res.data);
        } catch (err) {
            console.error("Fetch training error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/api/training/create", {
                studentId: user.id,
                skill,
                minCoins: Number(minCoins),
                maxCoins: Number(maxCoins)
            });
            setShowModal(false);
            fetchTrainings();
            setSkill(""); setMinCoins(""); setMaxCoins("");
            alert("Training request posted!");
        } catch (err) {
            alert("Error creating request");
        }
    };

    const handleAccept = async (trainingId) => {
        try {
            await axios.post("/api/training/accept", { trainingId, alumniId: user.id });
            fetchTrainings();
            alert("Training accepted!");
        } catch (err) {
            alert("Error accepting training");
        }
    };

    const handleFeedback = async (trainingId, feedback) => {
        try {
            await axios.post("/api/training/feedback", { trainingId, feedback });
            fetchTrainings();
            alert(`Feedback submitted! Coins allocated.`);
        } catch (err) {
            alert("Error submitting feedback");
        }
    };

    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 className="page-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>Skill Training</h1>
                    <p style={{ color: 'var(--slate-400)', fontSize: '0.9375rem' }}>Learn specific skills from experienced alumni.</p>
                </div>
                {user.role === "student" && (
                    <button className="btn-primary" onClick={() => setShowModal(true)}>+ Request Training</button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <span className="spinner"></span>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {trainings.map(t => (
                        <div key={t._id} className="glass-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t.skill}</h3>
                                <span style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', textTransform: 'uppercase' }}>
                                    {t.status}
                                </span>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>Requested by: <span style={{ color: 'white' }}>{t.student?.name}</span></p>
                                {t.alumni && <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)' }}>Accepted by: <span style={{ color: 'var(--accent-light)' }}>{t.alumni.name}</span></p>}
                                <p style={{ fontSize: '0.875rem', color: 'var(--slate-400)', marginTop: '0.5rem' }}>Reward: <span style={{ color: 'var(--amber-400)' }}>🪙 {t.minCoins} - {t.maxCoins}</span></p>
                            </div>

                            {user.role === "alumni" && t.status === "pending" && (
                                <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleAccept(t._id)}>Accept & Train</button>
                            )}

                            {user.role === "student" && user.id === t.student?._id && t.status === "accepted" && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn-primary" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => handleFeedback(t._id, 'satisfied')}>Satisfied (Max)</button>
                                    <button className="btn-secondary" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => handleFeedback(t._id, 'dissatisfied')}>Dissatisfied (Min)</button>
                                </div>
                            )}

                            {(t.status === "satisfied" || t.status === "dissatisfied") && (
                                <div style={{ textAlign: 'center', color: 'var(--emerald-400)', fontSize: '0.8rem', fontWeight: 600 }}>
                                    Completed
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Request Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
                        <h2 className="page-title" style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>Request Training</h2>
                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Skill to Learn</label>
                                <input className="form-input" placeholder="e.g. Python, React" value={skill} onChange={e => setSkill(e.target.value)} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Min Coins</label>
                                    <input className="form-input" type="number" value={minCoins} onChange={e => setMinCoins(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Max Coins</label>
                                    <input className="form-input" type="number" value={maxCoins} onChange={e => setMaxCoins(e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" style={{ flex: 2 }}>Post Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
