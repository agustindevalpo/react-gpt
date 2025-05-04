export const prosconsStreamUseCase = async (
  prompt: string
): Promise<ReadableStreamDefaultReader<Uint8Array> | null> => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!resp.ok) throw new Error('No se pudo comunicar con el asistente');
    if (!resp.body) throw new Error('No se pudo obtener el stream de respuesta');

    return resp.body.getReader();
  } catch (err) {
    console.error('Error en prosconsStreamUseCase:', err);
    return null;
  }
};