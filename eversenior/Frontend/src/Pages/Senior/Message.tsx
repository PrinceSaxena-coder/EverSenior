import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Image as ImageIcon,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Search,
  Send,
  Smile,
  X,
} from "lucide-react";

import SeniorNavbar from "./SeniorNavbar";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
};

type Message = {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
  attachment?: Attachment;
};

type Conversation = {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
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

const conversations: Conversation[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    lastMessage: "Looking forward to our coffee chat!",
    time: "10:42 AM",
    unread: 2,
    online: true,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hello! It's lovely to connect with you.",
        time: "10:34 AM",
      },
      {
        id: 2,
        sender: "me",
        text: "Hello Ananya! I'm looking forward to meeting you.",
        time: "10:36 AM",
      },
      {
        id: 3,
        sender: "them",
        text: "That's wonderful! Would you like to meet for coffee this week?",
        time: "10:39 AM",
      },
      {
        id: 4,
        sender: "me",
        text: "Yes, that sounds perfect.",
        time: "10:40 AM",
      },
      {
        id: 5,
        sender: "them",
        text: "Looking forward to our coffee chat!",
        time: "10:42 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Riya Kapoor",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    lastMessage: "The art exhibition sounds great.",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      {
        id: 1,
        sender: "me",
        text: "Hi Riya, how are you doing?",
        time: "Yesterday",
      },
      {
        id: 2,
        sender: "them",
        text: "I'm doing well! How about you?",
        time: "Yesterday",
      },
      {
        id: 3,
        sender: "me",
        text: "Doing great. I saw there is an art exhibition nearby.",
        time: "Yesterday",
      },
      {
        id: 4,
        sender: "them",
        text: "The art exhibition sounds great.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: 3,
    name: "Meera Verma",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    lastMessage: "See you soon!",
    time: "Mon",
    unread: 0,
    online: true,
    messages: [
      {
        id: 1,
        sender: "them",
        text: "Hi! Just checking in before our upcoming meeting.",
        time: "Mon",
      },
      {
        id: 2,
        sender: "me",
        text: "Everything looks good from my side.",
        time: "Mon",
      },
      {
        id: 3,
        sender: "them",
        text: "See you soon!",
        time: "Mon",
      },
    ],
  },
];

export default function Messages() {
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [mobileConversations, setMobileConversations] =
    useState(false);

  const [messages, setMessages] =
    useState<Conversation[]>(conversations);

  // Attachment
  const [attachment, setAttachment] =
    useState<File | null>(null);

  const [attachmentPreview, setAttachmentPreview] =
    useState<string | null>(null);

  // Emoji picker
  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const selectedConversation = useMemo(
    () =>
      messages.find(
        (conversation) =>
          conversation.id === selectedId
      ),
    [messages, selectedId]
  );

  const filteredConversations = messages.filter(
    (conversation) =>
      conversation.name
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* =========================================================
     ATTACHMENT FUNCTIONS
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
      const previewUrl =
        URL.createObjectURL(file);

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
    const trimmedMessage =
      message.trim();

    if (
      !trimmedMessage &&
      !attachment
    ) {
      return;
    }

    if (!selectedConversation) {
      return;
    }

    let messageAttachment:
      | Attachment
      | undefined;

    if (attachment) {
      messageAttachment = {
        id: `attachment-${Date.now()}`,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        url: URL.createObjectURL(
          attachment
        ),
      };
    }

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      text: trimmedMessage,
      time: new Date().toLocaleTimeString(
        "en-IN",
        {
          hour: "numeric",
          minute: "2-digit",
        }
      ),
      attachment:
        messageAttachment,
    };

    const lastMessageText = attachment
      ? trimmedMessage
        ? `${trimmedMessage} · 📎 ${attachment.name}`
        : `📎 ${attachment.name}`
      : trimmedMessage;

    setMessages((current) =>
      current.map((conversation) =>
        conversation.id === selectedId
          ? {
              ...conversation,
              lastMessage:
                lastMessageText,
              time: "Just now",
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
     SELECT CONVERSATION
  ========================================================= */

  const selectConversation = (
    id: number
  ) => {
    setSelectedId(id);
    setMobileConversations(false);
    setShowEmojiPicker(false);

    removeAttachment();

    setMessages((current) =>
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
     KEYBOARD
  ========================================================= */

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#30271F]">

      <SeniorNavbar />

      {/* Hidden file picker */}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={handleAttachment}
      />

      {/* =========================================================
          MESSAGES PAGE
      ========================================================= */}

      <main className="mx-auto max-w-[1450px] px-4 py-6 md:px-6 lg:px-8">

        <div className="flex h-[calc(100vh-118px)] min-h-[620px] overflow-hidden rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">

          {/* =====================================================
              CONVERSATIONS SIDEBAR
          ===================================================== */}

          <aside
            className={`${
              mobileConversations
                ? "flex"
                : "hidden"
            } fixed inset-0 z-50 flex-col bg-white lg:static lg:flex lg:w-[360px] lg:shrink-0 lg:border-r lg:border-[#E2DBD0]`}
          >

            {/* Header */}

            <div className="flex h-[78px] items-center justify-between border-b border-[#E2DBD0] px-5">

              <div>
                <h2 className="font-serif text-xl font-semibold">
                  Conversations
                </h2>

                <p className="mt-1 text-xs text-[#8A8178]">
                  {messages.length} active conversations
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileConversations(false)
                }
                className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#F7F3EC] lg:hidden"
                aria-label="Close conversations"
              >
                <X size={20} />
              </button>

            </div>

            {/* Search */}

            <div className="border-b border-[#E2DBD0] p-4">

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999187]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-[#DCD3C8] bg-[#FCFAF7] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#6F5139] focus:ring-2 focus:ring-[#6F5139]/10"
                />

              </div>

            </div>

            {/* Conversation List */}

            <div className="flex-1 overflow-y-auto">

              {filteredConversations.length ===
              0 ? (

                <div className="px-6 py-12 text-center">

                  <MessageCircle
                    size={34}
                    className="mx-auto text-[#A8A198]"
                  />

                  <p className="mt-4 font-medium">
                    No conversations found
                  </p>

                  <p className="mt-1 text-sm text-[#8A8178]">
                    Try searching for another companion.
                  </p>

                </div>

              ) : (

                filteredConversations.map(
                  (conversation) => (

                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() =>
                        selectConversation(
                          conversation.id
                        )
                      }
                      className={`flex w-full gap-3 border-b border-[#F0ECE5] px-4 py-4 text-left transition ${
                        selectedId ===
                        conversation.id
                          ? "bg-[#F3ECE3]"
                          : "hover:bg-[#FCFAF7]"
                      }`}
                    >

                      {/* Avatar */}

                      <div className="relative shrink-0">

                        <img
                          src={
                            conversation.image
                          }
                          alt={
                            conversation.name
                          }
                          className="h-12 w-12 rounded-full object-cover"
                        />

                        {conversation.online && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#6F5139]" />
                        )}

                      </div>

                      {/* Details */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <p className="truncate text-sm font-semibold">
                            {
                              conversation.name
                            }
                          </p>

                          <span className="shrink-0 text-[11px] text-[#999187]">
                            {
                              conversation.time
                            }
                          </span>

                        </div>

                        <div className="mt-1 flex items-center justify-between gap-2">

                          <p className="truncate text-xs text-[#777067]">
                            {
                              conversation.lastMessage
                            }
                          </p>

                          {conversation.unread >
                            0 && (
                            <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-[#6F5139] px-1 text-[10px] font-semibold text-white">
                              {
                                conversation.unread
                              }
                            </span>
                          )}

                        </div>

                      </div>

                    </button>

                  )
                )

              )}

            </div>

          </aside>

          {/* =====================================================
              CHAT AREA
          ===================================================== */}

          {selectedConversation ? (

            <section className="flex min-w-0 flex-1 flex-col">

              {/* Chat Header */}

              <div className="flex h-[78px] items-center justify-between border-b border-[#E2DBD0] px-4 md:px-6">

                <div className="flex min-w-0 items-center gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setMobileConversations(
                        true
                      )
                    }
                    className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#F7F3EC] lg:hidden"
                    aria-label="Back to conversations"
                  >
                    <ChevronLeft
                      size={20}
                    />
                  </button>

                  <div className="relative shrink-0">

                    <img
                      src={
                        selectedConversation.image
                      }
                      alt={
                        selectedConversation.name
                      }
                      className="h-11 w-11 rounded-full object-cover"
                    />

                    {selectedConversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#6F5139]" />
                    )}

                  </div>

                  <div className="min-w-0">

                    <h2 className="truncate text-sm font-semibold md:text-base">
                      {
                        selectedConversation.name
                      }
                    </h2>

                    <div className="mt-0.5 flex items-center gap-1.5">

                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          selectedConversation.online
                            ? "bg-[#6F5139]"
                            : "bg-[#AAA49C]"
                        }`}
                      />

                      <p className="text-xs text-[#8A8178]">
                        {
                          selectedConversation.online
                            ? "Online now"
                            : "Offline"
                        }
                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex items-center gap-1">

                  <Link
                    to={`/senior/companions/${selectedConversation.id}`}
                    className="hidden rounded-xl px-3 py-2 text-xs font-medium text-[#6F5139] hover:bg-[#F7F3EC] sm:block"
                  >
                    View Profile
                  </Link>

                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-xl text-[#777067] hover:bg-[#F7F3EC]"
                    aria-label="More options"
                  >
                    <MoreVertical
                      size={19}
                    />
                  </button>

                </div>

              </div>

              {/* Messages */}

              <div className="flex-1 overflow-y-auto bg-[#FCFAF7] px-4 py-6 md:px-7">

                <div className="mx-auto max-w-3xl space-y-4">

                  <div className="flex justify-center">
                    <span className="rounded-full bg-[#F0ECE5] px-4 py-1.5 text-[11px] text-[#888077]">
                      Today
                    </span>
                  </div>

                  {selectedConversation.messages.map(
                    (item) => (

                      <div
                        key={item.id}
                        className={`flex ${
                          item.sender ===
                          "me"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >

                        <div
                          className={`${
                            item.sender ===
                            "me"
                              ? "items-end"
                              : "items-start"
                          } flex max-w-[78%] flex-col md:max-w-[65%]`}
                        >

                          {/* Text message */}

                          {item.text && (
                            <div
                              className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                                item.sender ===
                                "me"
                                  ? "rounded-br-md bg-[#6F5139] text-white"
                                  : "rounded-bl-md border border-[#E2DBD0] bg-white text-[#34302C]"
                              }`}
                            >
                              {
                                item.text
                              }
                            </div>
                          )}

                          {/* Attachment */}

                          {item.attachment && (
                            <AttachmentMessage
                              attachment={
                                item.attachment
                              }
                              mine={
                                item.sender ===
                                "me"
                              }
                            />
                          )}

                          <span className="mt-1 px-1 text-[10px] text-[#999187]">
                            {item.time}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* Booking Context */}

              <div className="border-t border-[#E2DBD0] bg-white px-4 py-3 md:px-6">

                <Link
                  to={`/senior/companions/${selectedConversation.id}/book`}
                  className="flex items-center gap-3 rounded-xl border border-[#E2DBD0] bg-[#FCFAF7] px-4 py-3 transition hover:border-[#6F5139]/40"
                >

                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F3ECE3] text-[#6F5139]">
                    <CalendarDays
                      size={17}
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs font-semibold">
                      Plan time together
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-[#888077]">
                      Book your next session with{" "}
                      {
                        selectedConversation.name
                      }
                    </p>

                  </div>

                  <ChevronRight
                    size={17}
                    className="shrink-0 text-[#999187]"
                  />

                </Link>

              </div>

              {/* =================================================
                  COMPOSER
              ================================================= */}

              <div className="border-t border-[#E2DBD0] bg-white p-4 md:px-6 md:py-5">

                {/* Attachment Preview */}

                {attachment && (
                  <div className="mx-auto mb-3 max-w-3xl">

                    <div className="flex items-center gap-3 rounded-xl border border-[#E2DBD0] bg-[#FCFAF7] p-3">

                      {attachmentPreview ? (
                        <img
                          src={
                            attachmentPreview
                          }
                          alt={
                            attachment.name
                          }
                          className="h-14 w-14 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[#F3ECE3] text-[#6F5139]">
                          <FileText
                            size={24}
                          />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-[#30271F]">
                          {
                            attachment.name
                          }
                        </p>

                        <p className="mt-0.5 text-xs text-[#8A8178]">
                          {formatFileSize(
                            attachment.size
                          )}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={
                          removeAttachment
                        }
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#777067] hover:bg-[#F3ECE3] hover:text-[#5F4633]"
                        title="Remove attachment"
                      >
                        <X size={16} />
                      </button>

                    </div>

                  </div>
                )}

                <div className="mx-auto flex max-w-3xl items-end gap-2">

                  {/* Attachment */}

                  <button
                    type="button"
                    onClick={
                      openFilePicker
                    }
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#777067] transition hover:bg-[#F7F3EC] hover:text-[#6F5139]"
                    aria-label="Attach file"
                    title="Attach file"
                  >
                    <Paperclip
                      size={19}
                    />
                  </button>

                  {/* Message Input */}

                  <div className="relative flex min-h-[46px] flex-1 items-end rounded-xl border border-[#DCD3C8] bg-[#FCFAF7] focus-within:border-[#6F5139] focus-within:ring-2 focus-within:ring-[#6F5139]/10">

                    <textarea
                      value={message}
                      onChange={(e) =>
                        setMessage(
                          e.target.value
                        )
                      }
                      onKeyDown={
                        handleKeyDown
                      }
                      rows={1}
                      placeholder={`Message ${selectedConversation.name}...`}
                      className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-4 py-3 pr-12 text-sm outline-none"
                    />

                    {/* Emoji Button */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowEmojiPicker(
                          (current) =>
                            !current
                        )
                      }
                      className={`absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-lg transition ${
                        showEmojiPicker
                          ? "bg-[#EFE6DC] text-[#6F5139]"
                          : "text-[#777067] hover:bg-[#EFE6DC]"
                      }`}
                      aria-label="Add emoji"
                      title="Add emoji"
                    >
                      <Smile size={17} />
                    </button>

                    {/* Emoji Picker */}

                    {showEmojiPicker && (
                      <div className="absolute bottom-14 right-0 z-50 w-64 rounded-2xl border border-[#DCD3C8] bg-white p-3 shadow-xl">

                        <div className="mb-2 flex items-center justify-between">

                          <p className="text-xs font-semibold text-[#5F4633]">
                            Choose an emoji
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              setShowEmojiPicker(
                                false
                              )
                            }
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[#8A8178] hover:bg-[#F3ECE3]"
                            aria-label="Close emoji picker"
                          >
                            <X size={14} />
                          </button>

                        </div>

                        <div className="grid grid-cols-6 gap-1">

                          {emojis.map(
                            (
                              emoji,
                              index
                            ) => (
                              <button
                                key={`${emoji}-${index}`}
                                type="button"
                                onClick={() =>
                                  addEmoji(
                                    emoji
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:bg-[#F7F3EC]"
                              >
                                {
                                  emoji
                                }
                              </button>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  </div>

                  {/* Send */}

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      !message.trim() &&
                      !attachment
                    }
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#6F5139] text-white transition hover:bg-[#5B402D] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                    title="Send message"
                  >
                    <Send size={18} />
                  </button>

                </div>

                <div className="mx-auto mt-2 flex max-w-3xl items-center justify-center gap-1 text-[10px] text-[#999187]">
                  <Clock size={11} />

                  <span>
                    Press Enter to send · Shift + Enter for a new line
                  </span>
                </div>

              </div>

            </section>

          ) : (

            /* ===================================================
               EMPTY CHAT
            =================================================== */

            <section className="hidden flex-1 items-center justify-center bg-[#FCFAF7] lg:flex">

              <div className="text-center">

                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#F3ECE3] text-[#6F5139]">
                  <MessageCircle
                    size={28}
                  />
                </div>

                <h2 className="mt-5 font-serif text-2xl font-semibold">
                  Your messages
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#777067]">
                  Select a conversation to start chatting with
                  your companion.
                </p>

              </div>

            </section>

          )}

        </div>

      </main>
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
  const isImage =
    attachment.type.startsWith(
      "image/"
    );

  if (
    isImage &&
    attachment.url
  ) {
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
          {formatFileSize(
            attachment.size
          )}
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
   FILE SIZE
========================================================= */

function formatFileSize(
  bytes: number
) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (
    bytes <
    1024 * 1024
  ) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}