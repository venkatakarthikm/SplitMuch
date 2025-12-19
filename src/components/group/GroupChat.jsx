import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import config from '../../config/config';
import api from '../../utils/api';
import { getUser } from '../../utils/storage';

let socket;

const GroupChat = ({ groupId, members }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const currentUser = getUser();

  useEffect(() => {
    socket = io(config.SOCKET_URL, { transports: ['websocket'], withCredentials: true });
    socket.on('connect', () => { socket.emit('join-group', groupId); });
    socket.on('new-message', (data) => { if (data.groupId === groupId) { setMessages(prev => [...prev, data.message]); scrollToBottom(); } });
    fetchMessages();
    return () => { socket.disconnect(); };
  }, [groupId]);

  const fetchMessages = async () => {
    try { setLoading(true); const response = await api.get(`/groups/${groupId}/messages`); setMessages(response.data.data); scrollToBottom(); } 
    catch (error) { toast.error('Failed to fetch messages'); } 
    finally { setLoading(false); }
  };

  const scrollToBottom = () => { setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, 100); };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try { await api.post(`/groups/${groupId}/messages`, { content: newMessage }); setNewMessage(''); } 
    catch (error) { toast.error('Failed to send message'); }
  };

  if (loading) return <div className="flex items-center justify-center py-12"><motion.div className="w-10 h-10 border-3 border-primary-100 border-t-primary-500 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /></div>;

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-primary-50/30 to-transparent rounded-2xl">
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isCurrentUser = message.sender._id === currentUser.id;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-soft ${isCurrentUser ? 'bg-gradient-to-r from-primary-500 to-primary-400 text-white' : 'bg-white text-primary-800 border border-primary-100/50'}`}>
                  {!isCurrentUser && <p className="text-xs font-bold mb-1 opacity-75">{message.sender.username}</p>}
                  <p className="text-sm break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'opacity-75' : 'text-primary-500/60'}`}>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full text-primary-600/70">
            <div className="text-center"><motion.span className="text-5xl block mb-2" animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>💬</motion.span><p className="font-medium">No messages yet</p><p className="text-sm mt-1">Start the conversation!</p></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 px-4 py-3 bg-primary-50/50 border-2 border-primary-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium text-primary-800" placeholder="Type a message..." maxLength="500" />
        <motion.button type="submit" disabled={!newMessage.trim()} className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all" whileHover={{ scale: newMessage.trim() ? 1.02 : 1 }} whileTap={{ scale: newMessage.trim() ? 0.98 : 1 }}>Send</motion.button>
      </form>
    </div>
  );
};

export default GroupChat;
