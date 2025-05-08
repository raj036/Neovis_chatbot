import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { PiNumberCircleZeroFill } from "react-icons/pi";
import { GrSend } from "react-icons/gr";
import { IoArrowBack } from "react-icons/io5";
import axios from "../helper/Axios";

interface Message {
  sender: "User" | "AI";
  text: string;
  timestamp: string;
}

interface UserChatWindowProps {
  initialSessionId?: string;
  initialUserName?: string;
  onBack?: () => void;
}

const UserChatWindow: React.FC<UserChatWindowProps> = ({
  initialSessionId,
  initialUserName = "Guest User",
  onBack,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(
    initialSessionId || null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSessionId) {
      loadPreviousMessages(initialSessionId);
    }
  }, [initialSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadPreviousMessages = async (id: string) => {
    try {
      setLoading(true);
      // const response = await axios.get(`/Guest_user/chat/history/${id}`);
      // if (response.data && response.data.messages) {
      //   setMessages(response.data.messages.map((msg: any) => ({
      //     sender: msg.role === "user" ? "User" : "AI",
      //     text: msg.content,
      //     timestamp: msg.timestamp
      //   })));
      // }
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load conversation history.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string | undefined): string => {
    if (!timestamp) return "";
    try {
      const date = new Date(timestamp);
      return isNaN(date.getTime())
        ? ""
        : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const sendMessage = async () => {
    if (!userInput.trim() || loading) return;

    const timestamp = new Date().toISOString();
    const userMessage: Message = {
      sender: "User",
      text: userInput.trim(),
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await axios.post<any>(
        `Guest_user/chat/guest`,
        {},
        {
          params: {
            user_input: userInput.trim(),
            session_id: sessionId || undefined,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponse =
        response.data["AI Response: "] ||
        "Could you please clarify your question.";
      const newSessionId = response.data["session_id"];

      const botMessage: Message = {
        sender: "AI",
        text: aiResponse.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);

      if (!sessionId && newSessionId) {
        setSessionId(newSessionId);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "AI",
          text:
            "Sorry, there was an error processing your message. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header - Fixed at top */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="mr-2 text-gray-600 hover:text-gray-800"
            >
              <IoArrowBack className="w-5 h-5" />
            </button>
          )}
          <FaUserCircle className="w-10 h-10 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900 text-base">
              {initialUserName}
            </div>
            <div className="text-sm text-green-500">Online</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <PiNumberCircleZeroFill className="w-5 h-5 text-gray-500" />
          <HiOutlineDotsVertical className="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>
      </div>

      {/* Messages - Scrollable area with padding for input box at bottom */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto bg-gray-50 p-4 pb-24"
        style={{ height: "calc(100% - 68px)", marginBottom: "68px" }}
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center  text-gray-400 text-sm">
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
                    msg.sender === "AI"
                      ? "bg-white text-gray-900"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-xs block mt-1 ${
                      msg.sender === "AI"
                        ? "text-gray-500"
                        : "text-blue-100 text-right"
                    }`}
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

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 border-l-4 border-red-500 p-3 mx-4 absolute bottom-20 left-0 right-0 z-20">
          <div className="flex justify-between items-center">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input Bar - Fixed at bottom */}
      <div className="border-t border-gray-200 p-4 bg-white shadow-lg fixed bottom-0 left-0 right-0 z-10">
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
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300"
            } text-white p-3 rounded-md transition-colors duration-200`}
            onClick={sendMessage}
            disabled={!userInput.trim()}
          >
            <GrSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChatWindow;