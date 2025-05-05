import { useState, useRef, useEffect } from 'react';
import {  ErrorItem, GptMessages, GptOrthographyMessages, MyMessage, OrthographyError, TextMessageBox, TypingLoader } from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: ErrorItem[];
    message: string;
  }
}

export const OrthographyPage = () => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
  
    try {
      const result = await orthographyUseCase(text);
      
      if (!result.ok) {
        setMessages((prev) => [...prev, { text: 'Error al obtener respuesta', isGpt: true }]);
      } else {
        // Type guard para verificar el formato de los errores
        const formatError = (err: OrthographyError): ErrorItem => {
          if (typeof err === 'string') {
            return { error: err, solution: 'Revisar ortografía' };
          }
          return {
            error: err.error,
            solution: err.solution || 'Solución no disponible'
          };
        };
  
        const formattedErrors: ErrorItem[] = result.errors.map(formatError);
        
        setMessages((prev) => [...prev, {
          text: result.message,
          isGpt: true,
          info: { 
            errors: formattedErrors, 
            message: result.message, 
            userScore: result.userScore 
          }
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { text: 'Error al obtener respuesta', isGpt: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container flex flex-col h-full p-4">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="messages-container flex flex-col flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-y-4 px-2 md:px-4">
            <GptMessages
              text='Hola, puedes escribir tu texto en español y te ayudo a corregir la ortografía y gramática.' 
            />

            {messages.map((message, index) => (
              message.isGpt ? (
                <div key={index} className="col-start-1 col-end-12">
                  {message.info ? (
                    <GptOrthographyMessages
                      key={index}
                      errors={message.info.errors}
                      message={message.info.message}
                      userScore={message.info.userScore}
                    />
                  ) : (
                    <GptMessages text={message.text} />
                  )}
                </div>
              ) : (
                <div key={index} className="col-start-2 col-end-13">
                  <MyMessage text={message.text} />
                </div>
              )
            ))}

            {isLoading && (
              <div className='col-start-1 col-end-12'>
                <TypingLoader />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

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