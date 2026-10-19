import type { FileNode } from '../types';
import { ChevronRight, ChevronDown, File as FileIcon, Folder, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath?: string;
  onSelect: (path: string) => void;
}

export function FileTree({ nodes, selectedPath, onSelect }: FileTreeProps) {
  return (
    <div className="text-sm py-1">
      {nodes.map((n) => (
        <TreeItem key={n.path} node={n} depth={0} selectedPath={selectedPath} onSelect={onSelect} />
      ))}
    </div>
  );
}

function TreeItem({
  node, depth, selectedPath, onSelect,
}: { node: FileNode; depth: number; selectedPath?: string; onSelect: (p: string) => void }) {
  const [open, setOpen] = useState(depth < 1);
  const isSelected = selectedPath === node.path;

  if (node.type === 'directory') {
    return (
      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-ink-800/70 text-ink-200"
          style={{ paddingLeft: depth * 12 + 8 }}
        >
          {open ? <ChevronDown size={14} className="text-ink-400" /> : <ChevronRight size={14} className="text-ink-400" />}
          {open ? <FolderOpen size={14} className="text-brand-400" /> : <Folder size={14} className="text-brand-400" />}
          <span className="truncate">{node.name}</span>
        </button>
        {open && node.children && (
          <div>
            {node.children.map((c) => (
              <TreeItem key={c.path} node={c} depth={depth + 1} selectedPath={selectedPath} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md transition ${
        isSelected ? 'bg-brand-400/10 text-brand-300' : 'text-ink-300 hover:bg-ink-800/70 hover:text-ink-100'
      }`}
      style={{ paddingLeft: depth * 12 + 28 }}
    >
      <FileIcon size={13} className={isSelected ? 'text-brand-400' : 'text-ink-400'} />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
