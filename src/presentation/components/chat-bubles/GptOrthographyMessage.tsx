export interface ErrorItem {
  error: string;
  solution: string;
}

interface Props {
  userScore: number;
  errors: ErrorItem[];
  message: string;
}

export const GptOrthographyMessages = ({ userScore, errors, message }: Props) => {
  return (
    <div className='col-start-1 col-end-9 p-2 rounded-lg'>
      <div className='flex items-start gap-3'>
        <div className='flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold shadow-md'>
          AI
        </div>
        
        <div className='px-4 py-3 text-sm bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-2xl rounded-tl-none shadow-lg whitespace-pre-wrap'>
          <div className="mb-4">
            <p className="font-bold text-emerald-400">Texto original:</p>
            <p className="italic">{message}</p>
          </div>

          <div className="mb-4">
            <p className="font-bold text-emerald-400">Puntuación: 
              <span className={`font-mono ${userScore >= 80 ? 'text-green-400' : userScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {userScore}/100
              </span>
            </p>
          </div>

          {errors.length > 0 && (
            <div className="mb-4">
              <p className="font-bold text-emerald-400">Errores encontrados ({errors.length}):</p>
              <ul className="list-disc pl-5 space-y-2">
                {errors.map((errorItem, index) => (
                  <li key={index} className="text-rose-300">
                    <p><strong>Error:</strong> {errorItem.error}</p>
                    <p><strong>Solución:</strong> {errorItem.solution}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="font-bold text-emerald-400">Sugerencias:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Revisa cada error marcado cuidadosamente</li>
              <li>Practica con ejercicios específicos</li>
              {userScore < 70 && <li>Considera repasar las reglas básicas</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


export type OrthographyError = string | { error: string; solution?: string };