import React, { useEffect, useState } from 'react';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessageProps = {
  text: string;
};

type MarkdownComponentProps = {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

type CodeComponentProps = MarkdownComponentProps & {
  inline?: boolean;
};

type HeadingComponentProps = MarkdownComponentProps & {
  level?: number;
};

export const GptMessages: React.FC<MessageProps> = React.memo(({ text }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!text) {
      setDisplayText('');
      return;
    }
  
    let currentIndex = 0;
    const typingSpeed = 15;
    let timer: ReturnType<typeof setTimeout>;
  
    const typeText = () => {
      const nextChar = text[currentIndex];
      if (nextChar !== undefined) {
        setDisplayText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timer = setTimeout(typeText, typingSpeed);
      }
    };
  
    setDisplayText('');
    timer = setTimeout(typeText, typingSpeed);
  
    return () => clearTimeout(timer);
  }, [text]);

  const markdownComponents: Components = {
    h1: ({ className, children, ...props }: HeadingComponentProps) => (
      <h1 className={`text-2xl font-bold text-emerald-400 mb-4 mt-2 ${className || ''}`} {...props}>
        {children}
      </h1>
    ),
    h2: ({ className, children, ...props }: HeadingComponentProps) => (
      <h2 className={`text-xl font-semibold text-emerald-400 mb-3 mt-4 border-b border-emerald-500 pb-1 ${className || ''}`} {...props}>
        {children}
      </h2>
    ),
    h3: ({ className, children, ...props }: HeadingComponentProps) => (
      <h3 className={`text-lg font-medium text-emerald-300 mb-2 mt-3 ${className || ''}`} {...props}>
        {children}
      </h3>
    ),
    p: ({ className, children, ...props }: MarkdownComponentProps) => (
      <p className={`mb-3 leading-relaxed ${className || ''}`} {...props}>
        {children}
      </p>
    ),
    strong: ({ className, children, ...props }: MarkdownComponentProps) => (
      <strong className={`font-semibold text-gray-200 ${className || ''}`} {...props}>
        {children}
      </strong>
    ),
    ul: ({ className, children, ...props }: MarkdownComponentProps) => (
      <ul className={`list-disc pl-5 mb-4 space-y-1 marker:text-emerald-400 ${className || ''}`} {...props}>
        {children}
      </ul>
    ),
    ol: ({ className, children, ...props }: MarkdownComponentProps) => (
      <ol className={`list-decimal pl-5 mb-4 space-y-1 marker:text-emerald-400 ${className || ''}`} {...props}>
        {children}
      </ol>
    ),
    li: ({ className, children, ...props }: MarkdownComponentProps) => (
      <li className={`mb-1 ${className || ''}`} {...props}>
        {children}
      </li>
    ),
    blockquote: ({ className, children, ...props }: MarkdownComponentProps) => (
      <blockquote className={`border-l-4 border-emerald-500 pl-4 italic my-4 text-gray-300 ${className || ''}`} {...props}>
        {children}
      </blockquote>
    ),
    code: ({ inline, className, children, ...props }: CodeComponentProps) => {
      const codeClasses = `text-sm text-emerald-200 ${className || ''}`;
      return inline ? (
        <code className={`bg-gray-700 px-1 py-0.5 rounded ${codeClasses}`} {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-gray-900 rounded-lg p-4 my-4 overflow-x-auto">
          <code className={codeClasses} {...props}>
            {children}
          </code>
        </pre>
      );
    },
    a: ({ className, children, ...props }: MarkdownComponentProps) => (
      <a className={`text-emerald-400 hover:text-emerald-300 underline ${className || ''}`} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
    table: ({ className, children, ...props }: MarkdownComponentProps) => (
      <div className="overflow-x-auto my-4">
        <table className={`min-w-full border border-gray-600 ${className || ''}`} {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ className, children, ...props }: MarkdownComponentProps) => (
      <th className={`border border-gray-600 px-4 py-2 text-left bg-gray-700 ${className || ''}`} {...props}>
        {children}
      </th>
    ),
    td: ({ className, children, ...props }: MarkdownComponentProps) => (
      <td className={`border border-gray-600 px-4 py-2 ${className || ''}`} {...props}>
        {children}
      </td>
    ),
  };

  return (
    <div className="col-start-1 col-end-9 p-2 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-md">
          AI
        </div>
        <div className="prose prose-invert max-w-none px-4 py-3 text-sm bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-2xl rounded-tl-none shadow-lg">
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {displayText}
          </Markdown>
        </div>
      </div>
    </div>
  );
});

GptMessages.displayName = 'GptMessages';

