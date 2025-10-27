'use client';

import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import {
  AudioLines,
  Bot,
  Check,
  CirclePause,
  Copy,
  File,
  FileCode,
  FileImage,
  FileText,
  FileTextIcon,
  Image,
  Lightbulb,
  LogOut,
  MessageSquare,
  Mic,
  MicIcon,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Trash2,
  User,
  X,
} from 'lucide-react';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
// Optional modals removed until implemented
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';

export default function ChatInterface() {
  const { user, logout } = useAuth();
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const [files, setFiles] = useState(null);
  const currentMessageIdRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [virusFile, setVirusFile] = useState(null);
  const [virusFileUrl, setVirusFileUrl] = useState(null);
  const [reasoning, setReasoning] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const params = useParams();
  const chatId = params?.chatId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedIds, setCopiedIds] = useState({});
  const [speakIds, setSpeakIds] = useState({});
  const wsRef = useRef(null);
  const router = useRouter();
  const [workingStep, setWorkingStep] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('innoreigniters_credentials');
    if (stored) setCredentials(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const handleSearch = () => {
    setIsModalOpen(true);
  };

  const signout = () => {
    localStorage.removeItem('innoreigniters_credentials');
    logout();
    router.push('/login');
  };

  const handleVirusFileUpload = async (virusFile) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(virusFile);
      reader.onload = async () => {
        const base64String = reader.result.split(',')[1];

        const formData = new FormData();
        formData.append('filename', virusFile.name);
        formData.append('content_base64', base64String);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_FILE_SERVER_URL}/upload`, formData);

        if (res.status === 200) {
          setVirusFileUrl(res.data.download_url);
        }
      };
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  useEffect(() => {
    const token = credentials?.access_token;
    const fetchChatData = async (id) => {
      try {
        const res =
          id !== undefined &&
          (await axios.get(`/chats/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }));
        if (res.status === 200) {
          setCurrentChatId(chatId);
          setMessages(res.data.messages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (chatId) {
      setCurrentChatId(chatId);
      fetchChatData(chatId);
    } else {
      setCurrentChatId(null);
      setMessages([]);
    }
  }, [chatId]);

  const fetchChats = useCallback(async () => {
    if (!credentials) return;
    try {
      const token = credentials.access_token;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        setChatHistory(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [credentials]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleChatSelect = (unique_id) => {
    router.push(`/c/${unique_id}`);
  };

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!credentials) return;
    const ws = new WebSocket('ws://localhost:8000/chat');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'reasoning') {
        setIsLoading(false);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === 'assistant' && lastMessage.id === currentMessageIdRef.current) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                reasoning: (lastMessage.reasoning || '') + msg.data,
                timestamp: new Date(),
              },
            ];
          } else {
            const newMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: '',
              reasoning: msg.data,
              timestamp: new Date(),
            };
            currentMessageIdRef.current = newMessage.id;
            return [...prev, newMessage];
          }
        });
      } else if (msg.type === 'answer') {
        setIsLoading(false);
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === 'assistant' && lastMessage.id === currentMessageIdRef.current) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                content: lastMessage.content + msg.data,
                timestamp: new Date(),
              },
            ];
          } else {
            const newMessage = {
              id: Date.now().toString(),
              role: 'assistant',
              content: msg.data,
              reasoning: '',
              timestamp: new Date(),
            };
            currentMessageIdRef.current = newMessage.id;
            return [...prev, newMessage];
          }
        });
        setWorkingStep('');
      } else if (msg.type === 'title') {
        setChatHistory((prevChats) =>
          prevChats.map((chat) =>
            chat.unique_id === msg.chatId ? { ...chat, title: msg.title } : chat
          )
        );
      } else if (msg.type === 'step') {
        setWorkingStep(msg.step);
      } else if (msg.type === 'new_chat') {
        const newChat = {
          id: msg.id,
          title: msg.title,
          unique_id: msg.unique_id,
          lastMessage: '',
          timestamp: new Date(),
          messageCount: 1,
        };
        setChatHistory((prev) => [newChat, ...prev]);
        setCurrentChatId(newChat.unique_id);
      } else if (msg.type === 'error') {
        console.error('Server error:', msg.message);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: 'assistant',
            content: `Oops, something went wrong: ${msg.message}`,
            timestamp: new Date(),
          },
        ]);
        currentMessageIdRef.current = null;
        setVirusFile(null);
        setVirusFileUrl(null);
        setFiles(null);
        setWorkingStep('');
      }
    };

    ws.onerror = (e) => console.error('WebSocket error');
    ws.onclose = () => console.log('WebSocket closed');

    return () => {
      ws.close();
    };
  }, []);

  const imageFileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles(file);
    setUploadProgress(100);
    try {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (_err) {
      // ignore
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      imageUrl: imageUrl,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    if (currentChatId) {
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                lastMessage: input.slice(0, 50),
                messageCount: chat.messageCount + 1,
                timestamp: new Date(),
              }
            : chat
        )
      );
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          currentChatId: currentChatId,
          query: input,
          fileUrl: virusFileUrl,
          imageUrl: imageUrl,
          includeReasoning: reasoning,
          token: JSON.parse(localStorage.getItem('innoreigniters_credentials')).access_token,
        })
      );
      setVirusFile(null);
      setVirusFileUrl(null);
      setFiles(null);
      setImageUrl(null);
    } else {
      console.error('WebSocket not connected');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Error: Unable to connect to the server. Please try again.',
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    router.push('/');
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      const token = credentials?.access_token;
      const res = await axios.delete(`/chat/delete/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.status === 200) {
        setChatHistory((prev) => prev.filter((chat) => chat.unique_id !== chatId));
        if (currentChatId === chatId) {
          handleNewChat();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleReasoning = () => {
    setReasoning(!reasoning);
  };

  const sidebarItems = [
    { icon: Search, label: 'Search', shortcut: 'Ctrl+K' },
    { icon: MessageSquare, label: 'New Chat', active: true },
  ];

  const currentMessages = currentChatId ? messages : messages;

  const getFileIcon = (file) => {
    if (!file) return null;

    const ext = file.name.split('.').pop().toLowerCase();

    switch (ext) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'exe':
        return <FileAlert className="h-6 w-6 text-gray-800" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'txt':
        return <FileCode className="h-6 w-6 text-gray-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-6 w-6 text-green-600" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedIds((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedIds((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  return (
    <>
      <div className="bg-background flex h-screen border">
        {/* Modals temporarily disabled */}

        <div>
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div
            className={`${
              sidebarOpen ? 'w-72' : 'w-0'
            } bg-background fixed top-0 left-0 z-50 h-full overflow-hidden border-r transition-all duration-300 ease-in-out md:relative md:z-auto`}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center p-4">
                <div className="flex items-center space-x-2">
                  <div className="logo-glow flex h-16 w-16 items-center justify-center">
                    <img
                      src="/logo_light.png"
                      alt="Logo"
                      className="h-12 w-12 rounded-full object-contain dark:hidden"
                    />
                    <img
                      src="/logo_dark.png"
                      alt="Logo"
                      className="hidden h-16 w-16 object-contain dark:block"
                    />
                  </div>
                  <span className="text-lg font-medium">InnoIgniterAI</span>
                </div>
              </div>

              <div className="space-y-1 px-3">
                {sidebarItems.map((item) => (
                  <div
                    key={item.label}
                    className={`sidebar-item flex cursor-pointer items-center justify-between px-3 py-2 text-sm ${
                      item.active ? 'active' : ''
                    }`}
                    onClick={
                      item.label === 'New Chat'
                        ? handleNewChat
                        : item.label === 'Search'
                          ? handleSearch
                          : undefined
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.shortcut && (
                      <span className="text-muted-foreground text-xs">{item.shortcut}</span>
                    )}
                  </div>
                ))}
                <div
                  className={`sidebar-item flex cursor-pointer items-center justify-between px-3 py-2 text-sm`}
                  onClick={() => {
                    router.push('/voice');
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <MicIcon className="h-4 w-4" />
                    <span>Voice</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex-1 px-3">
                <div className="text-muted-foreground mb-3 px-3 text-xs font-medium">Today</div>
                <ScrollArea className="scrollbar-thin space-y-1">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`sidebar-item group flex w-56 cursor-pointer items-center justify-between px-3 py-2 ${
                        currentChatId === chat.unique_id
                          ? 'rounded-xl bg-gray-200 dark:bg-slate-700'
                          : ''
                      }`}
                      onClick={() => handleChatSelect(chat.unique_id)}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="w-44 truncate text-sm">{chat.title}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleDeleteChat(chat.unique_id, e)}
                            className="focus:text-destructive text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete chat
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div className="border-t p-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="sidebar-item flex cursor-pointer items-center space-x-3 px-3 py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.image || ''} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm">
                        {user?.email?.split('@')[0] || 'User'}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {!isMobile && (
                      <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                <div className="flex h-4 w-4 flex-col space-y-1">
                  <div className="h-0.5 w-full bg-current"></div>
                  <div className="h-0.5 w-full bg-current"></div>
                  <div className="h-0.5 w-full bg-current"></div>
                </div>
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div variant="ghost" size="sm">
                <ThemeToggle />
              </div>
              {!isMobile && (
                <Button variant="ghost" size="sm" onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <ScrollArea className="scrollbar-thin max-h-[480px] flex-1">
            <div className="mx-auto max-w-4xl px-4">
              {currentMessages.length === 0 && !currentChatId && (
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                  <div className="logo-glow h-40 w-40">
                    <img
                      src="/logo_dark.png"
                      alt="Logo"
                      className="hidden h-40 w-40 object-contain dark:block"
                    />
                    <img
                      src="/logo_light.png"
                      alt="Logo"
                      className="block h-40 w-40 object-contain dark:hidden"
                    />
                  </div>
                  <h1 className="mb-4 text-4xl font-light">
                    Welcome back, {user?.email?.split('@')[0] || 'there'}!
                  </h1>
                  <p className="text-muted-foreground">How can InnoIgniterAI help you today?</p>
                </div>
              )}
              <div className="space-y-6 py-6">
                {currentMessages.map((message, index) => (
                  <div key={index} className="message-enter flex space-x-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback
                        className={message.role === 'user' ? 'bg-blue-500' : 'bg-foreground'}
                      >
                        {message.role === 'user' ? (
                          <User className="h-4 w-4 text-white" />
                        ) : (
                          <Bot className="text-background h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-5">
                      <div className="overflow-x-auto">
                        {message.reasoning && (
                          <div className="mb-3 max-w-3xl rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Reasoning:
                            </h4>
                            <ReactMarkdown
                              remarkPlugins={[remarkMath, remarkGfm]}
                              rehypePlugins={[rehypeKatex]}
                              components={{
                                p: ({ ...props }) => (
                                  <p
                                    className="mb-2 leading-relaxed text-gray-600 dark:text-gray-400"
                                    {...props}
                                  />
                                ),
                              }}
                            >
                              {typeof message.reasoning === 'string' ? message.reasoning : ''}
                            </ReactMarkdown>
                          </div>
                        )}

                        <div className="max-w-3xl">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath, remarkGfm]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              h1: ({ ...props }) => (
                                <h5
                                  className="my-2 mt-4 mb-2 text-2xl font-semibold text-slate-800 dark:text-gray-200"
                                  {...props}
                                />
                              ),
                              h2: ({ ...props }) => (
                                <h5
                                  className="my-2 mt-4 mb-2 text-xl font-semibold text-slate-800 dark:text-gray-200"
                                  {...props}
                                />
                              ),
                              h3: ({ ...props }) => (
                                <h5
                                  className="my-2 mt-4 mb-2 text-lg font-semibold text-slate-800 dark:text-gray-200"
                                  {...props}
                                />
                              ),
                              strong: ({ ...props }) => (
                                <strong className="font-semibold" {...props} />
                              ),
                              hr: ({ ...props }) => (
                                <div className="relative my-8">
                                  <hr className="border-gray-300 dark:border-gray-600" {...props} />
                                </div>
                              ),
                              code({ inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                  <div className="relative my-4 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                                    <div className="flex items-center justify-between bg-gray-100 px-3 py-1 text-sm text-black dark:bg-gray-800 dark:text-gray-100">
                                      <span>{match[1]}</span>
                                      <button
                                        className="rounded bg-transparent px-2 py-1 text-xs text-black hover:bg-gray-900 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                        onClick={() => {
                                          navigator.clipboard.writeText(String(children).trim());
                                        }}
                                      >
                                        Copy
                                      </button>
                                    </div>
                                    <SyntaxHighlighter
                                      style={oneDark}
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    >
                                      {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code
                                    className="rounded bg-green-100 px-1 py-0.5 text-sm font-semibold italic dark:bg-gray-700"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                              table: ({ ...props }) => (
                                <table
                                  className="min-w-full overflow-hidden rounded-md border border-gray-300 dark:border-gray-600"
                                  {...props}
                                />
                              ),
                              th: ({ ...props }) => (
                                <th
                                  className="border-b border-gray-300 bg-white px-4 py-2 text-left font-medium dark:border-gray-600 dark:bg-gray-800"
                                  {...props}
                                />
                              ),
                              td: ({ ...props }) => (
                                <td
                                  className="border-b border-gray-300 px-4 py-2 dark:border-gray-700"
                                  {...props}
                                />
                              ),
                              tr: ({ ...props }) => (
                                <tr
                                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-700 dark:even:bg-gray-700"
                                  {...props}
                                />
                              ),
                              p: ({ ...props }) => (
                                <p
                                  className="mb-2 leading-loose text-gray-800 dark:text-gray-200"
                                  {...props}
                                />
                              ),
                              li: ({ ...props }) => (
                                <li
                                  className="mb-1 ml-6 list-disc leading-loose text-gray-800 dark:text-gray-200"
                                  {...props}
                                />
                              ),
                            }}
                          >
                            {typeof message.content === 'string'
                              ? message.content.replace(/\[([^\]]+)\]/g, (_, math) => `$$${math}$$`)
                              : ''}
                          </ReactMarkdown>
                          {copiedIds[message.id] ? (
                            <Button variant="ghost" size="sm" className={'cursor-pointer'}>
                              <Check className="h-4 w-4 text-gray-600" />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleCopy(message.content, message.id)}
                              variant="ghost"
                              size="sm"
                              className={'cursor-pointer'}
                            >
                              <Copy className="h-4 w-4 text-gray-600" />
                            </Button>
                          )}

                          {speakIds[message.id] ? (
                            <Button
                              variant={'ghost'}
                              onClick={() => stopSpeak(message.id)}
                              className="rounded-lg p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              <CirclePause className={`h-5 w-5`} />
                            </Button>
                          ) : (
                            <Button
                              variant={'ghost'}
                              onClick={() => handleSpeak(message.content, message.id)}
                              className="rounded-lg p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              {/* <SpeakerWaveIcon className={`h-5 w-5`} /> */}
                              <AudioLines />
                            </Button>
                          )}
                        </div>
                        {message.imageUrl && (
                          <div className="h-64 w-64">
                            <img
                              src={message.imageUrl}
                              alt={"User's image"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex space-x-4">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-foreground">
                        <Bot className="text-background h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-1">
                        <p className="text-muted-foreground text-sm">
                          {workingStep ? workingStep : 'Processing'}
                          <span className="animate-pulse pl-1 text-2xl">...</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* <div ref={messagesEndRef} /> */}
          </ScrollArea>

          <div className="p-4 py-0">
            <div className="mx-auto max-w-3xl">
              <div className="mb-2 flex h-15 gap-2 px-2">
                {virusFile && (
                  <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border">
                    {getFileIcon(virusFile)}
                    <button
                      type="button"
                      onClick={() => setVirusFile(null)}
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 hover:bg-black"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}

                {files && (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                    <img
                      src={URL.createObjectURL(files)}
                      alt={files.name}
                      className={`h-full w-full object-cover transition-all duration-500 ${uploadProgress < 100 ? 'opacity-50 blur-sm' : 'blur-0 opacity-100'}`}
                    />

                    {uploadProgress < 100 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-xs text-white">
                        {uploadProgress}%
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setFiles(null)}
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 hover:bg-black"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="bg-background flex items-center space-x-2 rounded-xl border px-4 py-3"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={imageFileUpload}
                  className="hidden"
                  id="file-upload"
                />

                <input
                  type="file"
                  accept=""
                  multiple
                  onChange={(e) => {
                    setVirusFile(e.target.files[0]);
                    handleVirusFileUpload(e.target.files[0]);
                  }}
                  className="hidden"
                  id="virus-upload"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="h-4 w-4 rounded-full p-0">
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      Image Upload
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => document.getElementById('virus-upload').click()}
                    >
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      File Upload
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`rounded-4xl ${
                    reasoning ? 'bg-gray-900 text-white dark:bg-slate-800' : ''
                  }`}
                  onClick={() => {
                    toggleReasoning();
                  }}
                >
                  <div className={`} flex cursor-pointer items-center justify-center space-x-1`}>
                    <Lightbulb className="h-4 w-4" />
                    <span className="text-xs">Reasoning</span>
                  </div>
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="placeholder:text-muted-foreground flex-1 border-0 bg-transparent text-base focus-visible:ring-0"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0"
                  onClick={() => {
                    router.push('/voice');
                  }}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={(!input.trim() && files) || isLoading}
                  className="h-8 w-8 rounded-full p-0"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
