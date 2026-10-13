function NoteCard({
  note,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onTogglePin,
  selectedNotes,
  setSelectedNotes,
}) {
  const colorClasses = {
    yellow: "bg-yellow-100",
    green: "bg-green-100",
    blue: "bg-blue-100",
    red: "bg-red-100",
    purple: "bg-purple-100",
  };

  return (
    <article
      className={`rounded-xl p-5 shadow-sm transition hover:shadow-md ${
        colorClasses[note.color]
      }`}
    >

      <input
  type="checkbox"
  checked={selectedNotes.includes(note.id)}
  onChange={() => {
    if (selectedNotes.includes(note.id)) {
      setSelectedNotes(
        selectedNotes.filter((id) => id !== note.id)
      );
    } else {
      setSelectedNotes([...selectedNotes, note.id]);
    }
  }}
  className="mb-3 h-4 w-4"
/>

      <h3 className="mb-2 text-lg font-bold text-gray-800">
        {note.title}
      </h3>

      <p className="mb-4 text-gray-700">
        {note.content}
      </p>

      
    <div className="mb-4 text-xs text-gray-600">
      <p>
        Created:{" "}
        {new Date(note.createdAt).toLocaleDateString()}
      </p>

      <p>
        Last updated:{" "}
        {new Date(note.updatedAt).toLocaleDateString()}
      </p>
    </div>

      <div className="flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white px-2 py-1 text-xs text-gray-600"
          >
            #{tag}
          </span>
        ))}
      </div>
      
      <button
        onClick={() => onTogglePin(note.id)}
        className="mt-4 rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
      >
        {note.isPinned ? "Unpin" : "Pin"}
      </button>

      <button
        onClick={() => onEdit(note)}
        className="mt-4 rounded-lg bg-gray-800 px-3 py-2 text-sm text-white hover:bg-gray-700"
      >
        Edit
      </button>

      <button
        onClick={() => onDelete(note.id)}
        className="mt-4 ml-2 rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-700"
      >
        Delete
      </button>

      {note.isArchived ? (
        <button
          onClick={() => onUnarchive(note.id)}
          className="mt-4 ml-2 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
        >
          Unarchive
        </button>
      ) : (
        <button
          onClick={() => onArchive(note.id)}
          className="mt-4 ml-2 rounded-lg bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-700"
        >
          Archive
        </button>
      )}
    </article>
  );
}

export default NoteCard;