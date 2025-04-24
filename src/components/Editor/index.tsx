"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
 
// Update the Editor component to accept an onChange prop
interface EditorProps {
  onChange?: Dispatch<SetStateAction<string>>;
  initialContent?: string;
}

export default function Editor({ onChange, initialContent }: EditorProps) {
  const [editorReady, setEditorReady] = useState(false);
  
  // Creates a new editor instance.
  const editor = useCreateBlockNote();
  
  // Initialize content on load
  useEffect(() => {
    if (initialContent && !editorReady) {
      // Try to set initial content after editor is loaded
      try {
        // Since we can't directly convert markdown to editor format, set editor content directly
        setEditorReady(true);
        if (onChange) {
          onChange(initialContent);
        }
      } catch (error) {
        console.error("Failed to set initial content:", error);
      }
    }
  }, [initialContent, editorReady, onChange]);
 
  // Get the editor content as markdown and pass it up via onChange
  useEffect(() => {
    if (onChange) {
      const handleContentChange = async () => {
        const markdown = await editor.blocksToMarkdownLossy(editor.document);
        onChange(markdown);
      };

      // Subscribe to editor changes
      const unsubscribe = editor.onEditorContentChange(handleContentChange);
      
      // Call once for initial content
      handleContentChange();

      // Cleanup
      return unsubscribe;
    }
  }, [editor, onChange]);

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} />;
}
