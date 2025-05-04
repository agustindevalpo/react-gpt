import { useState, useRef, useEffect } from 'react';
import { GptMessages, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosconsStreamUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMessageId, setCurrentMessageId] = useState<number | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text, isGpt: false }]);
    
    // Agregar mensaje vacío de GPT que se actualizará
    const newMessageId = Date.now();
    setCurrentMessageId(newMessageId);
    setMessages(prev => [...prev, { text: '', isGpt: true }]);

    try {
      const reader = await prosconsStreamUseCase(text);
      if (!reader || typeof reader.read !== 'function') {
        throw new Error('No se pudo generar el reader válido');
      }

      const decoder = new TextDecoder();
      let messageContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const decodedChunk = decoder.decode(value, { stream: true });
        messageContent += decodedChunk;

        // Actualizar el mensaje en tiempo real
        setMessages( (messages) => {
           const newMessages = [...messages];
           newMessages [ newMessages.length -1 ].text = messageContent;
           return newMessages;
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.filter(msg => !(msg.isGpt && msg.text === '')));
      setMessages(prev => [...prev, { text: 'Error al obtener respuesta', isGpt: true }]);
    } finally {
      setIsLoading(false);
      setCurrentMessageId(null);
    }
  };

  return (
    <div className="chat-container flex flex-col h-full p-4">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="messages-container flex flex-col flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-y-4 px-2 md:px-4">
            <GptMessages text='¿Qué deseas comparar hoy?' />

            {messages.map((message, index) => (
              message.isGpt ? (
                <div key={`${index}-${message.text}`} className="col-start-1 col-end-12">
                  <GptMessages text={message.text} />
                </div>
              ) : (
                <div key={`${index}-${message.text}`} className="col-start-2 col-end-13">
                  <MyMessage text={message.text} />
                </div>
              )
            ))}

            {isLoading && !messages.some(m => m.isGpt && m.text === '') && (
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