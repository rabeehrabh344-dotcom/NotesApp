import { useEffect, useState } from "react";

function NoteForm({ onAddNote, editingNote, onUpdateNote, showArchived, setShowArchived}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [error, setError] = useState("");
  const [tags, setTags] = useState("");

    useEffect(() => {
      if (editingNote) {
        setTitle(editingNote.title);
        setContent(editingNote.content);
        setColor(editingNote.color);
        setTags(editingNote.tags.join(", "));
      }
    }, [editingNote]);

  function handleSubmit() {
  if (content.trim() === "") {
    setError("Content is required.");
    return;
  }

  if (editingNote) {
    const updatedNote = {
      ...editingNote,
      title: title,
      content: content,
      color: color,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== ""),
      updatedAt: new Date().toISOString(),
    };

    onUpdateNote(updatedNote);

    setError("");
    setTitle("");
    setContent("");
    setTags("");
    setColor("yellow");

    return;
  }

  const result = onAddNote(title, content, color, tags);

  if (!result.success) {
    setError(result.message);
    return;
  }

  setError("");
  setTitle("");
  setContent("");
  setTags("");
  setColor("yellow");
}

  return (
    <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
      <input
        type="text"
        placeholder="Title"
        value={title}
        maxLength={100}
        onChange={(event) => setTitle(event.target.value)}
        className="mb-3 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <p className="mb-3 text-right text-xs text-gray-500">
        {title.length}/100
      </p>

      <textarea
        placeholder="Write your note..."
        rows="4"
        value={content}
        maxLength={1000}
        onChange={(event) => setContent(event.target.value)}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault();
            handleSubmit();
          }
        }}
        className="mb-3 w-full resize-none rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <input
        type="text"
        placeholder="Add Tags"
        value={tags}
        onChange={(event) => setTags(event.target.value)}
        className="mb-4 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

    <div className="mb-4 flex gap-2">
      <button
        type="button"
        onClick={() => setColor("yellow")}
        className="h-8 w-8 rounded-full bg-yellow-200 border-2 border-yellow-400"
        aria-label="Yellow"
      />

      <button
        type="button"
        onClick={() => setColor("green")}
        className="h-8 w-8 rounded-full bg-green-200 border-2 border-green-400"
        aria-label="Green"
      />

      <button
        type="button"
        onClick={() => setColor("blue")}
        className="h-8 w-8 rounded-full bg-blue-200 border-2 border-blue-400"
        aria-label="Blue"
      />

      <button
        type="button"
        onClick={() => setColor("red")}
        className="h-8 w-8 rounded-full bg-red-200 border-2 border-red-400"
        aria-label="Red"
      />

      <button
        type="button"
        onClick={() => setColor("purple")}
        className="h-8 w-8 rounded-full bg-purple-200 border-2 border-purple-400"
        aria-label="Purple"
      />
    </div>

      {error && (
        <p className="mb-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
      <button
        onClick={handleSubmit}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        {editingNote ? "Update Note" : "Add Note"}
      </button>

      <button
        type="button"
        onClick={() => setShowArchived(!showArchived)}
        className="rounded-lg bg-gray-700 px-4 py-2 text-white hover:bg-gray-800">
        {showArchived ? "Hide Archived" : "Show Archived"}
      </button>
    </div>
    </div>
  );
}

export default NoteForm;