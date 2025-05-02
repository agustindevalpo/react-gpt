import  { FormEvent, useRef, useState } from 'react'

interface Props {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disableCorrections?: boolean;
  className?: string;
  accept? : string;
}

export const TextMessageBoxFile = ({ 
  onSendMessage, 
  placeholder = 'Escribe tu mensaje aquí...', 
  disableCorrections = false,
  className = '',
  accept = ''
}: Props) => {

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null >();
  const inputFileRef = useRef<HTMLInputElement>(null);

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
      <div className='mr-3'>
        <button
            type='button'
            className='flex items-center justify-center text-gray-400 hover:text-gray-600'
            onClick={ () => inputFileRef.current?.click() }
        >
          <i className='fa-solid fa-paperclip text-xl'></i>

        </button>

        <input 
            type='file'
            ref={ inputFileRef }
            accept={ accept }
            onChange={ (e)=> setSelectedFile(e.target.files?.item(0))}
            hidden
        />

      </div>


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

      <button 
        className='flex-shrink-0 flex items-center justify-center h-10 sm:h-11 w-10 sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 px-3 sm:px-4'
        type='submit'
        disabled = { !selectedFile }
      >
        {
          ( !selectedFile )
            ?  <span className='hidden sm:inline ml-2 font-medium text-sm'>Enviar</span>
            :   <span className='hidden sm:inline ml-2 font-medium text-sm'>{ selectedFile.name.substring(0,15) + '...'}</span>
        }
        {/* Mostrar solo icono en móvil, icono + texto en desktop */}
        <i className='fa-regular fa-paper-plane text-sm sm:text-base'></i>
       
      </button>
    </form>
  )
}