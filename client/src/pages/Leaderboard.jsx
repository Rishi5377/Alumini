import { useState, useEffect } from "react";
import axios from "axios";

export default function Leaderboard() {
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get("/api/alumni/leaderboard");
            setAlumni(res.data);
        } catch (err) {
            console.error("Leaderboard error:", err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="page-title" style={{ fontSize: '2.5rem' }}>Top 100 Alumni</h1>
                <p style={{ color: 'var(--slate-400)', maxWidth: '600px', margin: '0.5rem auto' }}>
                    Recognizing the most helpful mentors in our community through tokens of appreciation.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <span className="spinner"></span>
                </div>
            ) : (
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Rank</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Alumni Name</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Role/Title</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Coins</th>
                                {user.role === "student" && <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--slate-500)' }}>Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {alumni.map((member, index) => (
                                <tr key={member._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.2s ease' }} className="row-hover">
                                    <td style={{ padding: '1.25rem 2rem', color: index < 3 ? 'var(--amber-400)' : 'var(--slate-400)', fontWeight: 700 }}>
                                        #{index + 1} {index < 3 && '🏆'}
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{member.rollNumber}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--slate-300)' }}>{member.jobDescription || 'Mentor'}</td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <span style={{ color: 'var(--amber-400)', fontWeight: 800 }}>🪙 {member.coins || 0}</span>
                                    </td>
                                    {user.role === "student" && (
                                        <td style={{ padding: '1.25rem 2rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {alumni.length === 0 && (
                        <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                            No mentors ranked yet.
                        </div>
                    )}
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .row-hover:hover { background: rgba(255,255,255,0.015); }
            `}} />
        </div>
    );
}
