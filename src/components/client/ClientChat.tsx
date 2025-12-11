'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import { Send } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

interface ClientChatProps {
    bookingId: string;
    isOpen: boolean;
    onClose: () => void;
    businessName: string;
}

export default function ClientChat({ bookingId, isOpen, onClose, businessName }: ClientChatProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?bookingId=${bookingId}`);
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            setMessages(data);
        } catch {
            // polling silent fail
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, bookingId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const tempMsg = {
            id: Date.now().toString(),
            text: newMessage,
            senderId: session?.user?.id,
            createdAt: new Date().toISOString(),
        };
        setMessages(prev => [...prev, tempMsg]);
        setNewMessage('');

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId, text: tempMsg.text }),
            });
            if (!res.ok) throw new Error('Failed');
            fetchMessages();
        } catch {
            toast.error('Failed to send');
        }
    };

    const userId = session?.user?.id;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Chat with ${businessName}`} size="lg">
            <div className="flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-500">No messages yet.</p>
                    )}
                    {messages.map((msg) => {
                        const isMe = msg.senderId === userId;
                        return (
                            <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                                <div
                                    className={cn(
                                        "max-w-[70%] rounded-lg px-4 py-2",
                                        isMe
                                            ? "bg-primary-600 text-white"
                                            : "bg-white dark:bg-gray-800 border text-gray-900 dark:text-gray-100"
                                    )}
                                >
                                    <p>{msg.text}</p>
                                    <p className={cn("text-xs mt-1", isMe ? "text-primary-100" : "text-gray-400")}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="mt-4 flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        containerClassName="flex-1"
                        className="rounded-full"
                    />
                    <Button type="submit" size="sm" className="rounded-full h-10 w-10 p-0 flex items-center justify-center">
                        <Send size={18} />
                    </Button>
                </form>
            </div>
        </Modal>
    );
}
