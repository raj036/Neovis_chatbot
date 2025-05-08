import React, {
  useState,
  useEffect,
  useRef,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import Sidebar from "./Sidebar";
import { FaFilter } from "react-icons/fa6";
import { IoIosMore } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoIosStarOutline } from "react-icons/io";
import { MdPersonAddAlt1 } from "react-icons/md";
import { FaPaperclip } from "react-icons/fa6";
import { GrSend } from "react-icons/gr";
import { PiNumberCircleZeroFill } from "react-icons/pi";
import { FiPlusCircle } from "react-icons/fi";
import { MdRefresh } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import axios from "../helper/Axios";

// Type definitions
interface Message {
  sender: "User" | "AI";
  text: string;
  timestamp: string;
}

interface Chat {
  id: string;
  lastMessage: string;
  timestamp: string;
  status: "Urgent" | "Open" | "Closed" | string;
  userName?: string;
}

interface ChatListItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

interface ChatWindowProps {
  messages: Message[];
  userInput: string;
  setUserInput: (input: string) => void;
  sendMessage: () => void;
  loading: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
  userName?: string;
}

interface User {
  user_id: string;
  session_id: string;
}

interface AllMessageProps {
  initialSessionId?: undefined;
  initialUserName?: string;
  onBack?: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  chat,
  isActive,
  onClick,
}) => {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Today";
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Urgent":
        return "bg-red-100 text-red-600";
      case "Open":
        return "bg-blue-100 text-blue-600";
      case "Closed":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <div
      className={`flex items-center p-4 cursor-pointer rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm"
          : "hover:bg-gray-50 border-l-4 border-transparent"
      } mb-2`}
      onClick={onClick}
    >
      <div className="relative">
        <FaUserCircle className="w-12 h-12 text-gray-400" />
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white`}
        ></div>
      </div>
      <div className="flex-grow ml-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            {chat.userName || "Guest User"}
          </h3>
          <span className="text-xs text-gray-500">
            {formatDate(chat.timestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600 truncate mt-1 max-w-[200px]">
          {chat.lastMessage || "Start a new conversation"}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            {chat.status === "Urgent" && (
              <span className="bg-red-100 text-red-600 rounded-full px-2 py-0.5 text-xs mr-2 font-medium">
                Urgent
              </span>
            )}
            <button className="text-gray-400 hover:text-yellow-500 transition-colors">
              <IoIosStarOutline className="text-lg" />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors ml-2">
              <MdPersonAddAlt1 className="text-lg" />
            </button>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
              chat.status
            )}`}
          >
            {chat.status || "Open"}
          </span>
        </div>
      </div>
      <button className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors">
        <HiOutlineDotsVertical className="text-gray-500" />
      </button>
    </div>
  );
};

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  userInput,
  setUserInput,
  sendMessage,
  loading,
  onBack,
  showBackButton,
  userName = "Guest User",
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string | undefined): string => {
    if (!timestamp) {
      return "";
    }

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "";
      }
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "";
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        {showBackButton && (
          <button
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
          >
            <IoArrowBack className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="relative">
          <FaUserCircle className="w-12 h-12 text-gray-400" />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white`}
          ></div>
        </div>
        <div className="flex-grow ml-3">
          <h3 className="font-semibold text-lg text-gray-800">{userName}</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="border rounded-full p-1">
            <PiNumberCircleZeroFill className="w-5 h-5 text-gray-500" />
          </div>
          <button className="text-gray-600 hover:text-blue-600">
            <HiOutlineDotsVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Start a new conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "AI" ? "" : "justify-end"}`}
              >
                {msg.sender === "AI" && (
                  <FaUserCircle className="w-8 h-8 mr-3 mt-1 text-gray-400 flex-shrink-0" />
                )}
                <div
                  className={`p-3 rounded-lg shadow-sm max-w-xs md:max-w-md ${
                    msg.sender === "AI" ? "bg-white" : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-xs ${
                      msg.sender === "AI" ? "text-gray-500" : "text-blue-100"
                    } mt-1 block ${msg.sender === "AI" ? "" : "text-right"}`}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex">
                <FaUserCircle className="w-8 h-8 mr-3 text-gray-400" />
                <div className="p-3 rounded-lg shadow-sm max-w-xs bg-white">
                  <p className="text-gray-500">Typing...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            onKeyPress={handleKeyPress}
          />
          <button
            className={`${
              userInput.trim()
                ? "bg-blue-500 cursor-pointer hover:bg-blue-600"
                : "bg-gray-300"
            } 
                        text-white px-4 py-3 rounded-md transition-colors duration-200`}
            onClick={sendMessage}
            disabled={!userInput.trim()}
          >
            <GrSend
              className={userInput.trim() ? "filter-none" : "filter grayscale "}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

const AllMessage: React.FC<AllMessageProps> = ({
  initialSessionId,
  initialUserName,
  onBack,
}) => {
  const [chatList, setChatList] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(
    initialSessionId || null
  );
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessionId || null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showChatList, setShowChatList] = useState<boolean>(
    initialSessionId ? false : true
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [currentUserName, setCurrentUserName] = useState<string | undefined>(
    initialUserName || "Guest User"
  );

  // Load session data if initialSessionId is provided
  useEffect(() => {
    if (initialSessionId) {
      loadChatFromStorage(initialSessionId, initialUserName);
    }
  }, [initialSessionId, initialUserName]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
        if (!initialSessionId) {
          setShowChatList(true);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialSessionId]);

  const handleFilterStatus = (status: string): void => {
    setFilterStatus(status);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const loadChatFromStorage = (id: string, userName?: string): void => {
    if (!id) return;

    setActiveSessionId(id);
    setMessages([]);

    if (userName) {
      setCurrentUserName(userName);
    }

    // Here you would fetch previous messages if needed
    // Example: fetchPreviousMessages(id);

    if (isMobile) {
      setShowChatList(false);
    }
  };

  const updateChatListItem = (
    id: string,
    lastMessage: string,
    timestamp: string | null = null
  ): void => {
    setChatList((prevList) => {
      const updatedList = [...prevList];
      const index = updatedList.findIndex((chat) => chat.id === id);

      if (index !== -1) {
        updatedList[index] = {
          ...updatedList[index],
          lastMessage,
          timestamp: timestamp || new Date().toISOString(),
        };
      }

      return updatedList;
    });
  };

  const createNewChat = (): void => {
    setActiveSessionId(null);
    setMessages([]);
    setUserInput("");
    setCurrentUserName("Guest User");
  };

  const sendMessage = async (): Promise<void> => {
    if (!userInput.trim() || loading) return;

    const timestamp = new Date().toISOString();
    const userMessage: Message = {
      sender: "User",
      text: userInput.trim(),
      timestamp: timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const currentInput = userInput.trim();
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post<any>(
        `Guest_user/chat/guest`,
        {},
        {
          params: {
            user_input: currentInput,
            session_id: activeSessionId || undefined,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resp = response.data;

      const userWantsCustomerCare = /connect.*customer\s*care/i.test(
        currentInput
      );

      // Use the backend response or override it based on user input
      const aiResponse = userWantsCustomerCare
        ? resp
        : response.data["AI Response: "] ||
          "Could you please clarify your question.";

      const newSessionId = response.data["session_id"];

      const responseTimestamp = new Date().toISOString();

      const botMessage: Message = {
        sender: "AI",
        text: aiResponse.trim(),
        timestamp: responseTimestamp,
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);

      if (!activeSessionId && newSessionId) {
        setSessionId(newSessionId);
        setActiveSessionId(newSessionId);

        // Show chat window immediately after first message
        if (isMobile) {
          setShowChatList(false);
        }

        const newChat: Chat = {
          id: newSessionId,
          lastMessage: aiResponse,
          timestamp: responseTimestamp,
          status: "Open",
          userName: currentUserName,
        };

        setChatList((prevList) => [newChat, ...prevList]);
      } else if (activeSessionId) {
        updateChatListItem(activeSessionId, aiResponse, responseTimestamp);
      }
    } catch (err) {
      console.error("Error sending message:", err);

      const errorTimestamp = new Date().toISOString();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "AI",
          text: "Sorry, there was an error processing your message. Please try again.",
          timestamp: errorTimestamp,
        },
      ]);

      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load messages when activeSessionId changes
  useEffect(() => {
    const loadMessagesForSession = async () => {
      if (activeSessionId) {
        try {
          setLoading(true);
          // You would implement this endpoint in your backend
          const response = await axios.get(
            `/Guest_user/chat/history/${activeSessionId}`
          );
          if (response.data && response.data.messages) {
            setMessages(
              response.data.messages.map((msg: any) => ({
                sender: msg.role === "user" ? "User" : "AI",
                text: msg.content,
                timestamp: msg.timestamp,
              }))
            );
          }
        } catch (err) {
          console.error("Error loading messages:", err);
          setError("Failed to load conversation history.");
        } finally {
          setLoading(false);
        }
      }
    };

    // Uncomment this when you have the API endpoint ready
    // loadMessagesForSession();

    // For now, we'll just reset messages when switching chats
    if (
      activeSessionId &&
      initialSessionId &&
      activeSessionId !== initialSessionId
    ) {
      setMessages([]);
    }
  }, [activeSessionId, initialSessionId]);

  const filteredChats = chatList.filter((chat) => {
    const matchesSearch =
      !searchQuery ||
      (chat.lastMessage &&
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (chat.userName &&
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === "all" || chat.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleBackToChatList = () => {
    if (onBack) {
      onBack();
    } else {
      setShowChatList(true);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Sidebar Toggle */}
      {isMobile && !showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed top-4 left-4 z-20 p-2 bg-white rounded-md shadow-md md:hidden"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          setFilterStatus={handleFilterStatus}
          filterStatus={filterStatus}
          onClose={() => setShowSidebar(false)}
          isMobile={isMobile}
        />
      )}

      <div className="flex flex-grow md:ml-64 w-full">
        {/* Chat List Column - shown on desktop or when showChatList is true on mobile */}
        {(showChatList || !isMobile) && !initialSessionId && (
          <div
            className={`${
              isMobile ? "w-full absolute z-10 bg-white h-full" : "w-1/3"
            } bg-white overflow-hidden flex flex-col shadow-lg`}
          >
            {/* Header with Search and Filter */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                {isMobile && (
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FiMenu className="w-5 h-5" />
                  </button>
                )}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  />
                  <IoSearchSharp className="absolute text-xl left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery("")}
                    >
                      ✕
                    </button>
                  )}
                </div>
                <button className="p-2 border-1 border-gray-200 rounded flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer hover:bg-gray-200">
                  <FaFilter />
                  <span className="hidden md:inline">Filter</span>
                </button>
              </div>

              {/* Filter buttons */}
              <div className="flex items-center mt-3 space-x-2 overflow-x-auto pb-2">
                <button
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === "Urgent"
                      ? "bg-red-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } whitespace-nowrap`}
                  onClick={() => handleFilterStatus("Urgent")}
                >
                  Urgent
                </button>
                <button
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === "Open"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } whitespace-nowrap`}
                  onClick={() => handleFilterStatus("Open")}
                >
                  Open
                </button>
                <button
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === "Closed"
                      ? "bg-gray-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } whitespace-nowrap`}
                  onClick={() => handleFilterStatus("Closed")}
                >
                  Closed
                </button>
                {/* <button
                  className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${filterStatus === 'all' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                    } whitespace-nowrap`}
                  onClick={() => handleFilterStatus('all')}
                >
                  All
                </button> */}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-grow overflow-y-auto">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border-l-4 border-red-500 mx-3 mb-2 rounded-r-md">
                  <p className="flex items-center">
                    <span>{error}</span>
                    <button
                      className="ml-auto text-gray-500 hover:text-red-700"
                      onClick={() => setError(null)}
                    >
                      ✕
                    </button>
                  </p>
                </div>
              )}

              <div className="p-3">
                {/* <button
                  onClick={createNewChat}
                  className="w-full p-3 mb-3 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FiPlusCircle className="mr-2" />
                  New Chat
                </button> */}

                {filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <ChatListItem
                      key={chat.id}
                      chat={chat}
                      isActive={chat.id === activeSessionId}
                      onClick={() =>
                        loadChatFromStorage(chat.id, chat.userName)
                      }
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <IoIosMore className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="font-medium">No conversations found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchQuery
                          ? "Try different search terms"
                          : "Start a new conversation"}
                      </p>
                      {searchQuery && (
                        <button
                          className="mt-4 text-blue-500 flex items-center px-3 py-2 bg-blue-50 rounded-md"
                          onClick={() => setSearchQuery("")}
                        >
                          <MdRefresh className="mr-1" /> Clear search
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Window Column - shown on desktop or when showChatList is false on mobile */}
        {(!showChatList || !isMobile || initialSessionId) && (
          <div className={`${isMobile ? "w-full" : "flex-grow"}`}>
            <ChatWindow
              messages={messages}
              userInput={userInput}
              setUserInput={setUserInput}
              sendMessage={sendMessage}
              loading={loading}
              onBack={handleBackToChatList}
              showBackButton={isMobile && !initialSessionId}
              userName={currentUserName}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMessage;
