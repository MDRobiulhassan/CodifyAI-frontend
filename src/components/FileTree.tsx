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
          className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-cream-200 text-charcoal-700"
          style={{ paddingLeft: depth * 12 + 8 }}
        >
          {open ? <ChevronDown size={14} className="text-charcoal-400" /> : <ChevronRight size={14} className="text-charcoal-400" />}
          {open ? <FolderOpen size={14} className="text-charcoal-500" /> : <Folder size={14} className="text-charcoal-500" />}
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
        isSelected ? 'bg-charcoal-700/[0.06] text-charcoal-700 font-medium' : 'text-charcoal-400 hover:bg-cream-200 hover:text-charcoal-700'
      }`}
      style={{ paddingLeft: depth * 12 + 28 }}
    >
      <FileIcon size={13} className={isSelected ? 'text-charcoal-700' : 'text-charcoal-400'} />
      <span className="truncate">{node.name}</span>
    </button>
  );
}
