import React, { useState } from 'react';
import { Bold, Heading, List, Code, Image as ImageIcon, Eye, Edit3, HelpCircle } from 'lucide-react';

interface HtmlWriterProps {
  initialHtml: string;
  onChange: (html: string) => void;
}

export const HtmlWriter: React.FC<HtmlWriterProps> = ({ initialHtml, onChange }) => {
  const [htmlContent, setHtmlContent] = useState<string>(initialHtml);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [showImageModal, setShowImageModal] = useState<boolean>(false);

  const handleUpdate = (newText: string) => {
    setHtmlContent(newText);
    onChange(newText);
  };

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById('html-theory-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = htmlContent.substring(start, end) || 'Sample text';
    const replacement = `${openTag}${selectedText}${closeTag}`;
    
    const updated = htmlContent.substring(0, start) + replacement + htmlContent.substring(end);
    handleUpdate(updated);
  };

  const insertImage = () => {
    if (!imageUrlInput.trim()) return;
    const imgTag = `\n<div class="my-4 text-center">\n  <img src="${imageUrlInput.trim()}" alt="Lesson diagram" class="max-h-64 mx-auto rounded-2xl border-2 border-ink shadow-solid-sm" />\n  <p class="text-xs text-gray-500 mt-1 italic">Figure: Notebook Reference Diagram</p>\n</div>\n`;
    handleUpdate(htmlContent + imgTag);
    setImageUrlInput('');
    setShowImageModal(false);
  };

  return (
    <div className="space-y-3 bg-paper-light border-2 border-ink rounded-2xl p-4">
      
      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-ink/20">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => insertTag('<h3>', '</h3>')}
            className="p-1.5 rounded-lg border border-ink/30 bg-white hover:bg-paper-muted text-xs font-bold flex items-center gap-1"
            title="Heading"
          >
            <Heading className="w-3.5 h-3.5" />
            <span>H3</span>
          </button>

          <button
            type="button"
            onClick={() => insertTag('<strong>', '</strong>')}
            className="p-1.5 rounded-lg border border-ink/30 bg-white hover:bg-paper-muted text-xs font-bold"
            title="Bold text"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertTag('<ul>\n  <li>', '</li>\n  <li>Second point</li>\n</ul>')}
            className="p-1.5 rounded-lg border border-ink/30 bg-white hover:bg-paper-muted text-xs font-bold"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => insertTag('<pre class="bg-black text-green-400 p-3 rounded-xl font-mono text-xs"><code>', '</code></pre>')}
            className="p-1.5 rounded-lg border border-ink/30 bg-white hover:bg-paper-muted text-xs font-bold"
            title="Code Block"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-1.5 rounded-lg border border-ink/30 bg-white hover:bg-paper-muted text-xs font-bold flex items-center gap-1 text-stamp"
            title="Insert Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>+ Image</span>
          </button>
        </div>

        {/* Write vs Live Preview toggle */}
        <div className="flex items-center bg-white border border-ink/30 rounded-xl p-0.5 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 ${activeTab === 'write' ? 'bg-ink text-white shadow-sm' : 'text-graphite'}`}
          >
            <Edit3 className="w-3 h-3" />
            <span>HTML Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-ink text-white shadow-sm' : 'text-graphite'}`}
          >
            <Eye className="w-3 h-3" />
            <span>Live Rendered View</span>
          </button>
        </div>
      </div>

      {/* Image Embed Input Modal / Bar */}
      {showImageModal && (
        <div className="p-3 bg-white border border-stamp rounded-xl flex items-center space-x-2 text-xs">
          <ImageIcon className="w-4 h-4 text-stamp flex-shrink-0" />
          <input
            type="text"
            placeholder="Paste Diagram or Image URL (e.g. https://example.com/diagram.png)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            className="flex-1 p-1.5 border border-ink/30 rounded-lg text-xs"
          />
          <button
            type="button"
            onClick={insertImage}
            className="px-3 py-1.5 bg-stamp text-white rounded-lg font-bold"
          >
            Insert
          </button>
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            className="text-gray-400 hover:text-ink px-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      {activeTab === 'write' ? (
        <div>
          <textarea
            id="html-theory-editor"
            rows={8}
            value={htmlContent}
            onChange={(e) => handleUpdate(e.target.value)}
            placeholder="<h3>Lesson Overview</h3><p>Write your lesson explanation here...</p>"
            className="w-full p-3 bg-white font-mono text-xs text-ink border border-ink/30 rounded-xl focus:outline-none focus:border-ink leading-relaxed"
          />
          <span className="text-[10px] text-graphite font-mono block mt-1">
            Tip: You can write standard HTML tags (&lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;img&gt;, &lt;strong&gt;) or plain text.
          </span>
        </div>
      ) : (
        <div className="p-4 bg-white border border-ink/30 rounded-xl min-h-[160px] text-xs sm:text-sm text-ink prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}

    </div>
  );
};
