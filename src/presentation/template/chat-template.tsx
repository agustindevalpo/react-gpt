import { useState, useRef, useEffect } from 'react';
import { GptMessages, MyMessage, TypingLoader, TextMessageBox } from '../components';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ChatTemplate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al final de los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    // Simulación de respuesta del asistente
    setTimeout(() => {
      setMessages((prev) => [...prev, { 
        text: 'Este es un ejemplo de respuesta del asistente. Aquí irían las correcciones ortográficas.', 
        isGpt: true 
      }]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="chat-container flex flex-col h-full p-4">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Área de mensajes con márgenes originales */}
        <div className="messages-container flex flex-col flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-y-4 px-2 md:px-4">
            {/* Mensaje de bienvenida */}
            <GptMessages
              text='Hola, puedes escribir tu texto en español y te ayudo a corregir la ortografía y gramática. 
              ### ¿Cómo funciona?
              - Escribe o pega tu texto
              - Recibirás correcciones detalladas
              - Sugerencias de mejora'
            />

            {messages.map((message, index) => (
              message.isGpt
                ? <GptMessages key={index} text={message.text} />
                : <MyMessage key={index} text={message.text} />
            ))}

            {isLoading && (
              <div className='col-start-1 col-end-12 animate-fade-in'>
                <TypingLoader />
              </div>
            )}

            {/* Elemento para el scroll automático */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input de mensaje */}
        <div className="mt-4">
          <TextMessageBox
            onSendMessage={handlePost}
            placeholder='Escribe acá lo que deseas'
            disableCorrections
          />
        </div>
      </div>
    </div>
  );
};