import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  text: string;
}

export const GptMessages = ({ text }: Props) => {
  return (
    <div className="col-start-1 col-end-9 p-2 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-md">
          AI
        </div>
        <div className="prose prose-invert max-w-none px-4 py-3 text-sm bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-2xl rounded-tl-none shadow-lg">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-bold text-emerald-400 mb-4 mt-2" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-semibold text-emerald-400 mb-3 mt-4 border-b border-emerald-500 pb-1" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-medium text-emerald-300 mb-2 mt-3" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="mb-3 leading-relaxed" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-gray-200" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-5 mb-4 space-y-1 marker:text-emerald-400" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-5 mb-4 space-y-1 marker:text-emerald-400" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="mb-1" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-4 text-gray-300" {...props} />
              ),
              code: ({ inline, children, ...props }: any) => {
                return !inline ? (
                  <pre className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
                    <code className="text-sm text-emerald-200" {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-gray-700 text-emerald-200 px-1 py-0.5 rounded text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {text}
          </Markdown>
        </div>
      </div>
    </div>
  );
};
