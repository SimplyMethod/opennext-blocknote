'use client';

import dynamic from 'next/dynamic';
import { Dispatch, SetStateAction } from 'react';

// Use a type for the component props
interface EditorProps {
  onChange?: Dispatch<SetStateAction<string>>;
}

// Export the dynamic component with the proper type
const DynamicEditor = dynamic<EditorProps>(
  () => import('./Editor').then((mod) => mod.default),
  { ssr: false }
);

export default DynamicEditor;
