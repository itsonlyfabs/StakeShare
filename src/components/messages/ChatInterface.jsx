
import React, { useState, useEffect, useRef } from 'react';
import { User, Conversation, Message } from '@/api/entities';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Search } from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';

const MessageBubble = ({ message, isSender }) => (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${isSender ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-white rounded-bl-none'}`}>
            <p>{message.content}</p>
            <p className={`text-xs mt-1 ${isSender ? 'text-blue-200' : 'text-slate-400'}`}>
                {format(new Date(message.created_date), 'p')}
            </p>
        </div>
    </div>
);

export default function ChatInterface({ preselectedConversationId }) {
    const [user, setUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadData = async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            setUser(currentUser);

            const convs = await Conversation.list();
            const userConvs = convs.filter(c => c.creator_email === currentUser.email || c.founder_email === currentUser.email)
                .sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
            setConversations(userConvs);

            if (preselectedConversationId) {
                const preselected = userConvs.find(c => c.id === preselectedConversationId);
                if (preselected) {
                    handleSelectConversation(preselected);
                }
            } else if (userConvs.length > 0) {
                handleSelectConversation(userConvs[0]);
            }
        } catch (error) {
            console.error("Error loading chat data:", error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [preselectedConversationId]);

    useEffect(scrollToBottom, [messages]);

    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setMessages([]);
        const msgs = await Message.filter({ conversation_id: conversation.id }, 'created_date');
        setMessages(msgs);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        const content = newMessage;
        setNewMessage('');

        const newMsg = await Message.create({
            conversation_id: selectedConversation.id,
            sender_email: user.email,
            receiver_email: user.email === selectedConversation.creator_email ? selectedConversation.founder_email : selectedConversation.creator_email,
            content: content
        });

        setMessages(prev => [...prev, newMsg]);

        // Update conversation details
        await Conversation.update(selectedConversation.id, {
            last_message_snippet: content.substring(0, 40),
            last_message_at: new Date().toISOString()
        });
    };
    
    const filteredConversations = conversations.filter(c => 
        (c.program_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.creator_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.founder_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="text-center p-12 text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

    if (conversations.length === 0) {
        return (
            <div className="text-center p-12 glass-card rounded-2xl">
                <h2 className="text-2xl font-bold text-white">No messages yet</h2>
                <p className="text-white/70 mt-2">When you message a founder, your conversations will appear here.</p>
            </div>
        );
    }
    
    const isCreator = user?.role === 'creator';
    
    const getOtherPartyName = (conv) => {
        if (!conv) return '';
        if (isCreator) {
            // For a creator, the other party is either the program (if direct message with founder)
            // or the founder's name if they initiated from a program context
            return conv.program_name || conv.founder_name || 'Founder';
        }
        // For a founder, the other party is always the creator
        return conv.creator_name || 'Creator';
    };

    const otherPartyName = getOtherPartyName(selectedConversation);
    const otherPartyRole = selectedConversation ? (isCreator ? 'Founder' : 'Creator') : '';


    return (
        <div className="flex h-[calc(100vh-120px)] glass-card rounded-2xl overflow-hidden">
            {/* Conversation List */}
            <div className="w-1/3 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input 
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="glass border-white/20 pl-10 w-full"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map(conv => {
                        const isSelected = selectedConversation?.id === conv.id;
                        return (
                            <div key={conv.id} onClick={() => handleSelectConversation(conv)} className={`p-4 flex items-center gap-3 cursor-pointer border-b border-white/5 transition-colors ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                                <Avatar>
                                    <AvatarFallback>{(getOtherPartyName(conv) || 'P').charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <h4 className="font-semibold truncate">{getOtherPartyName(conv)}</h4>
                                    <p className="text-sm text-white/60 truncate">{conv.last_message_snippet}</p>
                                </div>
                                {conv.last_message_at && (
                                    <div className="text-xs text-white/50 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b border-white/10 flex items-center gap-3">
                             <Avatar>
                                <AvatarFallback>{otherPartyName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-lg">{otherPartyName}</h3>
                                <p className="text-sm text-white/60">{otherPartyRole}</p>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {messages.map(msg => (
                                <MessageBubble key={msg.id} message={msg} isSender={msg.sender_email === user.email} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-white/10">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <Input 
                                    placeholder="Type a message..."
                                    className="glass flex-1"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div>
                            <p className="text-xl font-semibold">Select a conversation</p>
                            <p className="text-white/60">Choose a conversation from the left to start chatting.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
