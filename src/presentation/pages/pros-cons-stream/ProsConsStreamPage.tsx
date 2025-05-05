import { useState, useRef, useEffect } from 'react';
import { GptMessages, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { prosconsStreamGeneratorUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  id: string;
}

export const ProsConsStreamPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handlePost = async (text: string) => {
    if (!isMountedRef.current) return;
  
    try {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
  
      setIsLoading(true);
  
      // Agregar mensaje del usuario
      const userMessage: Message = {
        text,
        isGpt: false,
        id: Date.now().toString() + 'user'
      };
      setMessages(prev => [...prev, userMessage]);
  
      // Agregar placeholder para la respuesta
      const gptMessageId = Date.now().toString() + 'gpt';
      setMessages(prev => [...prev, {
        text: '▌',
        isGpt: true,
        id: gptMessageId
      }]);
  
      // Procesar el stream
      let fullText = '';
      const streamGenerator = prosconsStreamGeneratorUseCase(
        text,
        abortControllerRef.current.signal
      );
  
      // Usar un bucle con delay para evitar bloquear el render
      const processStream = async () => {
        for await (const chunk of streamGenerator) {
          if (!isMountedRef.current) break;
  
          fullText += chunk;
          
          // Actualizar el estado con debounce para mejor rendimiento
          setMessages(prev => prev.map(msg => 
            msg.id === gptMessageId 
              ? { ...msg, text: fullText + '▌' }
              : msg
          ));
          
          // Pequeño delay para permitir que React renderice
          await new Promise(resolve => setTimeout(resolve, 10));
        }
  
        // Remover cursor al finalizar
        if (isMountedRef.current) {
          setMessages(prev => prev.map(msg => 
            msg.id === gptMessageId 
              ? { ...msg, text: fullText }
              : msg
          ));
        }
      };
  
      await processStream();
  
    } catch (error) {
      if (isMountedRef.current && error !== 'AbortError') {
        console.error('Stream error:', error);
        setMessages(prev => [
          ...prev,
          {
            text: 'Error al procesar la respuesta',
            isGpt: true,
            id: Date.now().toString() + 'error'
          }
        ]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="chat-container flex flex-col h-full p-4">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="messages-container flex flex-col flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-y-4 px-2 md:px-4">
            <GptMessages text="¿Qué deseas comparar hoy? Ejemplo: 'iPhone vs Android'" />

            {messages.map((message) => (
              message.isGpt ? (
                <div key={message.id} className="col-start-1 col-end-12">
                  <GptMessages text={message.text} />
                </div>
              ) : (
                <div key={message.id} className="col-start-2 col-end-13">
                  <MyMessage text={message.text} />
                </div>
              )
            ))}

            {isLoading && !messages.some(m => m.isGpt && m.text.includes('▌')) && (
              <div className="col-start-1 col-end-12">
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