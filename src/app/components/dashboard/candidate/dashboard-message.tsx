"use client";
import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard-header";
import { useAuth } from "@/context/AuthContext";
import { notifySuccess, notifyError } from "@/utils/toast";

type IProps = {
  setIsOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

interface Message {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  is_read: boolean;
  sender?: { name: string; avatar_url?: string };
  receiver?: { name: string };
  sender_id: string;
  receiver_id: string;
}

const DashboardMessage = ({ setIsOpenSidebar }: IProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        if (d.messages?.length) setSelected(d.messages[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(compose),
    });
    setSending(false);
    if (res.ok) {
      notifySuccess("Message sent!");
      setShowCompose(false);
      setCompose({ to: "", subject: "", body: "" });
    } else {
      const data = await res.json();
      notifyError(data.error || "Failed to send message");
    }
  };

  return (
    <div className="dashboard-body">
      <div className="position-relative">
        <DashboardHeader setIsOpenSidebar={setIsOpenSidebar} />

        <div className="d-flex align-items-center justify-content-between mb-30">
          <h2 className="main-title m0">Messages</h2>
          <button className="dash-btn-two tran3s" onClick={() => setShowCompose(!showCompose)}>
            {showCompose ? "Cancel" : "+ New Message"}
          </button>
        </div>

        {showCompose && (
          <div className="bg-white card-box border-20 mb-30">
            <h5 className="mb-20">New Message</h5>
            <form onSubmit={handleSend}>
              <div className="dash-input-wrapper mb-20">
                <label>Recipient User ID</label>
                <input type="text" value={compose.to} onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                  placeholder="User UUID" required />
              </div>
              <div className="dash-input-wrapper mb-20">
                <label>Subject</label>
                <input type="text" value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                  placeholder="Subject" required />
              </div>
              <div className="dash-input-wrapper mb-20">
                <label>Message</label>
                <textarea rows={4} value={compose.body} onChange={(e) => setCompose({ ...compose, body: e.target.value })}
                  placeholder="Write your message..." required />
              </div>
              <button type="submit" className="dash-btn-two tran3s" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: "var(--blue, #2563EB)" }} role="status" />
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white card-box border-20 text-center py-5"
            style={{ color: "rgba(226,232,240,0.5)" }}>
            No messages yet.
          </div>
        ) : (
          <div className="bg-white card-box border-20 p0">
            <div className="message-wrapper">
              <div className="row gx-0">
                <div className="col-lg-4">
                  <div className="message-sidebar pt-20" style={{ maxHeight: 600, overflowY: "auto" }}>
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`msg-preview ps-3 pe-3 pt-15 pb-15 border-bottom cursor-pointer ${selected?.id === msg.id ? "active" : ""}`}
                        style={{
                          cursor: "pointer",
                          background: selected?.id === msg.id ? "rgba(37,99,235,0.1)" : "transparent",
                          borderLeft: selected?.id === msg.id ? "3px solid #2563EB" : "3px solid transparent",
                        }}
                        onClick={() => setSelected(msg)}
                      >
                        <div className="fw-500" style={{ fontSize: 14 }}>
                          {msg.sender_id === user?.id
                            ? `To: ${msg.receiver?.name || "Unknown"}`
                            : msg.sender?.name || "Unknown"}
                        </div>
                        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>{msg.subject}</div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-lg-8">
                  {selected && (
                    <div className="open-email-container pb-40 ps-4 pe-4">
                      <div className="email-header divider pt-20 pb-20 mb-20">
                        <div className="fw-500" style={{ fontSize: 18 }}>{selected.subject}</div>
                        <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
                          {selected.sender?.name} &bull;{" "}
                          {new Date(selected.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="email-body" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                        {selected.body}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardMessage;
