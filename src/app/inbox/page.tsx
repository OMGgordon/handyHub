"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "next/navigation";
import {
  Paperclip,
  Mic,
  Send,
  Star,
  ChevronLeft,
  X,
  SendHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";
import UploadDropzone from "@/components/UploadDropzone";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/context/SessionProvider";
import { useUserContext } from "@/context/UserContext";

// Types
interface Message {
  id: string;
  content: string;
  media_url: string; // for image/file uploads
  media_type: "text" | "image" | "file" | "video";
  timestamp: string;
  is_from_user: boolean;
  avatar: string;
  sender_id: string;
}

interface Conversation {
  id: string;
  provider_name: string;
  provider_avatar?: string;
  provider_id: string;
  rating: number;
  review_count: number;
  last_message: string;
  timestamp: string;
  project_title: string;
  messages: Message[];
  client_id: string;
  project_id: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  client_id: string;
  provider_id: string;
  status: string;
  service_category: string;
  service_type: string;
  location: string;
  uploaded_files: string[];
  min_budget: number;
  max_budget: number;
  created_at: string;
  date: string[]; // adjust if this is really an array of timestamps
}

interface MessageProp {
  job?: Project;
}

const MessagingPage = () => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  //   const [mediaUpload, setMediaUpload] = useState();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);

  const { getClientById, getProviderById } = useUserContext();

  const { session } = useSession();
  const userId = session?.user?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  useEffect(() => {
    if (conversationId && conversations.length > 0) {
      const found = conversations.find((c) => c.id === conversationId);
      if (found) setSelectedConversation(found);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select("*, messages(*)");

      if (error) {
        console.error(error);
      } else {
        const normalized = (data as any).map((conv: any) => ({
          ...conv,
          messages: conv.messages.map((m: any) => ({
            id: m.id,
            content: m.content,
            media_url: m.media_url,
            media_type: m.media_type,
            timestamp: m.timestamp,
            is_from_user: m.is_from_user,
            sender_id: m.sender_id,
            avatar: conv.provider_avatar || "",
          })),
        }));

        setConversations(normalized);
      }
    };

    fetchConversations();
  }, []);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation]);

  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  //   const handleSendMessage = () => {
  //     if (!newMessage.trim() && files.length === 0) return;

  //     const messages: Message[] = [];

  //     // Handle text message
  //     if (newMessage.trim()) {
  //       messages.push({
  //         id: Date.now().toString(),
  //         timestamp: new Date().toLocaleTimeString([], {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }),
  //         is_from_user: true,
  //         content: newMessage,
  //         mediaType: "text",
  //       });
  //     }

  //     // Handle multiple files
  //     if (files.length > 0) {
  //       for (const file of files) {
  //         const {
  //           data: { publicUrl },
  //         } = supabase.storage.from("uploads").getPublicUrl(data.path);

  //         // const fakeUrl = URL.createObjectURL(file);
  //         messages.push({
  //           id: Date.now().toString() + file.name, // unique per file
  //           timestamp: new Date().toLocaleTimeString([], {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           }),
  //           is_from_user: true,
  //           media_url: publicUrl,
  //           mediaType: file.type.startsWith("image") ? "image" : "file",
  //         });
  //       }
  //       setFiles([]); // clear after sending
  //     }

  //     // Add all new messages to conversation
  //     const updatedConversation = {
  //       ...selectedConversation,
  //       messages: [...selectedConversation.messages, ...messages],
  //     };

  //     console.log(messages, "messages");

  //     setSelectedConversation(updatedConversation);
  //     setNewMessage("");
  //   };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && files.length === 0) return;

    // Text messages
    if (newMessage.trim() && selectedConversation) {
      const { error } = await supabase.from("messages").insert({
        conversation_id: selectedConversation.id,
        content: newMessage,
        media_type: "text",
        is_from_user: true,
        sender_id: session?.user?.id,
      });
      if (error) console.error(error);
    }

    // File uploads
    if (files.length > 0 && selectedConversation) {
      for (const file of files) {
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, file);

        if (uploadError) {
          console.error(uploadError);
          continue;
        }

        // ✅ Get public URL
        const { data: urlData } = supabase.storage
          .from("uploads")
          .getPublicUrl(fileName);

        // console.log("urlData", urlData)

        if (!urlData?.publicUrl) continue;

        console.log("selectedConversation:", selectedConversation);
        console.log("Uploading file:", fileName);
        console.log("Public URL:", urlData?.publicUrl);
        console.log("Inserting row...");

        const { error } = await supabase.from("messages").insert({
          conversation_id: selectedConversation.id,
          media_url: urlData.publicUrl,
          media_type: file.type.startsWith("image")
            ? "image"
            : file.type.startsWith("video")
            ? "video"
            : "file",
          is_from_user: true,
          sender_id: session.user.id,
        });

        if (error) {
          console.error("Insert error:", error.message);
        } else {
          console.log("✅ Inserted successfully");
        }
      }
    }

    setNewMessage("");
    setFiles([]);
  };

  console.log(conversations, "convos");
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  useEffect(() => {
    // if (selectedConversation?.client_id) {
    //   getClientById(selectedConversation.client_id).then(setClient);
    // }

    if (selectedConversation?.provider_id) {
      getProviderById(selectedConversation.provider_id).then(setProvider);
    }
  }, [
    // selectedConversation?.client_id,
    selectedConversation?.provider_id,
    // getClientById,
    getProviderById,
  ]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedConversation) return;

      const { data: clientData, error: clientError } = await supabase
        .from("profiles") // replace with your actual table name if different
        .select("id, full_name, avatar")
        .eq("id", selectedConversation.client_id)
        .single();

      if (clientError) {
        console.error("Error fetching client:", clientError);
      } else {
        setClient(clientData);
      }
    };

    fetchUsers();
  }, [selectedConversation]);

  useEffect(() => {
    // Subscribe to realtime inserts on messages
    const channel = supabase
      .channel("messages-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("New message received:", payload.new);

          const newMessage = {
            id: payload.new.id,
            content: payload.new.content,
            media_url: payload.new.media_url,
            media_type: payload.new.media_type,
            timestamp: payload.new.timestamp,
            is_from_user: payload.new.is_from_user,
            sender_id: payload.new.sender_id,
            avatar: "", // you can attach provider avatar if needed
          };

          setConversations((prevConvs) =>
            prevConvs.map((conv) =>
              conv.id === payload.new.conversation_id
                ? { ...conv, messages: [...conv.messages, newMessage] }
                : conv
            )
          );

          // If this is the currently selected conversation, scroll to bottom
          if (selectedConversation?.id === payload.new.conversation_id) {
            setSelectedConversation((prev) =>
              prev
                ? { ...prev, messages: [...prev.messages, newMessage] }
                : prev
            );
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  const [job, setJob] = useState<Project | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!selectedConversation?.project_id) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", selectedConversation.project_id)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
      } else {
        setJob(data);
      }
    };

    fetchJob();
  }, [selectedConversation?.project_id]);

  console.log(conversations);
  console.log(
    client,
    "client",
    provider,
    "provider",
    selectedConversation?.client_id
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div>
        <Navbar />
      </div>
      <div className="flex flex-row flex-1 overflow-hidden min-h-0">
        {/* Sidebar - Conversations List */}
        <div
          className={`
                flex flex-col bg-white border-r border-gray-200
                w-full lg:w-1/3
                ${isMobileChatOpen ? "hidden lg:flex" : "flex"}
            `}
        >
          <div className="p-6 border-b border-gray-200 flex-shrink-0 ">
            <h2 className="text-2xl font-semibold text-gray-900 ">Inbox</h2>
          </div>

          {conversations.length > 0 ? (
            <div className="flex-1 overflow-y-auto min-h-0">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 m-2  border-b  border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conversation?.id
                      ? "bg-muted-foreground border-blue-200 rounded-xl "
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedConversation(conversation);
                    if (window.innerWidth < 1024) {
                      setIsMobileChatOpen(true);
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={
                          userId === selectedConversation?.client_id
                            ? conversation?.provider_avatar
                            : client?.avatar
                        }
                        alt={
                          userId === selectedConversation?.client_id
                            ? conversation?.provider_name
                            : client?.full_name
                        }
                      />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {userId === selectedConversation?.client_id && provider
                          ? provider?.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : userId === selectedConversation?.provider_id &&
                            client
                          ? client?.full_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "?"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {userId === selectedConversation?.client_id
                            ? provider?.full_name
                            : client?.full_name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {conversation?.timestamp
                            ? new Date(
                                conversation.timestamp
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              }) +
                              " " +
                              new Date(
                                conversation.timestamp
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {
                          conversation?.messages[
                            conversation?.messages.length - 1
                          ]?.content
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
        </div>

        {/* Main Chat Area */}
        {selectedConversation ? (
          <div
            className={`
                flex flex-col
                ${isMobileChatOpen ? "flex w-full" : "hidden"}  
                lg:flex lg:flex-1 lg:w-2/3                     
            `}
          >
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 ">
              <div className="flex items-center  justify-between p-4">
                <div className="flex items-center space-x-4">
                  <MoveLeft
                    onClick={() => setIsMobileChatOpen(false)}
                    className="lg:hidden flex items-center text-gray-600 hover:text-gray-900"
                  />
                  <Avatar className="w-10 h-10 ">
                    <AvatarImage
                      src={
                        userId === selectedConversation?.client_id
                          ? selectedConversation?.provider_avatar
                          : undefined
                      }
                      alt={selectedConversation?.provider_name}
                    />
                    <AvatarFallback className="bg-orange-500 text-white">
                      {userId === selectedConversation?.client_id && provider
                        ? provider.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : userId === selectedConversation?.provider_id && client
                        ? client.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "?"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {userId === selectedConversation?.client_id
                        ? provider?.full_name
                        : client?.full_name}
                    </h2>
                    {userId === selectedConversation?.client_id && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {renderStars(selectedConversation?.rating)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {selectedConversation?.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({selectedConversation?.review_count})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {userId === selectedConversation?.client_id && (
                  <div className="text-right">
                    <span
                      className="text-sm font-semibold text-primary cursor-pointer"
                      onClick={() => {
                        router.push(
                          `/ServiceProviderProfile/${selectedConversation?.provider_id}`
                        );
                      }}
                    >
                      Show Profile
                    </span>
                  </div>
                )}
              </div>
              <Separator className="w-full " />
              <div className=" flex items-center bg-muted-foreground justify-between px-4 p-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {job?.title}
                </h3>
                <span
                  onClick={() => router.push(`/job-info/${job?.id}`)}
                  className="text-sm font-semibold text-primary cursor-pointer"
                >
                  View Project
                </span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="lg:flex-1 min-h-0 overflow-y-scroll  p-4 space-y-4 bg-gray-50">
              {selectedConversation?.messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                selectedConversation?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex  ${
                      message.sender_id === session.user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end space-x-2 max-w-xs lg:max-w-md flex-row space-x `}
                    >
                      {message?.sender_id !== session?.user?.id && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar} alt="provider" />
                          <AvatarFallback className="bg-orange-500 text-white text-xs">
                            {/* If it's the provider's inbox, show client initials.
          If it's the client's inbox, show provider initials. */}
                            {userId === selectedConversation?.client_id &&
                            provider
                              ? provider.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : userId === selectedConversation?.provider_id &&
                                client
                              ? client.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className="rounded-lg p-3 bg-muted-foreground text-gray-900 border border-gray-200
                      "
                      >
                        {message.media_type !== "text" && (
                          <Image
                            src={"/media.png"}
                            width={24}
                            height={24}
                            alt="media file"
                          />
                        )}
                        <p className="text-sm whitespace-pre-line">
                          {message.media_type === "text"
                            ? message.content
                            : message.media_type}
                        </p>
                        <span
                          className="text-xs mt-1 
                      flex
                      text-gray-500 items-end justify-end
                        "
                        >
                          {message?.timestamp
                            ? formatDistanceToNow(new Date(message.timestamp), {
                                addSuffix: true,
                              })
                            : ""}
                        </span>
                      </div>

                      {message.sender_id === session.user.id && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-orange-500 text-white text-xs">
                            You
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => setOpenUpload(true)}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Message*"
                    className="pr-20 resize-none"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Mic className="w-5 h-5" />
                </Button>

                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`
    hidden lg:flex text-center items-center flex-1 self-center justify-center
    text-gray-500 mt-8
  `}
          >
            <p>Start a conversation</p>
          </div>
        )}

        {openUpload && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-[90%]">
              <div className="flex justify-end mt-4">
                <X
                  onClick={() => {
                    setOpenUpload(false);
                    // setMediaUpload(null);
                  }}
                />
              </div>
              <UploadDropzone onFilesChange={handleFilesChange} />
              {files.length > 0 && (
                <div
                  className="flex justify-end mt-4"
                  onClick={() => {
                    // setNewMessage(mediaUpload);
                    handleSendMessage();
                    setOpenUpload(false);
                  }}
                >
                  <SendHorizontal />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
