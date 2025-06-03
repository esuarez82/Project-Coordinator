// src/components/ThreadedCommentSection.js
import React, { useEffect, useState } from "react";
import { format, parseISO, startOfWeek, startOfMonth } from "date-fns";

function ThreadedCommentSection({ type, id }) {
  const storageKey = `${type}-comments-${id}`;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) setComments(JSON.parse(stored));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(comments));
  }, [comments, storageKey]);

  const handleAddComment = () => {
    if (!newComment.trim() && files.length === 0) return;

    const readerPromises = Array.from(files).map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve({ name: file.name, data: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readerPromises).then(filePreviews => {
      const newEntry = {
        text: newComment,
        timestamp: new Date().toISOString(),
        images: filePreviews
      };
      const updated = [...comments, newEntry];
      setComments(updated);
      setNewComment("");
      setFiles([]);
    });
  };

  const handleDelete = (index) => {
    const updated = [...comments];
    updated.splice(index, 1);
    setComments(updated);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setNewComment(comments[index].text);
  };

  const handleSaveEdit = () => {
    const updated = [...comments];
    updated[editingIndex].text = newComment;
    setComments(updated);
    setEditingIndex(null);
    setNewComment("");
  };

  const groupComments = () => {
    const grouped = {};
    comments.forEach(comment => {
      const date = parseISO(comment.timestamp);
      const month = format(startOfMonth(date), "MMMM yyyy");
      const week = format(startOfWeek(date), "'Week of' MMM d");

      if (!grouped[month]) grouped[month] = {};
      if (!grouped[month][week]) grouped[month][week] = [];
      grouped[month][week].push(comment);
    });
    return grouped;
  };

  const grouped = groupComments();

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, borderRadius: 8 }}>
      <h4 style={{ marginBottom: 10 }}>Comments</h4>
      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
        rows={3}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        style={{ marginBottom: 8 }}
      />
      <div>
        {editingIndex !== null ? (
          <button onClick={handleSaveEdit}>💾 Save</button>
        ) : (
          <button onClick={handleAddComment}>➕ Add</button>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        {Object.entries(grouped).map(([month, weeks]) => (
          <div key={month} style={{ marginBottom: 16 }}>
            <h5>{month}</h5>
            {Object.entries(weeks).map(([week, entries]) => (
              <div key={week} style={{ marginLeft: 10 }}>
                <strong>{week}</strong>
                <ul>
                  {entries.map((comment, index) => (
                    <li key={index} style={{ marginBottom: 10 }}>
                      <div>{comment.text}</div>
                      <div style={{ fontSize: "0.8em", color: "#666" }}>
                        {format(parseISO(comment.timestamp), "PPpp")}
                      </div>
                      {comment.images &&
                        comment.images.map((img, idx) => (
                          <div key={idx} style={{ marginTop: 4 }}>
                            <img
                              src={img.data}
                              alt={img.name}
                              style={{
                                maxWidth: 200,
                                border: "1px solid #ccc",
                                marginRight: 8
                              }}
                              onClick={() => window.open(img.data, "_blank")}
                            />
                          </div>
                        ))}
                      <div style={{ marginTop: 4 }}>
                        <button onClick={() => handleEdit(index)}>✏️ Edit</button>{" "}
                        <button onClick={() => handleDelete(index)}>🗑 Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThreadedCommentSection;
