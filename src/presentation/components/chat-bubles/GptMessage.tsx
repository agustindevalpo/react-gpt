import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
    text: string;
}

export const GptMessages = ({ text }: Props) => {
  return (
    <div className='col-start-1 col-end-9 p-2 rounded-lg'>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-md'>
          AI
        </div>
        <div className='markdown-message px-4 py-3 text-sm bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-2xl rounded-tl-none shadow-lg whitespace-pre-wrap'>
          {text.split('\n').map((paragraph, i) => (
            <p key={i} className={i < text.split('\n').length - 1 ? 'mb-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};