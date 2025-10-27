import React from 'react';
import Protected from '@/app/components/Protected';
import ChatInterface from '@/components/chat-interface';

export default function ChatByIdPage() {
  return (
    <Protected>
      <ChatInterface />
    </Protected>
  );
}
