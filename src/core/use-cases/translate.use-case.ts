export const translateTextUseCase = async (prompt: string, lang: string) => {
    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, lang }),
        });

        const data = await resp.json();

        if (!resp.ok) {
            return {
                ok: false,
                message: data.message || 'Error en la traducción'
            };
        }

        return {
            ok: true,
            message: 'Traducción completada',
            content: data.content
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            ok: false,
            message: 'Error de conexión con el servidor'
        };
    }
};