import React from 'react';
import ChatInterface from '@/components/chat-interface';
import Protected from '../components/Protected';

const page = () => {
  return (
    <Protected>
      <ChatInterface />
    </Protected>
  );
};

export default page;
