
interface Props {
  className?: string;
}

export const TypingLoader = ({ className = '' }: Props) => {
  return (
    <div className={`flex items-center justify-start p-4 ${className}`}>
      <div className="flex space-x-2 px-4 py-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>
    </div>
  );
};
