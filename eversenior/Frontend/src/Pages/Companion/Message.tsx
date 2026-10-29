import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";

import CompanionNavbar from "./CompanionNavbar";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
};

type Message = {
  id: number;
  text: string;
  sender: "me" | "senior";
  time: string;
  read?: boolean;
  attachment?: Attachment;
};

type Conversation = {
  id: number;
  name: string;
  age: number;
  image: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  location: string;
  messages: Message[];
};

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

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Prince Saxena",
    age: 68,
    image: "/images/eversenior-seniors.jpg",
    lastMessage: "Looking forward to our coffee session!",
    lastTime: "10:42 AM",
    unread: 2,
    online: true,
    sessionTitle: "Coffee & Conversation",
    sessionDate: "12 October 2026",
    sessionTime: "04:00 PM · 2 hours",
    location: "Greater Noida",
    messages: [
      {
        id: 1,
        text: "Hello! I am looking forward to meeting you.",
        sender: "senior",
        time: "10:25 AM",
      },
      {
        id: 2,
        text: "Hello Prince! I am looking forward to it too.",
        sender: "me",
        time: "10:31 AM",
        read: true,
      },
      {
        id: 3,
        text: "Would you prefer the coffee shop near the park?",
        sender: "senior",
        time: "10:38 AM",
      },
      {
        id: 4,
        text: "That works perfectly for me.",
        sender: "me",
        time: "10:40 AM",
        read: true,
      },
      {
        id: 5,
        text: "Looking forward to our coffee session!",
        sender: "senior",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Rajiv Mehta",
    age: 72,
    image: "/images/eversenior-seniors.jpg",
    lastMessage: "Thank you, see you tomorrow.",
    lastTime: "Yesterday",
    unread: 0,
    online: false,
    sessionTitle: "Evening Walk & Conversation",
    sessionDate: "13 October 2026",
    sessionTime: "05:30 PM · 1.5 hours",
    location: "Noida Sector 62",
    messages: [
      {
        id: 1,
        text: "Hello Ananya, just confirming tomorrow's session.",
        sender: "senior",
        time: "Yesterday",
      },
      {
        id: 2,
        text: "Yes, everything is confirmed from my side.",
        sender: "me",
        time: "Yesterday",
        read: true,
      },
      {
        id: 3,
        text: "Thank you, see you tomorrow.",
        sender: "senior",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "Meera Kapoor",
    age: 65,
    image: "/images/eversenior-seniors.jpg",
    lastMessage: "The art session was wonderful!",
    lastTime: "28 Sep",
    unread: 0,
    online: false,
    sessionTitle: "Art & Hobby Session",
    sessionDate: "28 September 2026",
    sessionTime: "03:00 PM · 2 hours",
    location: "Indirapuram",
    messages: [
      {
        id: 1,
        text: "I really enjoyed today's session.",
        sender: "senior",
        time: "05:12 PM",
      },
      {
        id: 2,
        text: "I enjoyed it as well. Your paintings were lovely.",
        sender: "me",
        time: "05:15 PM",
        read: true,
      },
      {
        id: 3,
        text: "The art session was wonderful!",
        sender: "senior",
        time: "05:18 PM",
      },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  const [selectedId, setSelectedId] = useState<number>(1);

  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");

  const [mobileConversationOpen, setMobileConversationOpen] =
    useState(false);

  // Attachment state
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] =
    useState<string | null>(null);

  // Emoji picker state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedId
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(query) ||
        conversation.lastMessage.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  /* =========================================================
     SELECT CONVERSATION
  ========================================================= */

  const selectConversation = (id: number) => {
    setSelectedId(id);
    setMobileConversationOpen(true);
    setShowEmojiPicker(false);

    removeAttachment();

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              unread: 0,
            }
          : conversation
      )
    );
  };

  /* =========================================================
     ATTACHMENT
  ========================================================= */

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleAttachment = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

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

  /* =========================================================
     EMOJI
  ========================================================= */

  const addEmoji = (emoji: string) => {
    setMessage((current) => `${current}${emoji}`);
    setShowEmojiPicker(false);
  };

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !attachment) {
      return;
    }

    if (!selectedConversation) {
      return;
    }

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
      id: Date.now(),
      text: trimmedMessage,
      sender: "me",
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
      attachment: messageAttachment,
    };

    const lastMessageText = attachment
      ? trimmedMessage
        ? `${trimmedMessage} · 📎 ${attachment.name}`
        : `📎 ${attachment.name}`
      : trimmedMessage;

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              lastMessage: lastMessageText,
              lastTime: "Just now",
              messages: [
                ...conversation.messages,
                newMessage,
              ],
            }
          : conversation
      )
    );

    setMessage("");
    setShowEmojiPicker(false);
    removeAttachment();
  };

  /* =========================================================
     KEYBOARD
  ========================================================= */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">
      <CompanionNavbar />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={handleAttachment}
      />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="border-b border-[#E2DBD0] bg-[#F7F3EC]">
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-[#7A624C]">
            Stay connected
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[#30271F] sm:text-4xl">
            Messages
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#716458] sm:text-base">
            Stay connected with seniors before,
            during and after your sessions.
          </p>
        </div>
      </section>

      {/* =====================================================
          MESSAGES AREA
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-0 py-0 sm:px-6 sm:py-6 lg:px-8">
        <div className="overflow-hidden border-y border-[#E2DBD0] bg-white sm:rounded-2xl sm:border">
          <div className="grid h-[calc(100vh-190px)] min-h-[620px] lg:grid-cols-[340px_1fr]">

            {/* =================================================
                CONVERSATION LIST
            ================================================= */}

            <aside
              className={`flex min-h-0 flex-col border-r border-[#E5DDD3] bg-[#FBF9F6] ${
                mobileConversationOpen
                  ? "hidden lg:flex"
                  : "flex"
              }`}
            >
              <div className="border-b border-[#E5DDD3] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-[#30271F]">
                      Conversations
                    </h2>

                    <p className="mt-0.5 text-xs text-[#8A7B6D]">
                      {conversations.length} active conversations
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EFE6DC] text-[#6F5139]">
                    <MessageCircle size={17} />
                  </div>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7B6D]"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search conversations..."
                    className="h-10 w-full rounded-xl border border-[#DED5CA] bg-white pl-9 pr-3 text-sm text-[#30271F] outline-none placeholder:text-[#A09284] focus:border-[#8A735D] focus:ring-2 focus:ring-[#EDE3D7]"
                  />
                </div>
              </div>

              {/* Conversation list */}
              <div className="min-h-0 flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#F3ECE3] text-[#6F5139]">
                      <Search size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#4A4037]">
                      No conversations found
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#887A6D]">
                      Try searching for another name.
                    </p>
                  </div>
                ) : (
                  filteredConversations.map(
                    (conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        active={
                          conversation.id === selectedId
                        }
                        onClick={() =>
                          selectConversation(
                            conversation.id
                          )
                        }
                      />
                    )
                  )
                )}
              </div>
            </aside>

            {/* =================================================
                CHAT PANEL
            ================================================= */}

            <section
              className={`min-w-0 flex-col bg-white ${
                mobileConversationOpen
                  ? "flex"
                  : "hidden lg:flex"
              }`}
            >
              {selectedConversation ? (
                <>
                  {/* Chat header */}
                  <div className="flex min-h-[76px] items-center justify-between border-b border-[#E5DDD3] px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        onClick={() =>
                          setMobileConversationOpen(false)
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#6F5139] hover:bg-[#F3ECE3] lg:hidden"
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <div className="relative shrink-0">
                        <img
                          src={selectedConversation.image}
                          alt={selectedConversation.name}
                          className="h-10 w-10 rounded-xl object-cover"
                        />

                        {selectedConversation.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#5F8A62]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="truncate text-sm font-semibold text-[#30271F] sm:text-base">
                            {selectedConversation.name}
                          </h2>

                          <span className="hidden text-xs text-[#938476] sm:inline">
                            {selectedConversation.age}yrs
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs text-[#847568]">
                          {selectedConversation.online
                            ? "Online now"
                            : "Available for messages"}
                        </p>
                      </div>
                    </div>

                    <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[#74675B] hover:bg-[#F3ECE3]">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  {/* Session context */}
                  <div className="border-b border-[#E5DDD3] bg-[#FBF9F6] px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8A735D]">
                          Upcoming session
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[#30271F]">
                          {selectedConversation.sessionTitle}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#716458]">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          {selectedConversation.sessionDate}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} />
                          {selectedConversation.sessionTime}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {selectedConversation.location}
                        </span>
                      </div>

                      <button className="hidden items-center gap-1 text-xs font-semibold text-[#6F5139] hover:underline sm:flex">
                        View session
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="min-h-0 flex-1 overflow-y-auto bg-[#FDFCFA] px-4 py-5 sm:px-6">
                    <div className="mx-auto max-w-3xl space-y-4">
                      <div className="flex justify-center">
                        <span className="rounded-full bg-[#F0E9E0] px-3 py-1 text-[10px] font-medium text-[#857668]">
                          Session conversation
                        </span>
                      </div>

                      {selectedConversation.messages.map(
                        (item) => (
                          <MessageBubble
                            key={item.id}
                            message={item}
                          />
                        )
                      )}
                    </div>
                  </div>

                  {/* =================================================
                      COMPOSER
                  ================================================= */}

                  <div className="border-t border-[#E5DDD3] bg-white p-3 sm:p-4">

                    {/* Attachment preview */}
                    {attachment && (
                      <div className="mx-auto mb-3 max-w-3xl">
                        <div className="flex items-center gap-3 rounded-xl border border-[#E3DBD1] bg-[#FBF9F6] p-3">

                          {attachmentPreview ? (
                            <img
                              src={attachmentPreview}
                              alt={attachment.name}
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#EFE6DC] text-[#6F5139]">
                              <FileText size={24} />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-[#30271F]">
                              {attachment.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#8A7B6D]">
                              {formatFileSize(
                                attachment.size
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={removeAttachment}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#806B56] hover:bg-[#EFE6DC] hover:text-[#5F4633]"
                            title="Remove attachment"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mx-auto flex max-w-3xl items-end gap-2">

                      {/* Attachment button */}
                      <button
                        type="button"
                        onClick={openFilePicker}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[#806B56] transition hover:bg-[#F3ECE3] hover:text-[#6F5139]"
                        title="Attach file"
                      >
                        <Paperclip size={18} />
                      </button>

                      <div className="relative flex-1">

                        <input
                          value={message}
                          onChange={(event) =>
                            setMessage(
                              event.target.value
                            )
                          }
                          onKeyDown={handleKeyDown}
                          placeholder="Write a message..."
                          className="h-11 w-full rounded-xl border border-[#DED5CA] bg-[#FBF9F6] px-4 pr-11 text-sm text-[#30271F] outline-none placeholder:text-[#A09284] focus:border-[#8A735D] focus:ring-2 focus:ring-[#EDE3D7]"
                        />

                        {/* Emoji button */}
                        <button
                          type="button"
                          onClick={() =>
                            setShowEmojiPicker(
                              (current) => !current
                            )
                          }
                          className={`absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition ${
                            showEmojiPicker
                              ? "bg-[#EFE6DC] text-[#6F5139]"
                              : "text-[#806B56] hover:bg-[#EFE6DC]"
                          }`}
                          title="Add emoji"
                        >
                          <Smile size={17} />
                        </button>

                        {/* Emoji picker */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-14 right-0 z-50 w-64 rounded-2xl border border-[#DED5CA] bg-white p-3 shadow-xl">

                            <div className="mb-2 flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#5F4633]">
                                Choose an emoji
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  setShowEmojiPicker(false)
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full text-[#8A7B6D] hover:bg-[#F3ECE3]"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-6 gap-1">
                              {emojis.map(
                                (emoji, index) => (
                                  <button
                                    key={`${emoji}-${index}`}
                                    type="button"
                                    onClick={() =>
                                      addEmoji(emoji)
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:bg-[#F7F3EC]"
                                  >
                                    {emoji}
                                  </button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Send button */}
                      <button
                        type="button"
                        onClick={sendMessage}
                        disabled={
                          !message.trim() &&
                          !attachment
                        }
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6F5139] text-white transition hover:bg-[#5F4633] disabled:cursor-not-allowed disabled:opacity-40"
                        title="Send message"
                      >
                        <Send size={17} />
                      </button>
                    </div>

                    <p className="mx-auto mt-2 max-w-3xl text-[10px] text-[#A09284]">
                      Press Enter to send
                    </p>
                  </div>
                </>
              ) : (
                <EmptyChatState />
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   CONVERSATION ITEM
========================================================= */

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
      className={`w-full border-b border-[#EAE2D9] px-4 py-4 text-left transition ${
        active
          ? "bg-[#F3ECE3]"
          : "hover:bg-white"
      }`}
    >
      <div className="flex gap-3">
        <div className="relative shrink-0">
          <img
            src={conversation.image}
            alt={conversation.name}
            className="h-11 w-11 rounded-xl object-cover"
          />

          {conversation.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#FBF9F6] bg-[#5F8A62]" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={`truncate text-sm ${
                conversation.unread > 0
                  ? "font-semibold text-[#30271F]"
                  : "font-medium text-[#4A4037]"
              }`}
            >
              {conversation.name}
            </p>

            <span className="shrink-0 text-[10px] text-[#968779]">
              {conversation.lastTime}
            </span>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <p
              className={`truncate text-xs ${
                conversation.unread > 0
                  ? "font-medium text-[#65594E]"
                  : "text-[#8B7D70]"
              }`}
            >
              {conversation.lastMessage}
            </p>

            {conversation.unread > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#6F5139] px-1.5 text-[10px] font-semibold text-white">
                {conversation.unread}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

/* =========================================================
   MESSAGE BUBBLE
========================================================= */

function MessageBubble({
  message,
}: {
  message: Message;
}) {
  const isMine = message.sender === "me";

  return (
    <div
      className={`flex ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[82%] sm:max-w-[70%] ${
          isMine
            ? "items-end"
            : "items-start"
        } flex flex-col`}
      >
        {/* Text */}
        {message.text && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
              isMine
                ? "rounded-br-md bg-[#6F5139] text-white"
                : "rounded-bl-md border border-[#E3DBD1] bg-white text-[#4A4037]"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Attachment */}
        {message.attachment && (
          <AttachmentMessage
            attachment={message.attachment}
            mine={isMine}
          />
        )}

        {/* Time */}
        <div
          className={`mt-1 flex items-center gap-1.5 px-1 text-[10px] ${
            isMine
              ? "text-[#938476]"
              : "text-[#A09284]"
          }`}
        >
          <span>{message.time}</span>

          {isMine && message.read && (
            <CheckCheck
              size={13}
              className="text-[#6F8B70]"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ATTACHMENT MESSAGE
========================================================= */

function AttachmentMessage({
  attachment,
  mine,
}: {
  attachment: Attachment;
  mine: boolean;
}) {
  const isImage = attachment.type.startsWith("image/");

  if (isImage && attachment.url) {
    return (
      <div className="mt-2 overflow-hidden rounded-xl">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-64 w-full rounded-xl object-cover"
        />

        <div
          className={`mt-1 flex items-center gap-1 ${
            mine
              ? "text-[#938476]"
              : "text-[#A09284]"
          }`}
        >
          <ImageIcon size={12} />

          <span className="max-w-[220px] truncate text-[9px]">
            {attachment.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mt-2 flex items-center gap-3 rounded-xl p-3 ${
        mine
          ? "bg-[#7C6148] text-white"
          : "bg-[#F7F3EC] text-[#4A4037]"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          mine
            ? "bg-white/10"
            : "bg-[#EDE3D7]"
        }`}
      >
        <FileText
          size={20}
          className={
            mine
              ? "text-white"
              : "text-[#6F5139]"
          }
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">
          {attachment.name}
        </p>

        <p
          className={`mt-0.5 text-[9px] ${
            mine
              ? "text-white/70"
              : "text-[#8B7D70]"
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
            mine
              ? "hover:bg-white/10"
              : "hover:bg-white"
          }`}
          title="Open attachment"
        >
          <Download size={15} />
        </a>
      )}
    </div>
  );
}

/* =========================================================
   EMPTY CHAT
========================================================= */

function EmptyChatState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F3ECE3] text-[#6F5139]">
        <MessageCircle size={25} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-[#30271F]">
        Select a conversation
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-[#7A6D60]">
        Choose a conversation from the left to
        start messaging.
      </p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}