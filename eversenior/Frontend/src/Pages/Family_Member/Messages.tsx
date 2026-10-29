import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Link } from "react-router-dom";
import {
  Check,
  CheckCheck,
  ChevronLeft,
  Download,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Smile,
  Video,
  X,
} from "lucide-react";
import FamilyNavbar from "./FamilyNavbar";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
};

type Message = {
  id: string;
  sender: "family" | "companion";
  text: string;
  timestamp: string;
  read?: boolean;
  attachment?: Attachment;
};

type Conversation = {
  id: string;
  companionId: string;
  companionName: string;
  seniorId: string;
  seniorName: string;
  location: string;
  online: boolean;
  rating: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
};

const initialConversations: Conversation[] = [
  {
    id: "conversation-ananya",
    companionId: "ananya",
    companionName: "Ananya",
    seniorId: "mrs-sharma",
    seniorName: "Mrs. Sharma",
    location: "Noida",
    online: true,
    rating: 4.9,
    lastMessage:
      "Looking forward to spending time with Mrs. Sharma today.",
    lastMessageTime: "9:42 AM",
    unread: 2,
    messages: [
      {
        id: "a1",
        sender: "companion",
        text: "Good morning! I hope you are doing well.",
        timestamp: "9:20 AM",
        read: true,
      },
      {
        id: "a2",
        sender: "family",
        text: "Good morning, Ananya. Thank you for checking in.",
        timestamp: "9:24 AM",
        read: true,
      },
      {
        id: "a3",
        sender: "companion",
        text: "Looking forward to spending time with Mrs. Sharma today.",
        timestamp: "9:42 AM",
        read: true,
      },
      {
        id: "a4",
        sender: "companion",
        text: "Is there anything specific she would like to do today?",
        timestamp: "9:43 AM",
        read: false,
      },
    ],
  },
  {
    id: "conversation-rajiv",
    companionId: "rajiv-mehta",
    companionName: "Rajiv Mehta",
    seniorId: "mr-saxena",
    seniorName: "Mr. Saxena",
    location: "Delhi",
    online: false,
    rating: 4.8,
    lastMessage:
      "The outing went really well. Mr. Saxena enjoyed the park.",
    lastMessageTime: "Yesterday",
    unread: 0,
    messages: [
      {
        id: "r1",
        sender: "family",
        text: "Hi Rajiv, how did the outing go yesterday?",
        timestamp: "Yesterday · 5:10 PM",
        read: true,
      },
      {
        id: "r2",
        sender: "companion",
        text: "The outing went really well. Mr. Saxena enjoyed the park.",
        timestamp: "Yesterday · 5:18 PM",
        read: true,
      },
      {
        id: "r3",
        sender: "family",
        text: "That's great to hear. Thank you!",
        timestamp: "Yesterday · 5:24 PM",
        read: true,
      },
    ],
  },
  {
    id: "conversation-megha",
    companionId: "megha-sharma",
    companionName: "Megha Sharma",
    seniorId: "mrs-sharma",
    seniorName: "Mrs. Sharma",
    location: "Noida",
    online: true,
    rating: 4.7,
    lastMessage:
      "I can also help her with the video call setup.",
    lastMessageTime: "Mon",
    unread: 0,
    messages: [
      {
        id: "m1",
        sender: "family",
        text: "Hi Megha, thank you for helping with the technology session.",
        timestamp: "Mon · 3:12 PM",
        read: true,
      },
      {
        id: "m2",
        sender: "companion",
        text: "Of course! I can also help her with the video call setup.",
        timestamp: "Mon · 3:18 PM",
        read: true,
      },
    ],
  },
];

const quickMessages = [
  "How is everything going?",
  "Thank you for the update.",
  "Please let me know when you arrive.",
  "Please keep me updated.",
];

const emojis = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🙏",
  "🙂",
  "😄",
  "🎉",
  "👏",
  "🌸",
  "☀️",
  "🤝",
  "💐",
  "✨",
  "😌",
  "🙌",
  "🥰",
  "😍",
  "😎",
  "🤗",
  "👌",
  "❤️‍🔥",
  "💯",
  "⭐",
];

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = localStorage.getItem("familyConversations");

    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialConversations;
      }
    }

    return initialConversations;
  });

  const [selectedConversationId, setSelectedConversationId] = useState(
    initialConversations[0].id
  );

  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Attachment
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string | null>(
    null
  );

  // Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId
      ) || conversations[0],
    [conversations, selectedConversationId]
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.companionName.toLowerCase().includes(query) ||
        conversation.seniorName.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  useEffect(() => {
    localStorage.setItem(
      "familyConversations",
      JSON.stringify(conversations)
    );
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [selectedConversationId, selectedConversation?.messages.length]);

  useEffect(() => {
    if (!selectedConversation) return;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              unread: 0,
              messages: conversation.messages.map((item) => ({
                ...item,
                read:
                  item.sender === "companion" ? true : item.read,
              })),
            }
          : conversation
      )
    );
  }, [selectedConversationId]);

  /* ---------------------------------------------------------------------- */
  /* Attachment                                                             */
  /* ---------------------------------------------------------------------- */

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleAttachment = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Remove previous preview first.
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }

    setAttachment(file);

    if (file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setAttachmentPreview(previewUrl);
    } else {
      setAttachmentPreview(null);
    }
  };

  const removeAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }

    setAttachment(null);
    setAttachmentPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (attachmentPreview) {
        URL.revokeObjectURL(attachmentPreview);
      }
    };
  }, [attachmentPreview]);

  /* ---------------------------------------------------------------------- */
  /* Emoji                                                                  */
  /* ---------------------------------------------------------------------- */

  const addEmoji = (emoji: string) => {
    setMessage((current) => `${current}${emoji}`);
    setShowEmojiPicker(false);
  };

  /* ---------------------------------------------------------------------- */
  /* Conversations                                                          */
  /* ---------------------------------------------------------------------- */

  const openConversation = (id: string) => {
    setSelectedConversationId(id);
    setMobileChatOpen(true);
    setShowInfo(false);
    setShowEmojiPicker(false);
    removeAttachment();
  };

  /* ---------------------------------------------------------------------- */
  /* Send Message                                                           */
  /* ---------------------------------------------------------------------- */

  const sendMessage = (textOverride?: string) => {
    const text = (textOverride ?? message).trim();

    // Allow attachment-only messages.
    if (!text && !attachment) return;

    if (!selectedConversation) return;

    let messageAttachment: Attachment | undefined;

    if (attachment) {
      messageAttachment = {
        id: `attachment-${Date.now()}`,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        url: URL.createObjectURL(attachment),
      };
    }

    const newMessage: Message = {
      id: `message-${Date.now()}`,
      sender: "family",
      text,
      timestamp: formatCurrentTime(),
      read: true,
      attachment: messageAttachment,
    };

    const lastMessageText = attachment
      ? text
        ? `${text} · 📎 ${attachment.name}`
        : `📎 ${attachment.name}`
      : text;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              lastMessage: lastMessageText,
              lastMessageTime: "Just now",
              messages: [...conversation.messages, newMessage],
            }
          : conversation
      )
    );

    setMessage("");
    setShowEmojiPicker(false);
    removeAttachment();
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!selectedConversation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <FamilyNavbar />

      <main className="px-4 py-5 md:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8B6B4D]">
                Family Messages
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Stay connected
              </h1>

              <p className="mt-2 text-sm text-[#6F6257] md:text-base">
                Communicate with your family's companions in one place.
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-[#E2DBD0] bg-white px-4 py-3 text-xs text-[#766B61] md:flex">
              <ShieldCheck className="h-4 w-4 text-[#6F5139]" />
              Private family communication
            </div>
          </div>

          {/* Workspace */}
          <div className="overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
            <div className="grid h-[calc(100vh-245px)] min-h-[620px] lg:grid-cols-[330px_1fr]">

              {/* Sidebar */}
              <aside
                className={`${
                  mobileChatOpen ? "hidden lg:flex" : "flex"
                } flex-col border-r border-[#E5DED5]`}
              >
                <div className="border-b border-[#EAE4DB] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-[#30271F]">
                        Conversations
                      </h2>

                      <p className="mt-1 text-xs text-[#8B8177]">
                        {conversations.length} active conversations
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="relative mt-5">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#968A80]" />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search conversations..."
                      className="w-full rounded-xl border border-[#DDD5CB] bg-[#F7F3EC] py-2.5 pl-10 pr-4 text-xs outline-none transition placeholder:text-[#9A9087] focus:border-[#6F5139] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {filteredConversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <Search className="mx-auto h-7 w-7 text-[#B1A59A]" />

                      <p className="mt-3 text-sm font-semibold text-[#5F5145]">
                        No conversations found
                      </p>

                      <p className="mt-1 text-xs text-[#8B8177]">
                        Try a different search.
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        active={
                          conversation.id === selectedConversationId
                        }
                        onClick={() =>
                          openConversation(conversation.id)
                        }
                      />
                    ))
                  )}
                </div>

                {/* Safety */}
                <div className="border-t border-[#EAE4DB] p-4">
                  <Link
                    to="/family/safety"
                    className="flex items-center gap-3 rounded-xl bg-[#F7F3EC] p-3 transition hover:bg-[#F3ECE3]"
                  >
                    <ShieldCheck className="h-5 w-5 text-[#6F5139]" />

                    <div>
                      <p className="text-xs font-semibold text-[#5F4633]">
                        Safety Center
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#81766D]">
                        Need help with a conversation?
                      </p>
                    </div>
                  </Link>
                </div>
              </aside>

              {/* Chat */}
              <section
                className={`${
                  mobileChatOpen ? "flex" : "hidden lg:flex"
                } min-w-0 flex-col`}
              >

                {/* Chat Header */}
                <div className="flex items-center justify-between border-b border-[#E5DED5] bg-white px-4 py-4 md:px-6">
                  <div className="flex min-w-0 items-center gap-3">

                    <button
                      onClick={() => setMobileChatOpen(false)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6F6257] hover:bg-[#F7F3EC] lg:hidden"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <Avatar
                      name={selectedConversation.companionName}
                      online={selectedConversation.online}
                      large
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate font-bold text-[#30271F]">
                          {selectedConversation.companionName}
                        </h2>

                        {selectedConversation.online && (
                          <span className="hidden rounded-full bg-[#F3ECE3] px-2 py-0.5 text-[9px] font-bold text-[#6F5139] sm:inline-block">
                            Online
                          </span>
                        )}
                      </div>

                      <p className="truncate text-xs text-[#766B61]">
                        Companion for {selectedConversation.seniorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      className="hidden h-9 w-9 items-center justify-center rounded-full text-[#6F6257] transition hover:bg-[#F7F3EC] sm:flex"
                      title="Call"
                    >
                      <Phone className="h-4 w-4" />
                    </button>

                    <button
                      className="hidden h-9 w-9 items-center justify-center rounded-full text-[#6F6257] transition hover:bg-[#F7F3EC] sm:flex"
                      title="Video call"
                    >
                      <Video className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setShowInfo(!showInfo)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                        showInfo
                          ? "bg-[#F3ECE3] text-[#6F5139]"
                          : "text-[#6F6257] hover:bg-[#F7F3EC]"
                      }`}
                      title="Conversation info"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                {showInfo && (
                  <ConversationInfo
                    conversation={selectedConversation}
                    onClose={() => setShowInfo(false)}
                  />
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto bg-[#FBF9F5] px-4 py-5 md:px-6">
                  <div className="mx-auto max-w-3xl">

                    <div className="mb-6 flex justify-center">
                      <span className="rounded-full bg-[#F0E9E0] px-3 py-1 text-[10px] font-semibold text-[#8B8177]">
                        Messages with{" "}
                        {selectedConversation.companionName}
                      </span>
                    </div>

                    {selectedConversation.messages.map(
                      (item, index) => {
                        const previous =
                          selectedConversation.messages[index - 1];

                        const showTime =
                          !previous ||
                          previous.sender !== item.sender;

                        return (
                          <div
                            key={item.id}
                            className={`mb-3 flex ${
                              item.sender === "family"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] ${
                                showTime ? "mt-2" : ""
                              }`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                  item.sender === "family"
                                    ? "rounded-br-md bg-[#6F5139] text-white"
                                    : "rounded-bl-md border border-[#E2DBD0] bg-white text-[#4F4034]"
                                }`}
                              >
                                {item.text && (
                                  <p className="whitespace-pre-wrap">
                                    {item.text}
                                  </p>
                                )}

                                {item.attachment && (
                                  <AttachmentMessage
                                    attachment={item.attachment}
                                    family={item.sender === "family"}
                                  />
                                )}
                              </div>

                              <div
                                className={`mt-1 flex items-center gap-1.5 px-1 text-[9px] ${
                                  item.sender === "family"
                                    ? "justify-end text-[#968A80]"
                                    : "text-[#A0958B]"
                                }`}
                              >
                                <span>{item.timestamp}</span>

                                {item.sender === "family" &&
                                  (item.read ? (
                                    <CheckCheck className="h-3 w-3 text-[#6F5139]" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Quick messages */}
                <div className="border-t border-[#EAE4DB] bg-white px-4 pt-3 md:px-6">
                  <div className="flex gap-2 overflow-x-auto pb-3">
                    {quickMessages.map((quickMessage) => (
                      <button
                        key={quickMessage}
                        onClick={() => sendMessage(quickMessage)}
                        className="whitespace-nowrap rounded-full border border-[#DDD5CB] bg-[#F7F3EC] px-3 py-1.5 text-[10px] font-medium text-[#6F6257] transition hover:border-[#B9A794] hover:bg-[#F3ECE3]"
                      >
                        {quickMessage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Composer */}
                <div className="border-t border-[#EAE4DB] bg-white p-4 md:px-6 md:pb-5">

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                    onChange={handleAttachment}
                  />

                  <div className="mx-auto max-w-3xl">

                    {/* Attachment Preview */}
                    {attachment && (
                      <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[#E2DBD0] bg-[#F7F3EC] p-3">

                        {attachmentPreview ? (
                          <img
                            src={attachmentPreview}
                            alt={attachment.name}
                            className="h-14 w-14 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#EDE3D8] text-[#6F5139]">
                            <FileText className="h-6 w-6" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#30271F]">
                            {attachment.name}
                          </p>

                          <p className="mt-1 text-[10px] text-[#8B8177]">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={removeAttachment}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#81766D] transition hover:bg-white hover:text-[#C65361]"
                          title="Remove attachment"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-end gap-2">

                      {/* Attachment */}
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#7B7066] transition hover:bg-[#F7F3EC] hover:text-[#6F5139]"
                        title="Attach file"
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>

                      <div className="relative flex-1">

                        <textarea
                          value={message}
                          onChange={(event) =>
                            setMessage(event.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          rows={1}
                          placeholder="Write a message..."
                          className="max-h-28 min-h-[46px] w-full resize-none rounded-2xl border border-[#DCD4CA] bg-[#F7F3EC] px-4 py-3 pr-12 text-sm text-[#30271F] outline-none transition placeholder:text-[#9A9087] focus:border-[#6F5139] focus:bg-white focus:ring-2 focus:ring-[#6F5139]/10"
                        />

                        {/* Emoji Button */}
                        <button
                          type="button"
                          onClick={() =>
                            setShowEmojiPicker((current) => !current)
                          }
                          className={`absolute bottom-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full transition ${
                            showEmojiPicker
                              ? "bg-[#EDE5DC] text-[#6F5139]"
                              : "text-[#8B8177] hover:bg-[#EDE5DC] hover:text-[#6F5139]"
                          }`}
                          title="Emoji"
                        >
                          <Smile className="h-4 w-4" />
                        </button>

                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-14 right-0 z-50 w-64 rounded-2xl border border-[#E2DBD0] bg-white p-3 shadow-xl">

                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#5F4633]">
                                Choose an emoji
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setShowEmojiPicker(false)
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full text-[#8B8177] hover:bg-[#F7F3EC]"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-6 gap-1">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={`${emoji}-${index}`}
                                  type="button"
                                  onClick={() => addEmoji(emoji)}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:bg-[#F7F3EC]"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Send */}
                      <button
                        type="button"
                        onClick={() => sendMessage()}
                        disabled={!message.trim() && !attachment}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6F5139] text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
                        title="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mx-auto mt-2 hidden text-[9px] text-[#A0958B] sm:block">
                      Press Enter to send · Shift + Enter for a new line
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Attachment Message                                                        */
/* -------------------------------------------------------------------------- */

function AttachmentMessage({
  attachment,
  family,
}: {
  attachment: Attachment;
  family: boolean;
}) {
  const isImage = attachment.type.startsWith("image/");

  return (
    <div className="mt-2 overflow-hidden rounded-xl">

      {isImage && attachment.url ? (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-64 w-full rounded-xl object-cover"
        />
      ) : (
        <div
          className={`flex items-center gap-3 rounded-xl p-3 ${
            family ? "bg-white/10" : "bg-[#F7F3EC]"
          }`}
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              family ? "bg-white/10" : "bg-[#EDE3D8]"
            }`}
          >
            <FileText
              className={`h-5 w-5 ${
                family ? "text-white" : "text-[#6F5139]"
              }`}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">
              {attachment.name}
            </p>

            <p
              className={`mt-0.5 text-[9px] ${
                family ? "text-white/70" : "text-[#8B8177]"
              }`}
            >
              {formatFileSize(attachment.size)}
            </p>
          </div>

          {attachment.url && (
            <a
              href={attachment.url}
              download={attachment.name}
              target="_blank"
              rel="noreferrer"
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                family
                  ? "hover:bg-white/10"
                  : "hover:bg-white"
              }`}
              title="Open attachment"
            >
              <Download className="h-4 w-4" />
            </a>
          )}
        </div>
      )}

      {isImage && (
        <div
          className={`mt-1 flex items-center gap-1 ${
            family ? "text-white/70" : "text-[#8B8177]"
          }`}
        >
          <ImageIcon className="h-3 w-3" />

          <span className="max-w-[220px] truncate text-[9px]">
            {attachment.name}
          </span>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Conversation Item                                                         */
/* -------------------------------------------------------------------------- */

function ConversationItem({
  conversation,
  active,
  onClick,
}: {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-b border-[#F0EBE4] p-4 text-left transition ${
        active
          ? "bg-[#F7F3EC]"
          : "hover:bg-[#FBF9F5]"
      }`}
    >
      <div className="flex gap-3">
        <Avatar
          name={conversation.companionName}
          online={conversation.online}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-sm font-semibold text-[#30271F]">
              {conversation.companionName}
            </p>

            <span className="shrink-0 text-[9px] text-[#9A9087]">
              {conversation.lastMessageTime}
            </span>
          </div>

          <p className="mt-0.5 text-[10px] font-medium text-[#8B6B4D]">
            For {conversation.seniorName}
          </p>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="truncate text-xs text-[#766B61]">
              {conversation.lastMessage}
            </p>

            {conversation.unread > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#6F5139] px-1.5 text-[9px] font-bold text-white">
                {conversation.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Conversation Info                                                         */
/* -------------------------------------------------------------------------- */

function ConversationInfo({
  conversation,
  onClose,
}: {
  conversation: Conversation;
  onClose: () => void;
}) {
  return (
    <div className="border-b border-[#E5DED5] bg-[#F7F3EC] px-5 py-4">
      <div className="mx-auto flex max-w-4xl items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EDE3D8] text-[#6F5139]">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-[#8B6B4D]">
              Conversation Details
            </p>

            <button
              onClick={onClose}
              className="text-[#81766D] hover:text-[#5F4633]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            <InfoItem
              label="Senior"
              value={conversation.seniorName}
            />

            <InfoItem
              label="Location"
              value={conversation.location}
            />

            <InfoItem
              label="Companion rating"
              value={`★ ${conversation.rating}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Info Item                                                                 */
/* -------------------------------------------------------------------------- */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#968A80]">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold text-[#5F4633]">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Avatar                                                                    */
/* -------------------------------------------------------------------------- */

function Avatar({
  name,
  online = false,
  large = false,
}: {
  name: string;
  online?: boolean;
  large?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative shrink-0">
      <div
        className={`flex items-center justify-center rounded-full bg-[#E9DFD4] font-bold text-[#6F5139] ${
          large
            ? "h-11 w-11 text-sm"
            : "h-11 w-11 text-xs"
        }`}
      >
        {initials}
      </div>

      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#6F5139]" />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function formatCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}