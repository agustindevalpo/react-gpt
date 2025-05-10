import { useState, useRef, useEffect } from 'react';
import { GptMessages, MyMessage, TextMessageBoxSelect, TypingLoader } from '../../components';
import { translateTextUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
];

export const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePost = async (text: string, selectedOption: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: `Traduce: "${text}" al idioma ${selectedOption}`, isGpt: false }]);

    try {
      const { ok, message, content } = await translateTextUseCase(text, selectedOption);

      if (!ok) {
        setMessages(prev => [...prev, { text: `⚠️ ${message}`, isGpt: true }]);
      } else {
        setMessages(prev => [...prev, { text: content ?? message, isGpt: true }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { text: '⚠️ Error inesperado al traducir el texto.', isGpt: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container flex flex-col h-full p-4">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="messages-container flex flex-col flex-1 overflow-y-auto">
          <div className="grid grid-cols-12 gap-y-4 px-2 md:px-4">
            <GptMessages text="¿Qué quieres que traduzca hoy?" />

            {messages.map((message, index) =>
              message.isGpt
                ? <GptMessages key={index} text={message.text} />
                : <MyMessage key={index} text={message.text} />
            )}

            {isLoading && (
              <div className="col-start-1 col-end-12 animate-fade-in">
                <TypingLoader />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="mt-4">
          <TextMessageBoxSelect
            onSendMessage={handlePost}
            placeholder="Escribe acá lo que deseas"
            options={languages}
          
          />
        </div>
      </div>
    </div>
  );
};
