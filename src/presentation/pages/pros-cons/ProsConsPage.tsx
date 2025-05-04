import { useState, useRef, useEffect } from 'react';
import { GptMessages, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosconsUseCase } from '../../../core/use-cases/proscons.use-case';


interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {

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

    try {
      const result = await prosconsUseCase(text);

      if (!result.ok) {
        setMessages((prev) => [...prev, { text: result.content, isGpt: true }]);
      } else {
        setMessages((prev) => [...prev, { 
          text: result.content, 
          isGpt: true 
        }]);
      }
    } catch (error) {
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
              text='Hola, puedes escribir dos o más cosas que quieras comparar su pros y sus contras. Yo te responderé'
            />

            {messages.map((message, index) => (
              message.isGpt ? (
                <div key={index} className="col-start-1 col-end-12">
                  <GptMessages text={message.text} />
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
            placeholder='Ejemplo: "Compara un iPhone vs Android"'
            disableCorrections
          />
        </div>
      </div>
    </div>
  );
};