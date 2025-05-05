export async function* prosconsStreamGeneratorUseCase(
  prompt: string, 
  abortSignal?: AbortSignal
): AsyncGenerator<string, void, unknown> {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ prompt }),
      signal: abortSignal
    });

    if (!resp.ok) {
      throw new Error(`Error HTTP: ${resp.status}`);
    }

    if (!resp.body) {
      throw new Error('No se pudo obtener el cuerpo de la respuesta');
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      // Procesar todas las líneas completas
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Guardar el último fragmento incompleto

      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          const data = line.replace('data: ', '').trim();
          if (data) {
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                yield parsed.content;
              }
            } catch (error) {
              console.error('Error al parsear JSON:', error);
              // En caso de error, devolver el texto crudo
              yield data;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error en prosconsStreamGeneratorUseCase:', error);
    throw error;
  }
}