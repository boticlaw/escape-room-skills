import * as z from 'zod';
import { type GetUserGameProgress, type UpdateGameProgress, type InitializeGameProgress } from 'wasp/server/operations';
import { type User, type GameProgress } from 'wasp/entities';
import { HttpError, prisma } from 'wasp/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Esquema para obtener el progreso del juego
export const getUserGameProgress: GetUserGameProgress<void, GameProgress | null> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  const gameProgress = await prisma.gameProgress.findUnique({
    where: { userId: context.user.id }
  });

  return gameProgress;
};

// Esquema para la entrada de getUserGameProgressById
const getUserGameProgressByIdSchema = z.object({
  userId: z.string().nonempty(),
});

// Operación para obtener el progreso del juego de cualquier usuario (solo para admins)
export const getUserGameProgressById = async (
  args: { userId: string },
  context: { user?: User; entities: any }
) => {
  // Validar argumentos
  const { userId } = getUserGameProgressByIdSchema.parse(args);

  // Verificar autenticación y permisos
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Solo los administradores pueden acceder a esta función');
  }

  // Obtener el progreso del juego
  const gameProgress = await prisma.gameProgress.findUnique({
    where: { userId }
  });

  return gameProgress;
};

// Esquema para inicializar el progreso del juego
const initializeGameProgressSchema = z.object({
  startLevel: z.number().default(0),
});

type InitializeGameProgressInput = z.infer<typeof initializeGameProgressSchema>;

export const initializeGameProgress: InitializeGameProgress<InitializeGameProgressInput, GameProgress> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  // Verificar si ya existe un progreso
  const existingProgress = await prisma.gameProgress.findUnique({
    where: { userId: context.user.id }
  });

  if (existingProgress) {
    return existingProgress;
  }

  // Crear nuevo progreso
  const { startLevel } = initializeGameProgressSchema.parse(args);
  
  return prisma.gameProgress.create({
    data: {
      currentLevel: startLevel,
      maxLevelReached: startLevel,
      userId: context.user.id,
    }
  });
};

// Esquema para actualizar el progreso del juego
const updateGameProgressSchema = z.object({
  currentLevel: z.number().optional(),
  hintsUsed: z.number().optional(),
  wrongAttempts: z.number().optional(),
  levelCompleted: z.boolean().optional(),
});

type UpdateGameProgressInput = z.infer<typeof updateGameProgressSchema>;

export const updateGameProgress: UpdateGameProgress<UpdateGameProgressInput, GameProgress> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  const { currentLevel, hintsUsed, wrongAttempts, levelCompleted } = updateGameProgressSchema.parse(args);
  
  console.log(`--- DEBUG updateGameProgress ---`);
  console.log(`Recibido: currentLevel=${currentLevel}, hintsUsed=${hintsUsed}, wrongAttempts=${wrongAttempts}, levelCompleted=${levelCompleted}`);

  // Obtener el progreso actual
  const existingProgress = await prisma.gameProgress.findUnique({
    where: { userId: context.user.id }
  });

  if (!existingProgress) {
    throw new HttpError(404, 'No se encontró un progreso de juego para este usuario');
  }
  
  console.log(`Progreso actual: currentLevel=${existingProgress.currentLevel}, maxLevelReached=${existingProgress.maxLevelReached}`);

  // Preparar datos para actualizar
  const updateData: any = {};

  if (currentLevel !== undefined) {
    updateData.currentLevel = currentLevel;
    
    // Actualizar el nivel máximo alcanzado si es necesario
    if (currentLevel > existingProgress.maxLevelReached) {
      updateData.maxLevelReached = currentLevel;
      console.log(`Actualizando maxLevelReached a ${currentLevel} porque es mayor que el actual ${existingProgress.maxLevelReached}`);
    }
  }

  if (hintsUsed !== undefined) {
    updateData.hintsUsed = existingProgress.hintsUsed + hintsUsed;
  }

  if (wrongAttempts !== undefined) {
    updateData.wrongAttempts = existingProgress.wrongAttempts + wrongAttempts;
  }

  if (levelCompleted) {
    updateData.lastLevelCompletedAt = new Date();
    
    // Si se marca el nivel como completado, necesitamos asegurarnos de que maxLevelReached
    // permita avanzar al siguiente nivel
    
    // El valor de currentLevel enviado ya es el siguiente nivel al que avanzará el jugador
    const nextLevel = currentLevel !== undefined ? currentLevel : existingProgress.currentLevel;
    
    console.log(`Nivel completado = true, nextLevel (currentLevel enviado): ${nextLevel}`);
    
    // Actualizar maxLevelReached para permitir acceso al siguiente nivel
    if (nextLevel > (updateData.maxLevelReached || existingProgress.maxLevelReached)) {
      updateData.maxLevelReached = nextLevel;
      console.log(`Actualizando maxLevelReached a ${nextLevel} debido a levelCompleted=true`);
    }
  }
  
  console.log(`Datos a actualizar: ${JSON.stringify(updateData)}`);

  // Actualizar el progreso
  const updatedProgress = await prisma.gameProgress.update({
    where: { id: existingProgress.id },
    data: updateData
  });
  
  console.log(`Progreso actualizado: currentLevel=${updatedProgress.currentLevel}, maxLevelReached=${updatedProgress.maxLevelReached}`);
  
  return updatedProgress;
};

// Esquema para actualizar el progreso del juego de cualquier usuario (solo para admins)
const updateUserGameProgressByIdSchema = z.object({
  userId: z.string().nonempty(),
  currentLevel: z.number().optional(),
  maxLevelReached: z.number().optional(),
  hintsUsed: z.number().optional(),
  wrongAttempts: z.number().optional(),
  resetProgress: z.boolean().optional()
});

type UpdateUserGameProgressByIdInput = z.infer<typeof updateUserGameProgressByIdSchema>;

// Operación para actualizar el progreso del juego de cualquier usuario (solo para admins)
export const updateUserGameProgressById = async (
  args: UpdateUserGameProgressByIdInput,
  context: { user?: User; entities: any }
) => {
  // Validar argumentos
  const { userId, currentLevel, maxLevelReached, hintsUsed, wrongAttempts, resetProgress } = 
    updateUserGameProgressByIdSchema.parse(args);

  // Verificar autenticación y permisos
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, 'Solo los administradores pueden acceder a esta función');
  }

  // Obtener el progreso actual
  let existingProgress = await prisma.gameProgress.findUnique({
    where: { userId }
  });

  // Si no existe el progreso y no es un reseteo, crearlo
  if (!existingProgress && !resetProgress) {
    existingProgress = await prisma.gameProgress.create({
      data: {
        userId,
        currentLevel: 0,
        maxLevelReached: 0
      }
    });
  }
  
  // Si es un reseteo, eliminar el progreso existente y crear uno nuevo
  if (resetProgress && existingProgress) {
    await prisma.gameProgress.delete({
      where: { id: existingProgress.id }
    });
    
    // Actualizar la lastUrl del usuario a /game (nivel 0)
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastUrl: '/game'
      }
    });
    
    return prisma.gameProgress.create({
      data: {
        userId,
        currentLevel: 0,
        maxLevelReached: 0,
        hintsUsed: 0,
        wrongAttempts: 0
      }
    });
  }

  // Si no existe y es un reseteo, simplemente crear uno nuevo
  if (resetProgress && !existingProgress) {
    // Actualizar la lastUrl del usuario a /game (nivel 0)
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastUrl: '/game'
      }
    });
    
    return prisma.gameProgress.create({
      data: {
        userId,
        currentLevel: 0,
        maxLevelReached: 0,
        hintsUsed: 0,
        wrongAttempts: 0
      }
    });
  }

  // Si no se encuentra el progreso y no es un reseteo, devolver un error
  if (!existingProgress) {
    throw new HttpError(404, 'No se encontró un progreso de juego para este usuario');
  }

  // Preparar datos para actualizar
  const updateData: any = {};

  if (currentLevel !== undefined) {
    updateData.currentLevel = currentLevel;
  }

  if (maxLevelReached !== undefined) {
    updateData.maxLevelReached = maxLevelReached;
  }

  if (hintsUsed !== undefined) {
    updateData.hintsUsed = hintsUsed;
  }

  if (wrongAttempts !== undefined) {
    updateData.wrongAttempts = wrongAttempts;
  }

  // Actualizar el progreso
  return prisma.gameProgress.update({
    where: { id: existingProgress.id },
    data: updateData
  });
};

// ======================== Operaciones de IA ========================

// Configuración de OpenAI
const openai = setupOpenAI();
function setupOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key is not set');
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Configuración de Gemini
const gemini = setupGemini();
function setupGemini() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Gemini API key is not set');
    return null;
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// Esquemas para validación de entrada
const generateOpenAIResponseSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'model']),
    content: z.string()
  })),
  systemPrompt: z.string(),
  model: z.string().default('gpt-4o-mini')
});

const generateGeminiResponseSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'model', 'assistant']),
    content: z.string()
  })),
  systemPrompt: z.string(),
  model: z.string().default('gemini-2.5-pro-exp-03-25')
});

// Operación para generar respuestas con OpenAI
export const generateOpenAIResponse = async (
  args: z.infer<typeof generateOpenAIResponseSchema>,
  context: { user?: User }
) => {
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  try {
    // Validar argumentos
    const { messages, systemPrompt, model } = generateOpenAIResponseSchema.parse(args);

    // Verificar si OpenAI está configurado
    if (!openai) {
      throw new Error('OpenAI no está configurado correctamente');
    }

    // Preparar mensajes para la API de OpenAI
    const formattedMessages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam> = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Añadir los mensajes del chat, transformando 'model' a 'assistant'
    for (const msg of messages) {
      if (msg.role === 'model' || msg.role === 'assistant') {
        formattedMessages.push({ 
          role: 'assistant', 
          content: msg.content 
        });
      } else if (msg.role === 'user') {
        formattedMessages.push({ 
          role: 'user', 
          content: msg.content 
        });
      }
      // Ignoramos mensajes de sistema adicionales ya que añadimos el systemPrompt al principio
    }

    // Llamar a la API de OpenAI
    const completion = await openai.chat.completions.create({
      model: model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 200
    });

    // Devolver respuesta
    return {
      content: completion.choices[0].message.content || "No se pudo generar una respuesta",
      timestamp: Date.now(),
      provider: 'openai',
      model: model
    };
  } catch (error: any) {
    console.error('Error en generateOpenAIResponse:', error);
    throw new HttpError(500, error.message);
  }
};

// Operación para generar respuestas con Gemini
export const generateGeminiResponse = async (
  args: z.infer<typeof generateGeminiResponseSchema>,
  context: { user?: User }
) => {
  if (!context.user) {
    throw new HttpError(401, 'Debes iniciar sesión para acceder a esta función');
  }

  try {
    // Validar argumentos
    const { messages, systemPrompt, model } = generateGeminiResponseSchema.parse(args);

    // Verificar si Gemini está configurado
    if (!gemini) {
      throw new Error('Gemini no está configurado correctamente');
    }

    // Obtener modelo Gemini
    const geminiModel = gemini.getGenerativeModel({ model: model });
    
    // Convertir mensajes al formato que Gemini espera
    const history = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : msg.role,
      parts: [{ text: msg.content }]
    }));

    // Determinar el último mensaje para enviarlo
    const lastMessage = history.pop();
    if (!lastMessage) {
      throw new Error('No hay mensajes para enviar a Gemini');
    }

    // Iniciar chat con el sistema de instrucciones
    const chat = geminiModel.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
      systemInstruction: {
        role: "user",
        parts: [{ text: systemPrompt }]
      }
    });

    // Enviar el último mensaje como el prompt actual
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const responseText = result.response.text();

    // Devolver respuesta
    return {
      content: responseText,
      timestamp: Date.now(),
      provider: 'gemini',
      model: model
    };
  } catch (error: any) {
    console.error('Error en generateGeminiResponse:', error);
    throw new HttpError(500, error.message);
  }
}; 