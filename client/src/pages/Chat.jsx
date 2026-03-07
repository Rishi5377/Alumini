import { useState, useEffect } from "react";
import axios from "axios";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [requests, setRequests] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [activeChat]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`/api/requests/user/${user.id}`);
            setRequests(res.data.filter(r => r.status === "accepted"));
        } catch (err) {
            console.error("Fetch requests error:", err);
        }
    };

    const fetchMessages = async () => {
        if (!activeChat) return;
        try {
            const otherId = activeChat.sender._id === user.id ? activeChat.recipient._id : activeChat.sender._id;
            const res = await axios.get(`/api/messages/${user.id}/${otherId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Fetch messages error:", err);
        }
    };

    const handleSend = async () => {
        if (!text.trim() || !activeChat) return;
        const otherId = activeChat.sender._id === user.id ? activeChat.recipient._id : activeChat.sender._id;
        const otherModel = activeChat.sender._id === user.id ? activeChat.recipientModel : activeChat.senderModel;

        try {
            await axios.post("/api/messages/send", {
                senderId: user.id,
                senderModel: user.role === "student" ? "Student" : "Alumni",
                recipientId: otherId,
                recipientModel: otherModel,
                text,
            });
            setText("");
            fetchMessages();
        } catch (err) {
            console.error("Send error:", err);
        }
    };

    return (
        <div className="dashboard-main">
            <h1 className="page-title" style={{ fontSize: '2rem' }}>Messages</h1>
            <p className="page-subtitle">Connect with your mentors and peers.</p>

            <div className="chat-window">
                <div className="chat-list">
                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: 600, fontSize: '0.875rem' }}>
                        Conversations
                    </div>
                    {requests.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--slate-500)', fontSize: '0.8125rem' }}>
                            No active chats yet. Connect with alumni to start chatting!
                        </div>
                    ) : (
                        requests.map(req => {
                            const otherUser = req.sender._id === user.id ? req.recipient : req.sender;
                            return (
                                <div
                                    key={req._id}
                                    className={`chat-item ${activeChat?._id === req._id ? 'active' : ''}`}
                                    onClick={() => setActiveChat(req)}
                                    style={{
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        background: activeChat?._id === req._id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: activeChat?._id === req._id ? 'var(--accent-light)' : 'white' }}>
                                        {otherUser.name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                                        {otherUser.jobDescription || "Connection"}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="chat-main">
                    {!activeChat ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-500)', flexDirection: 'column', gap: '1rem' }}>
                            <span style={{ fontSize: '3rem' }}>💬</span>
                            <p>Select a conversation to start chatting</p>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--emerald-500)' }}></div>
                                <span style={{ fontWeight: 600 }}>{activeChat.sender._id === user.id ? activeChat.recipient.name : activeChat.sender.name}</span>
                            </div>

                            <div className="chat-messages">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`message-bubble ${msg.sender === user.id ? 'message-sent' : 'message-received'}`}>
                                        {msg.text}
                                    </div>
                                ))}
                            </div>

                            <div className="chat-input-area">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Type a message..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button className="btn-primary" style={{ width: 'auto', padding: '0 1.5rem' }} onClick={handleSend}>
                                    Send
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
