"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/auth";
import { toast } from "sonner";
import TopicSelector from "@/components/TopicSelector";
import CreateNoteModal from "@/components/CreateNoteModal";
import EditNoteModal from "@/components/EditNoteModal";
import NoteCard from "@/components/NoteCard";
import NoteDetailsModal from "@/components/NoteDetailsModal";

export default function NotesPage() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [noteCount, setNoteCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch notes when topic is selected
  useEffect(() => {
    if (selectedTopic) {
      fetchNotes();
    } else {
      setNotes([]);
      setFilteredNotes([]);
      setNoteCount(0);
    }
  }, [selectedTopic]);

  // Filter notes based on search and language
  useEffect(() => {
    let filtered = notes;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by language
    if (languageFilter) {
      filtered = filtered.filter((note) => note.language === languageFilter);
    }

    setFilteredNotes(filtered);
  }, [notes, searchQuery, languageFilter]);

  const fetchNotes = async () => {
    if (!selectedTopic) return;

    try {
      setIsLoading(true);
      const [notesData, countData] = await Promise.all([
        apiCall(`/api/topics/${selectedTopic}/notes`),
        apiCall(`/api/topics/${selectedTopic}/notes/count`),
      ]);

      if (notesData && Array.isArray(notesData)) {
        setNotes(notesData);
      }
      if (countData) {
        setNoteCount(countData.count || countData);
      }
    } catch (error) {
      toast.error("Failed to load notes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      const response = await apiCall(`/api/topics/${selectedTopic}/notes`, {
        method: "POST",
        body: JSON.stringify(noteData),
      });

      if (response) {
        toast.success("Note created successfully!");
        setShowCreateModal(false);
        fetchNotes();
      }
    } catch (error) {
      toast.error("Failed to create note");
      console.error(error);
    }
  };

  const handleUpdateNote = async (noteData) => {
    if (!selectedNote) return;

    try {
      const response = await apiCall(
        `/api/topics/${selectedTopic}/notes/${selectedNote.id}`,
        {
          method: "PUT",
          body: JSON.stringify(noteData),
        },
      );

      if (response) {
        toast.success("Note updated successfully!");
        setShowEditModal(false);
        setSelectedNote(null);
        fetchNotes();
      }
    } catch (error) {
      toast.error("Failed to update note");
      console.error(error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await apiCall(`/api/topics/${selectedTopic}/notes/${noteId}`, {
        method: "DELETE",
      });

      toast.success("Note deleted successfully!");
      fetchNotes();
    } catch (error) {
      toast.error("Failed to delete note");
      console.error(error);
    }
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setShowEditModal(true);
  };

  const handleViewClick = (note) => {
    setSelectedNote(note);
    setShowDetailModal(true);
  };

  // Get unique languages from notes
  const languages = [
    ...new Set(notes.map((note) => note.language).filter(Boolean)),
  ];

  return (
    <div className="w-full p-8">
      {/* Header */}
      <h1
        className="text-[32px] font-semibold text-slate-900 tracking-tight mb-2"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Notes & Code Snippets
      </h1>
      <p className="text-[14px] text-slate-500 font-light mb-8">
        Create, manage, and organize your code snippets and notes by topic
      </p>

      {/* Topic Selector */}
      <TopicSelector
        selectedTopic={selectedTopic}
        onTopicChange={setSelectedTopic}
        isLoading={isLoading}
      />

      {selectedTopic && (
        <>
          {/* Top Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <input
              type="text"
              placeholder="Search notes by title, content, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-800 placeholder-slate-400 text-[14px] transition-all"
            />

            {/* Language Filter */}
            {languages.length > 0 && (
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 text-slate-800 text-[14px] transition-all"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            )}

            {/* Create Button - Responsive & Active */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14px] font-medium transition-all shadow-sm hover:shadow-md active:scale-[0.98] whitespace-nowrap md:w-auto w-full"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Create Note
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Notes
              </p>
              <h3 className="text-[24px] font-semibold text-slate-900 mt-1">
                {noteCount}
              </h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                Languages
              </p>
              <h3 className="text-[24px] font-semibold text-slate-900 mt-1">
                {languages.length}
              </h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4">
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">
                Showing
              </p>
              <h3 className="text-[24px] font-semibold text-slate-900 mt-1">
                {filteredNotes.length}/{notes.length}
              </h3>
            </div>
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-500">Loading notes...</p>
              </div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                className="mx-auto mb-4 text-slate-300"
              >
                <path
                  d="M4 3h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 7h8M6 10h8M6 13h5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-slate-500 font-light mb-4">
                {searchQuery || languageFilter
                  ? "No notes match your filters"
                  : "No notes yet. Create your first note!"}
              </p>
              {!searchQuery && !languageFilter && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  Create Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteNote}
                  onView={handleViewClick}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && selectedTopic && (
        <CreateNoteModal
          topicId={selectedTopic}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateNote}
        />
      )}

      {showEditModal && selectedNote && (
        <EditNoteModal
          note={selectedNote}
          onClose={() => {
            setShowEditModal(false);
            setSelectedNote(null);
          }}
          onUpdate={handleUpdateNote}
        />
      )}

      {showDetailModal && selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedNote(null);
          }}
        />
      )}
    </div>
  );
}
