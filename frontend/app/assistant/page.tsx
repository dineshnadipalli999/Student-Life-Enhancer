"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";

type ChatMessage = { role: string; content: string };
type AssistantReply = { reply: string; conversationId: string; suggestions: string[] };
const prompts = ["Which careers match my skills?", "What skills am I missing?", "What course should I take next?", "How can I improve my profile?"];

export default function Assistant() {
  const { user, loading: userLoading } = useCurrentUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [suggestions, setSuggestions] = useState(prompts);
  const [conversationId, setConversationId] = useState<string>();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    apiFetch(`/api/assistant/${user.id}/conversation`, { method: "DELETE" })
      .then(() => {
        setConversationId(undefined);
        setMessages([]);
        setSuggestions(prompts);
      })
      .catch(() => setError("Unable to start a new assistant chat."))
      .finally(() => setLoadingConversation(false));
  }, [user?.id]);

  async function send(text = input) {
    if (!text.trim() || !user || busy || loadingConversation) return;
    const question = text.trim();
    setInput("");
    setError("");
    setMessages(items => [...items, { role: "user", content: question }]);
    setBusy(true);
    try {
      const result = await apiFetch<AssistantReply>(`/api/assistant/${user.id}/message`, { method: "POST", body: JSON.stringify({ message: question, conversationId }) });
      setConversationId(result.conversationId);
      setMessages(items => [...items, { role: "assistant", content: result.reply }]);
      setSuggestions(result.suggestions?.length ? result.suggestions : prompts);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Assistant is unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (userLoading) return <main className="p-7">Loading assistant...</main>;
  return <main className="mx-auto max-w-5xl space-y-6 p-5 md:p-7">
    <PageHeader title="AI Career Assistant" description="Ask questions grounded in your profile and administrator-published career data." />
    <div className="card flex min-h-[550px] flex-col p-5">
      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {loadingConversation && <div className="rounded-2xl bg-slate-100 p-4 text-sm muted">Loading your assistant...</div>}
        {!loadingConversation && !messages.length && <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-slate-800 dark:text-white">Hi {user?.name?.split(" ")[0] || "there"}! Ask about careers, missing skills, courses, projects, or your profile.</div>}
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`max-w-3xl whitespace-pre-wrap rounded-2xl p-4 text-sm ${message.role === "user" ? "ml-auto bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 dark:text-white"}`}>{message.content}</div>)}
      </div>
      {error && <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p>}
      <div className="mt-5 flex flex-wrap gap-2">{suggestions.map(question => <button key={question} onClick={() => send(question)} disabled={busy || loadingConversation} className="rounded-full border px-3 py-2 text-xs font-semibold disabled:opacity-50">{question}</button>)}</div>
      <div className="mt-4 flex gap-2"><input required value={input} disabled={loadingConversation} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === "Enter" && send()} className="flex-1 rounded-xl border bg-transparent px-4 py-3 outline-none" placeholder="Ask a career question..." /><Button disabled={busy || loadingConversation || !user || !input.trim()} onClick={() => send()}>{busy ? "Thinking..." : "Send"}</Button></div>
    </div>
  </main>;
}
