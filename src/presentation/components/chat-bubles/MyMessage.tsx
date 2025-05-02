import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
    text: string;
}

export const MyMessage = ({ text }: Props) => {
    return (
        <div className='col-start-5 col-end-13 p-2 rounded-lg'>
          <div className='flex items-center justify-end gap-3'>
            <div className='markdown-message px-4 py-3 text-sm bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl rounded-tr-none shadow-lg whitespace-pre-wrap'>
              {text.split('\n').map((paragraph, i) => (
                <p key={i} className={i < text.split('\n').length - 1 ? 'mb-3' : ''}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className='flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold shadow-md'>
              Tú
            </div>
          </div>
        </div>
      );
    };