import {  ProsConsResponse } from "../../interfaces";


export const prosconsUseCase = async( prompt: string ) => {

    try{

      const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser` , {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt})
      });

      if( !resp.ok ) throw new Error('No se pudo comunicar con el asistente');

      const data = await resp.json() as ProsConsResponse;

      return {
        ok: true,
        content: data.content || 'No se recibió respuesta'
      };

    }catch( error ){
       return {
        ok:false,
         content: 'No se pudo comunicar con el asistente'
       }
    }

}