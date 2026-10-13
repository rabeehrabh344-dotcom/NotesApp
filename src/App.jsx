import { useEffect, useState } from "react";
import Header from "./components/Header";
import NoteCard from "./components/NoteCard";
import NoteForm from "./components/NoteForm";

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Learn React",
      content: "Today I learned about React components.",
      color: "yellow",
      tags: ["React", "Learning"],
      createdAt: "2026-10-02",
      updatedAt: "2026-10-02",
      isArchived: false,
      isPinned: true,
    },
    {
      id: 2,
      title: "Shopping List",
      content: "Milk, bread, eggs, and fruits.",
      color: "green",
      tags: ["Shopping"],
      createdAt: "2026-10-01",
      updatedAt: "2026-10-01",
      isArchived: false,
      isPinned: false,
    },
  ]);

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
  const savedNotes = localStorage.getItem("notes");

  if (savedNotes) {
    setNotes(JSON.parse(savedNotes));
  }

  setIsLoaded(true);
}, []);

useEffect(() => {
  if (isLoaded) {
    localStorage.setItem("notes", JSON.stringify(notes));
  }
}, [notes, isLoaded]);

  const [editingNote, setEditingNote] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNotes, setSelectedNotes] = useState([]);

  const filteredNotes = notes
  .filter((note) => !note.isArchived)
  .filter((note) => {
    const search = searchTerm.toLowerCase().trim();

    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(search)
      )
    );
  })
  .sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "color") {
      return a.color.localeCompare(b.color);
    }

    if (a.isPinned !== b.isPinned) {
  return b.isPinned - a.isPinned;
}

return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  function handleAddNote(title, content, color, tags) {
    const duplicateNote = notes.some(
      (note) =>
        note.title.trim().toLowerCase() ===
          title.trim().toLowerCase() &&
        note.content.trim().toLowerCase() ===
          content.trim().toLowerCase()
    );

    if (duplicateNote) {
      return {
        success: false,
        message:
          "A note with the same title and content already exists.",
      };
    }

    const newNote = {
      id: Date.now(),
      title: title,
      content: content,
      color: color,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isArchived: false,
      isPinned: false,
    };

    setNotes((currentNotes) => [
      ...currentNotes,
      newNote,
    ]);

    return {
      success: true,
      message: "",
    };
  }

  function handleEditNote(note) {
    setEditingNote(note);
  }

  function handleUpdateNote(updatedNote) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === updatedNote.id
          ? updatedNote
          : note
      )
    );

    setEditingNote(null);
  }

  function handleDeleteNote(noteId) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== noteId)
    );

    if (editingNote && editingNote.id === noteId) {
      setEditingNote(null);
    }
  }

  function handleDeleteSelected() {
  setNotes((currentNotes) =>
    currentNotes.filter(
      (note) => !selectedNotes.includes(note.id)
    )
  );

  setSelectedNotes([]);
}

  function handleArchiveNote(noteId) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId
          ? { ...note, isArchived: true }
          : note
      )
    );
  }

  function handleUnarchiveNote(noteId) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId
          ? { ...note, isArchived: false }
          : note
      )
    );
  }

  function handleTogglePin(noteId) {
  setNotes((currentNotes) =>
    currentNotes.map((note) =>
      note.id === noteId
        ? { ...note, isPinned: !note.isPinned }
        : note
    )
  );
}

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

    <main className="p-6">
      <h2 className="mb-4 text-xl font-semibold">
        My Notes
      </h2>

    <NoteForm
      onAddNote={handleAddNote}
      editingNote={editingNote}
      onUpdateNote={handleUpdateNote}
      showArchived={showArchived}
      setShowArchived={setShowArchived}
    />
   
   <div className="mb-6 flex flex-col gap-3 sm:flex-row">

    <button
      onClick={handleDeleteSelected}
      disabled={selectedNotes.length === 0}
      className="rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400">
      Delete Selected ({selectedNotes.length})
    </button>

      <button
        onClick={() => {
          const allVisibleSelected = filteredNotes.every(
            (note) => selectedNotes.includes(note.id)
          );

          if (allVisibleSelected) {
          setSelectedNotes((currentSelected) =>
            currentSelected.filter(
              (id) => !filteredNotes.some((note) => note.id === id)
            )
          );
        } else {
          setSelectedNotes((currentSelected) => [
            ...new Set([
              ...currentSelected,
              ...filteredNotes.map((note) => note.id),
            ]),            ]);
        }
        }}
        disabled={filteredNotes.length === 0}
        className="rounded-lg bg-gray-700 px-4 py-3 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {filteredNotes.length > 0 &&
        filteredNotes.every((note) => selectedNotes.includes(note.id))
          ? "Deselect All"
          : "Select All"}
      </button>

  <input
    type="text"
    placeholder="Search notes..."
    value={searchTerm}
    onChange={(event) =>
      setSearchTerm(event.target.value)
    }
    className="w-full rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
  />

  <select
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
    className="rounded-lg border bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="date">Sort by Date</option>
    <option value="title">Sort by Title</option>
    <option value="color">Sort by Color</option>
  </select>

  <div className="flex gap-2">
    <button
      onClick={() => setViewMode("grid")}
      className={`rounded-lg px-4 py-3 ${
        viewMode === "grid"
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700"
      }`}
    >
      Grid
    </button>

    <button
      onClick={() => setViewMode("list")}
      className={`rounded-lg px-4 py-3 ${
        viewMode === "list"
        ? "bg-blue-600 text-white"
        : "bg-white text-gray-700"
      }`}
    >
      List
    </button>
  </div>
</div>

        {filteredNotes.length === 0 ? (
  <div className="rounded-xl bg-white p-10 text-center shadow-sm">
    <h3 className="mb-2 text-lg font-semibold text-gray-700">
      {searchTerm.trim() === ""
        ? "No notes yet"
        : "No notes found"}
    </h3>

    <p className="text-sm text-gray-500">
      {searchTerm.trim() === ""
        ? "Create your first note to get started."
        : "Try searching with a different keyword."}
    </p>
  </div>
) : (
  <div
  className={
    viewMode === "grid"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "flex flex-col gap-4"
  }
>
  {filteredNotes.map((note) => (
    <NoteCard
      key={note.id}
      note={note}
      onEdit={handleEditNote}
      onDelete={handleDeleteNote}
      onArchive={handleArchiveNote}
      onTogglePin={handleTogglePin}
      selectedNotes={selectedNotes}
      setSelectedNotes={setSelectedNotes}
    />
  ))}
</div>
  )}
        {showArchived && (
  <div className="mt-8">
    <h2 className="mb-4 text-xl font-semibold">
      Archived Notes
    </h2>

    <div
      className={
        viewMode === "grid"
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          : "flex flex-col gap-4"
      }
    >
      {notes
        .filter((note) => note.isArchived)
        .map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={handleEditNote}
            onDelete={handleDeleteNote}
            onArchive={handleArchiveNote}
            onUnarchive={handleUnarchiveNote}
            onTogglePin={handleTogglePin}
            selectedNotes={selectedNotes}
            setSelectedNotes={setSelectedNotes}
            />
        ))}
    </div>
  </div>
  )}
  </main>
  </div>
  );
}

export default App;