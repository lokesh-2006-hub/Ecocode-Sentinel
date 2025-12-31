import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

import { API_URL } from '../config';

const EcoChatAssistant = ({ resources, carbonRating }) => {
    const [messages, setMessages] = useState([
        { role: 'model', content: `Greetings! I've analyzed your site. You have a Carbon Rating of **${carbonRating}**. Ask me how to improve it!` }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/chat`, {
                messages: newMessages,
                resources: resources
            });

            setMessages([...newMessages, { role: 'model', content: response.data.reply }]);
        } catch (err) {
            console.error(err);
            setMessages([...newMessages, { role: 'model', content: "My sensors are offline. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} color="var(--accent-green)" />
                <h3 style={{ margin: 0, fontSize: '1rem' }}>ECOCODE ASSISTANT</h3>
            </div>

            <div
                ref={chatContainerRef}
                style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: msg.role === 'user' ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            padding: '12px',
                            borderRadius: '12px',
                            border: msg.role === 'user' ? '1px solid rgba(0,255,157,0.3)' : '1px solid var(--glass-border)',
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem', fontSize: '0.8rem', opacity: 0.7 }}>
                            {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                            <span>{msg.role === 'user' ? 'YOU' : 'SENTINEL'}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.4', maxWidth: '100%', overflowX: 'auto' }}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </motion.div>
                ))}
                {loading && <div style={{ alignSelf: 'flex-start', opacity: 0.5, fontSize: '0.8rem' }}>Thinking...</div>}
                <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about reducing CO2..."
                    style={{
                        flex: 1,
                        background: 'rgba(0,0,0,0.3)',
                        border: 'none',
                        color: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        fontFamily: 'var(--font-family)'
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="btn-primary"
                    style={{ padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

export default EcoChatAssistant;
