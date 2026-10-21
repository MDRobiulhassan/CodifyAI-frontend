import { useEffect, useState } from 'react';
import { api } from '../api';
import type { FileContent, FileNode } from '../types';
import { FileTree } from './FileTree';
import { CenterSpinner } from './Spinner';
import { Code2, File as FileIcon, RefreshCw } from 'lucide-react';

interface CodePanelProps {
  projectId: number;
}

export function CodePanel({ projectId }: CodePanelProps) {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selected, setSelected] = useState<string | undefined>();
  const [file, setFile] = useState<FileContent | null>(null);
  const [loadingTree, setLoadingTree] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false);
  const [error, setError] = useState('');

  const loadTree = async () => {
    setLoadingTree(true);
    setError('');
    try {
      const data = await api.getFileTree(projectId);
      setTree(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load files.');
    } finally {
      setLoadingTree(false);
    }
  };

  useEffect(() => { loadTree(); }, [projectId]);

  const openFile = async (path: string) => {
    setSelected(path);
    setLoadingFile(true);
    try {
      const data = await api.getFile(projectId, path);
      setFile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load file.');
      setFile(null);
    } finally {
      setLoadingFile(false);
    }
  };

  if (loadingTree) return <CenterSpinner label="Loading files…" />;

  if (error && tree.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <p className="text-sm text-charcoal-400">{error}</p>
        <button onClick={loadTree} className="mt-3 btn-outline py-1.5 px-3 text-xs">
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="w-12 h-12 rounded-full bg-cream-200 grid place-items-center text-charcoal-400 mb-4">
          <Code2 size={24} />
        </div>
        <h3 className="font-semibold text-charcoal-700">No files yet</h3>
        <p className="mt-1.5 text-sm text-charcoal-400 max-w-xs">
          Send a message to the AI and your generated files will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-cream-100">
      <div className="w-56 shrink-0 border-r border-cream-200 overflow-y-auto scrollbar-thin bg-cream-50">
        <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-charcoal-400 font-semibold">Files</div>
        <FileTree nodes={tree} selectedPath={selected} onSelect={openFile} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {selected ? (
          <>
            <div className="flex items-center gap-2 px-4 h-9 border-b border-cream-200 text-xs text-charcoal-400 font-mono">
              <FileIcon size={12} className="text-charcoal-400" /> {selected}
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin bg-charcoal-800">
              {loadingFile ? (
                <CenterSpinner />
              ) : file ? (
                <pre className="p-4 text-xs font-mono text-cream-100 leading-relaxed">
                  <code>{file.content}</code>
                </pre>
              ) : (
                <p className="p-4 text-sm text-cream-200">Could not load file.</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-charcoal-400">
            Select a file to view its contents
          </div>
        )}
      </div>
    </div>
  );
}
