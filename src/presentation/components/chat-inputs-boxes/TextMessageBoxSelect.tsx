import React, { FormEvent, useState } from 'react';

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  className?: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
}

export const TextMessageBoxSelect = ({ 
  onSendMessage, 
  placeholder = 'Escribe tu mensaje aquí...', 
  disableCorrections = false,
  className = '',
  options
}: Props) => {
  const [message, setMessage] = useState('');
  const [selectedOption, setSelectedOption] = useState(options[0]?.id || '');

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();  
    if (message.trim().length === 0) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form
      onSubmit={handleSendMessage}
      className={`flex flex-row items-center h-14 sm:h-16 w-full px-3 sm:px-4 bg-gray-800 border-t border-gray-700 ${className}`}
    >
      {/* Selector de idioma compacto */}
      <div className="relative mr-2 w-24">
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          className="block appearance-none w-full bg-gray-700 border border-gray-600 text-gray-200 py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
        >
          {options.map(({id, text}) => (
            <option key={id} value={id} className="bg-gray-800 text-gray-200">
              {text}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>

      {/* Campo de texto */}
      <div className='flex-grow mr-2 sm:mr-3'>
        <input
          type='text'
          autoFocus
          name='message'
          className='w-full h-10 sm:h-11 px-3 sm:px-4 text-gray-100 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400 text-sm sm:text-base'
          placeholder={placeholder}
          autoComplete={disableCorrections ? 'on' : 'off'}
          autoCorrect={disableCorrections ? 'on' : 'off'}
          spellCheck={disableCorrections ? 'true' : 'false'}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {/* Botón de enviar */}
      <button 
        className='flex-shrink-0 flex items-center justify-center h-10 sm:h-11 w-10 sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 px-3 sm:px-4'
        type='submit'
      >
        <i className='fa-regular fa-paper-plane text-sm sm:text-base'></i>
        <span className='hidden sm:inline ml-2 font-medium text-sm'>Enviar</span>
      </button>
    </form>
  );
};