import React from 'react';
import ChatInterface from '../components/messages/ChatInterface';
import { useSearchParams } from 'react-router-dom';

export default function MessagesPage() {
    const [searchParams] = useSearchParams();
    const conversationId = searchParams.get('conversationId');

    return (
        <div className="p-8 text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Messages</h1>
                <ChatInterface preselectedConversationId={conversationId} />
            </div>
        </div>
    );
}