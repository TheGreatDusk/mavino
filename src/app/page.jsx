"use client";
import React from "react";
import * as Recharts from "recharts";
import * as ReactGoogleMaps from "@/libraries/react-google-maps";
import * as ChakraUI from "@chakra-ui/react";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";
import * as PDFParser from "@/libraries/pdf-parser";
import * as MarkdownRenderer from "@/libraries/markdown-renderer";

const NEXT_PUBLIC_GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function MainComponent() {
  const [messages, setMessages] = React.useState([]);
  const [inputText, setInputText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("");
  const [error, setError] = React.useState(null);
  const [chatHistory, setChatHistory] = React.useState([]);
  const [currentChatId, setCurrentChatId] = React.useState(null);
  const [selectedModel, setSelectedModel] = React.useState("claude-3.5-sonnet");
  const [showAllIntegrations, setShowAllIntegrations] = React.useState(false);
  const [showIntegrationsModal, setShowIntegrationsModal] =
    React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  const integrations = [
    {
      name: "Stable Diffusion V3",
      icon: "fas fa-palette",
      action: "generating...",
      category: "AI Generation",
    },
    {
      name: "DALL-E 3",
      icon: "fas fa-image",
      action: "creating...",
      category: "AI Generation",
    },
    {
      name: "Google Translate",
      icon: "fas fa-language",
      action: "translating...",
      category: "Language",
    },
    {
      name: "Google Search",
      icon: "fas fa-search",
      action: "searching...",
      category: "Search",
    },
    {
      name: "Image Search",
      icon: "fas fa-camera",
      action: "looking...",
      category: "Search",
    },
    {
      name: "Google Places",
      icon: "fas fa-map-marker-alt",
      action: "locating...",
      category: "Location",
    },
    {
      name: "Local Business Data",
      icon: "fas fa-building",
      action: "investing...",
      category: "Business",
    },
    {
      name: "Email Check",
      icon: "fas fa-envelope-open-text",
      action: "verifying...",
      category: "Utilities",
    },
    {
      name: "Domain Whois",
      icon: "fas fa-globe",
      action: "researching...",
      category: "Web",
    },
    {
      name: "Text to Speech",
      icon: "fas fa-volume-up",
      action: "speaking...",
      category: "Audio",
    },
    {
      name: "Weather",
      icon: "fas fa-cloud-sun",
      action: "watching...",
      category: "Data",
    },
    {
      name: "Web Scraping",
      icon: "fas fa-spider",
      action: "scraping...",
      category: "Web",
    },
    {
      name: "PDF Generation",
      icon: "fas fa-file-pdf",
      action: "writing...",
      category: "Documents",
    },
    {
      name: "QR Code",
      icon: "fas fa-qrcode",
      action: "scanning...",
      category: "Utilities",
    },
    {
      name: "Audio Transcribe",
      icon: "fas fa-microphone",
      action: "listening...",
      category: "Audio",
    },
    {
      name: "GPT Vision",
      icon: "fas fa-eye",
      action: "looking...",
      category: "AI Analysis",
    },
    {
      name: "File Converter",
      icon: "fas fa-exchange-alt",
      action: "converting...",
      category: "Utilities",
    },
    {
      name: "Sales Tax",
      icon: "fas fa-calculator",
      action: "taxing...",
      category: "Finance",
    },
    {
      name: "Product Search",
      icon: "fas fa-shopping-cart",
      action: "selling...",
      category: "E-commerce",
    },
    {
      name: "Text Moderation",
      icon: "fas fa-shield-alt",
      action: "checking...",
      category: "Security",
    },
    {
      name: "SEO Research",
      icon: "fas fa-chart-line",
      action: "optimizing...",
      category: "Marketing",
    },
    {
      name: "Book Search",
      icon: "fas fa-book",
      action: "reading...",
      category: "Education",
    },
    {
      name: "Basketball",
      icon: "fas fa-basketball-ball",
      action: "playing...",
      category: "Sports",
    },
    {
      name: "Movies & TV",
      icon: "fas fa-film",
      action: "watching...",
      category: "Entertainment",
    },
    {
      name: "Anime & Manga",
      icon: "fas fa-dragon",
      action: "enjoying...",
      category: "Entertainment",
    },
    {
      name: "Code Runner",
      icon: "fas fa-code",
      action: "coding...",
      category: "Development",
    },
    {
      name: "Charts",
      icon: "fas fa-chart-bar",
      action: "graphing...",
      category: "Data",
    },
    {
      name: "Chakra UI",
      icon: "fas fa-magic",
      action: "designing...",
      category: "Development",
    },
    {
      name: "Google Maps",
      icon: "fas fa-map",
      action: "mapping...",
      category: "Location",
    },
    {
      name: "Shadcn UI",
      icon: "fas fa-paint-brush",
      action: "designing...",
      category: "Development",
    },
    {
      name: "PDF Parser",
      icon: "fas fa-file-alt",
      action: "converting...",
      category: "Documents",
    },
    {
      name: "Markdown Renderer",
      icon: "fas fa-markdown",
      action: "rendering...",
      category: "Development",
    },
  ];

  const aiModels = [
    {
      id: "claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet",
      icon: "fas fa-brain",
    },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", icon: "fas fa-bolt" },
    {
      id: "claude-3-opus",
      name: "Claude 3 Opus",
      icon: "fas fa-theater-masks",
    },
  ];

  // Check for mobile on mount and resize
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load chat history from localStorage on component mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem("mavinoai-chat-history");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setChatHistory(parsedHistory);

      // Load the most recent chat if available
      if (parsedHistory.length > 0) {
        const mostRecent = parsedHistory[0];
        setCurrentChatId(mostRecent.id);
        setMessages(mostRecent.messages);
      }
    } else {
      // Create initial welcome chat
      createNewChat();
    }
  }, []);

  // Save to localStorage whenever chat history changes
  React.useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem(
        "mavinoai-chat-history",
        JSON.stringify(chatHistory)
      );
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateChatTitle = (aiResponse) => {
    // Extract key words and create a concise title
    const words = aiResponse.toLowerCase().split(" ");
    const stopWords = [
      "the",
      "a",
      "an",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "i",
      "you",
      "we",
      "they",
      "it",
      "this",
      "that",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "can",
      "may",
      "might",
    ];

    const meaningfulWords = words
      .filter(
        (word) =>
          word.length > 2 &&
          !stopWords.includes(word) &&
          /^[a-zA-Z]+$/.test(word)
      )
      .slice(0, 3);

    if (meaningfulWords.length === 0) {
      return "AI Response";
    }

    // Capitalize first letter of each word
    const title = meaningfulWords
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return title.length > 25 ? title.slice(0, 25) + "..." : title;
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const welcomeMessage = {
      id: 1,
      text: "Hello! I'm MavinoAI, your advanced AI assistant with access to 30+ powerful integrations. How can I help you today?",
      sender: "ai",
      timestamp: new Date().toLocaleTimeString(),
    };

    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [welcomeMessage],
      createdAt: new Date().toISOString(),
    };

    setChatHistory((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    setMessages([welcomeMessage]);
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));

    // If we're deleting the current chat, switch to another or create new
    if (currentChatId === chatId) {
      const remainingChats = chatHistory.filter((chat) => chat.id !== chatId);
      if (remainingChats.length > 0) {
        const nextChat = remainingChats[0];
        setCurrentChatId(nextChat.id);
        setMessages(nextChat.messages);
      } else {
        createNewChat();
      }
    }
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  const updateCurrentChat = (newMessages) => {
    if (!currentChatId) return;

    setChatHistory((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          const updatedChat = { ...chat, messages: newMessages };
          // Update title based on first AI response
          if (newMessages.length >= 2 && chat.title === "New Chat") {
            const firstAiMessage = newMessages.find(
              (m) => m.sender === "ai" && m.id !== 1
            );
            if (firstAiMessage) {
              updatedChat.title = generateChatTitle(firstAiMessage.text);
            }
          }
          return updatedChat;
        }
        return chat;
      })
    );
  };

  const simulateLoadingStates = async (message) => {
    // Always start with thinking
    setLoadingText("thinking...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Determine which integration might be used based on message content
    const lowerMessage = message.toLowerCase();
    let selectedIntegration = null;

    if (
      lowerMessage.includes("image") ||
      lowerMessage.includes("picture") ||
      lowerMessage.includes("generate") ||
      lowerMessage.includes("create")
    ) {
      selectedIntegration = integrations.find(
        (i) => i.name.includes("Stable Diffusion") || i.name.includes("DALL-E")
      );
    } else if (lowerMessage.includes("translate")) {
      selectedIntegration = integrations.find((i) =>
        i.name.includes("Translate")
      );
    } else if (
      lowerMessage.includes("search") ||
      lowerMessage.includes("find")
    ) {
      selectedIntegration = integrations.find((i) =>
        i.name.includes("Google Search")
      );
    } else if (lowerMessage.includes("weather")) {
      selectedIntegration = integrations.find((i) =>
        i.name.includes("Weather")
      );
    } else if (
      lowerMessage.includes("code") ||
      lowerMessage.includes("program")
    ) {
      selectedIntegration = integrations.find((i) =>
        i.name.includes("Code Runner")
      );
    }

    if (selectedIntegration) {
      setLoadingText(selectedIntegration.action);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    updateCurrentChat(newMessages);
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      await simulateLoadingStates(inputText);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const aiMessage = {
        id: Date.now() + 1,
        text: data.response,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      updateCurrentChat(finalMessages);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Sorry, I encountered an error. Please try again.");

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      updateCurrentChat(finalMessages);
    } finally {
      setIsLoading(false);
      setLoadingText("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 font-inter flex bg-fixed">
      {/* Integrations Modal */}
      {showIntegrationsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-white/20 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                <h2 className="text-xl font-bold text-white">
                  All Integrations
                </h2>
                <span className="text-white/60 text-sm">
                  ({integrations.length} available)
                </span>
              </div>
              <button
                onClick={() => setShowIntegrationsModal(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedIntegrations).map(
                  ([category, categoryIntegrations]) => (
                    <div
                      key={category}
                      className="bg-white/5 rounded-xl p-4 border border-white/10"
                    >
                      <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryIntegrations.map((integration, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                              <i
                                className={`${integration.icon} text-cyan-400 text-sm`}
                              ></i>
                            </div>
                            <div>
                              <div className="text-white text-sm font-medium">
                                {integration.name}
                              </div>
                              <div className="text-white/60 text-xs">
                                {integration.action}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? (isMobile ? "w-full" : "w-80") : "w-16"} ${
          isMobile && sidebarOpen ? "fixed inset-0 z-40" : ""
        } transition-all duration-300 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col`}
      >
        {/* Fixed Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-brain text-white text-sm"></i>
                </div>
                <h2 className="text-white font-semibold">MavinoAI</h2>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <i
                className={`fas ${
                  sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
                }`}
              ></i>
            </button>
          </div>

          {sidebarOpen && (
            <button
              onClick={createNewChat}
              className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium"
            >
              <i className="fas fa-plus mr-2"></i>New Chat
            </button>
          )}
        </div>

        {/* Scrollable Chat History */}
        {sidebarOpen && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">
              Recent Chats
            </h3>
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`group relative p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  currentChatId === chat.id
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => loadChat(chat.id)}
              >
                <div className="font-medium text-sm truncate pr-6">
                  {chat.title}
                </div>
                <div className="text-xs text-white/40 mt-1">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </div>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all duration-200"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fixed Integrations Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-3">
              Integrations
            </h3>
            <div className="space-y-1">
              {integrations.slice(0, 4).map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-white/60 text-xs py-1"
                >
                  <i className={integration.icon}></i>
                  <span className="truncate">{integration.name}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowIntegrationsModal(true)}
              className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors mt-2 w-full text-left"
            >
              View All ({integrations.length})
            </button>
          </div>
        )}
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Fixed Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              {isMobile && !sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="text-white/60 hover:text-white transition-colors mr-2"
                >
                  <i className="fas fa-bars"></i>
                </button>
              )}
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-brain text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MavinoAI</h1>
                <p className="text-sm text-white/60">
                  Advanced AI with 30+ integrations
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-32">
          <div className="max-w-4xl mx-auto py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } items-start space-x-4`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 ml-4"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 mr-4"
                    }`}
                  >
                    <i
                      className={`fas ${
                        message.sender === "user" ? "fa-user" : "fa-brain"
                      } text-white`}
                    ></i>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-6 py-4 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-md shadow-lg"
                        : "bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-bl-md shadow-lg"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {message.text}
                    </p>
                    <p
                      className={`text-xs mt-3 ${
                        message.sender === "user"
                          ? "text-cyan-100"
                          : "text-white/60"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-4 max-w-[80%]">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
                    <i className="fas fa-brain text-white"></i>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md px-6 py-4 border border-white/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-white/80 text-sm font-medium">
                        {loadingText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Fixed Input Area */}
        <div className="fixed bottom-0 right-0 left-0 bg-transparent">
          <div
            className={`${
              sidebarOpen && !isMobile
                ? "ml-80"
                : sidebarOpen && isMobile
                ? "ml-0"
                : "ml-16"
            } transition-all duration-300`}
          >
            <div className="max-w-4xl mx-auto px-6 py-6">
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              )}

              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none max-h-32 text-gray-800 placeholder-gray-500 shadow-lg"
                    rows="1"
                    disabled={isLoading}
                    style={{
                      minHeight: "44px",
                      height: "auto",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 128) + "px";
                    }}
                  />
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <i className="fas fa-spinner animate-spin"></i>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}

export default MainComponent;
