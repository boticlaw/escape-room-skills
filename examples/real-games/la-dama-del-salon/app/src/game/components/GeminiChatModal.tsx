import React, { useState, useEffect, useRef } from 'react';
import { useDebug } from '../context/DebugContext';
import { useNavigate } from 'react-router-dom';
// Importamos las operaciones del servidor
import { generateOpenAIResponse, generateGeminiResponse } from 'wasp/client/operations';

interface GeminiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ApiCallDebugInfo {
  apiName: 'gemini' | 'openai' | 'backup';
  status: 'pending' | 'success' | 'error';
  timestamp: number;
  responseTimestamp?: number;
  error?: any;
  response?: any;
}

const GeminiChatModal: React.FC<GeminiChatModalProps> = ({ isOpen, onClose, onComplete }) => {
  // Ref para enfocar el input al continuar conversación
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [useBackupResponses, setUseBackupResponses] = useState(false);
  const [apiError, setApiError] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageCountRef = useRef(0);
  const { isDebugEnabled } = useDebug(); // Usar el contexto de depuración centralizado
  const [debugInfo, setDebugInfo] = useState<{
    apiUsed: 'gemini' | 'openai' | 'backup' | null;
    latestResponse: any;
    latestError: any;
    requestTimestamp: number | null;
    responseTimestamp: number | null;
  }>({
    apiUsed: null,
    latestResponse: null,
    latestError: null,
    requestTimestamp: null,
    responseTimestamp: null
  });
  const [apiCallsHistory, setApiCallsHistory] = useState<ApiCallDebugInfo[]>([]);
  const [geminiSuccess, setGeminiSuccess] = useState(false);
  
  // Configuración de la API de Gemini
  //const MODEL_NAME = 'gemini-2.5-pro-exp-03-25';
  //const MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
  const MODEL_NAME = 'gemini-2.0-flash-lite';
  
  // Configuración de la API de OpenAI (como respaldo)
  const OPENAI_MODEL_NAME = 'gpt-4o-mini';

  // Prompt de sistema para configurar el comportamiento del chat
  const systemPrompt = `Actúa como un ancianos sabios de 90 años de Palencia. Habla usando un lenguaje antiguo, con refranes (pero sin excederse demasiado) y sabiduría popular española, es vacilón y utiliza tono de broma. Usa plurales mayestáticos como "nosotros sabemos", "os aconsejamos".
  La conversación debe ser breve (máximo 5-6 intercambios). 
  La pista debe guiar al usuario ha decirles que ##Clara Vela vivia detras de la calle Clavel##, lleva la conversación hace ese tema de forma disimulada.
  Si te piden directamente una pista, no se la des. Tienen que concretarte algo más.
  Una vez que les digas la dirección, la conversación debe terminar, así que te despediras poniendo una excusa divertida.`;

  // Respuestas de respaldo en caso de que la API falle
  const backupResponses = [
    'Ah, nos alegra veros por estos lares. Dicen que quien busca, encuentra, pero quien mira con paciencia, descubre más de lo que busca.',
    '¿Deseabais algo?',
    'Perdona, ¿te conozco?, ',
    'De ¿quien decias que eras?',
    'No te oigo bien, ¿podrías repetir?'
  ];

  // Estado para controlar la visibilidad de los botones de acción
  const [showActionButtons, setShowActionButtons] = useState(false);
  
  // Inicializar el chat al abrir el modal
  useEffect(() => {
    if (isOpen) {
      // Reiniciar estado
      setMessages([]);
      setInputMessage('');
      setIsLoading(false);
      setConversationEnded(false);
      setUseBackupResponses(false);
      setApiError(false);
      messageCountRef.current = 0;
      setDebugInfo({
        apiUsed: null,
        latestResponse: null,
        latestError: null,
        requestTimestamp: null,
        responseTimestamp: null
      });
      setApiCallsHistory([]);
      
      // Mensaje inicial de los abuelos
      setTimeout(() => {
        setMessages([
          {
            role: 'model',
            content: 'Ohh mozuelos, ¿Qué os trae por este viejo rincón de Palencia?'
          }
        ]);
      }, 800);
    }
  }, [isOpen]);
  
  // Mostrar u ocultar los botones de acción según el estado de conversationEnded
  useEffect(() => {
    setShowActionButtons(conversationEnded);
  }, [conversationEnded]);

  // Enfocar automáticamente el input cuando se ocultan los botones de acción
  useEffect(() => {
    if (!showActionButtons) {
      inputRef.current?.focus();
    }
  }, [showActionButtons]);

  // Desplazamiento automático al último mensaje
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Función para añadir entradas al historial de llamadas API
  const addToApiCallsHistory = (apiInfo: ApiCallDebugInfo) => {
    setApiCallsHistory(prev => [...prev, apiInfo]);
  };
  
  // Función para actualizar una entrada existente en el historial
  const updateApiCallHistory = (index: number, updates: Partial<ApiCallDebugInfo>) => {
    setApiCallsHistory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...updates };
      return updated;
    });
  };

  // Enviar mensaje al modelo (usando operaciones del servidor)
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Limpiar errores anteriores y reiniciar estado de éxito de Gemini
    setGeminiSuccess(false);

    // Agregar mensaje del usuario al chat
    const userMessage = { role: 'user' as const, content: inputMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    messageCountRef.current += 1;

    // Si estamos usando respuestas de respaldo o ha habido un error con la API anteriormente
    if (useBackupResponses || apiError) {
      // Añadir nueva entrada al historial
      const historyIndex = apiCallsHistory.length;
      addToApiCallsHistory({
        apiName: 'backup',
        status: 'pending',
        timestamp: Date.now()
      });
      
      // Actualizar estado de depuración
      setDebugInfo(prev => ({
        ...prev,
        apiUsed: 'backup',
        requestTimestamp: Date.now()
      }));
      
      setTimeout(() => {
        // Determinar qué respuesta de respaldo usar según el contador de mensajes
        const responseIndex = Math.min(messageCountRef.current - 1, backupResponses.length - 1);
        const backupResponse = backupResponses[responseIndex];
        
        // Agregar respuesta al chat
        setMessages(prevMessages => [
          ...prevMessages,
          { role: 'model', content: backupResponse }
        ]);
        
        // Si hemos llegado a la última respuesta de respaldo, terminar la conversación
        if (responseIndex >= backupResponses.length - 1) {
          setConversationEnded(true);
        }
        
        // Actualizar historial de API
        updateApiCallHistory(historyIndex, {
          status: 'success',
          responseTimestamp: Date.now(),
          response: { response: backupResponse, index: responseIndex }
        });
        
        // Actualizar estado de depuración - respuesta de respaldo
        setDebugInfo(prev => ({
          ...prev,
          responseTimestamp: Date.now(),
          latestResponse: { response: backupResponse, index: responseIndex }
        }));
        
        setIsLoading(false);
      }, 1500); // Simular un ligero retraso para parecer más natural
      
      return;
    }

    try {
      // Asegurarse de que el timestamp de Gemini sea único para depuración
      const geminiTimestamp = Date.now();
      
      // Añadir nueva entrada al historial para Gemini
      const geminiHistoryIndex = apiCallsHistory.length;
      addToApiCallsHistory({
        apiName: 'gemini',
        status: 'pending',
        timestamp: geminiTimestamp
      });
      
      // Actualizar estado de depuración - inicio de petición a Gemini
      setDebugInfo(prev => ({
        ...prev,
        apiUsed: 'gemini',
        requestTimestamp: geminiTimestamp,
        latestError: null
      }));
      
      // Preparar mensajes para Gemini - asegurar que el primer mensaje sea del usuario
      const messagesForAPI = [...messages, userMessage];
      
      // Si el primer mensaje es del modelo, ajustamos el array para evitar el error
      if (messagesForAPI.length > 0 && messagesForAPI[0].role === 'model') {
        // Opción 1: Eliminar el primer mensaje del modelo
        messagesForAPI.shift();
      }
      
      // Llamar a la operación del servidor para Gemini
      const result = await generateGeminiResponse({
        messages: messagesForAPI,
        systemPrompt: systemPrompt,
        model: MODEL_NAME
      });
      
      console.log("Respuesta de Gemini:", result);
      
      // Actualizar historial de API para Gemini
      updateApiCallHistory(geminiHistoryIndex, {
        status: 'success',
        responseTimestamp: Date.now(),
        response: result
      });
      
      // Actualizar estado de depuración - respuesta recibida y asegurarnos de que apiUsed siga siendo gemini
      setDebugInfo(prev => ({
        ...prev,
        apiUsed: 'gemini',
        responseTimestamp: Date.now(),
        latestResponse: result
      }));
      
      // Extraer el texto de la respuesta
      const responseText = result.content;
      
      // Agregar respuesta del modelo al chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'model', content: responseText }
      ]);

      // Verificar si la conversación debe terminar
      if (
        !conversationEnded && // Solo verificar si la conversación no estaba ya terminada
        ((inputMessage.toLowerCase().includes('chao') && 
         inputMessage.toLowerCase().includes('adios')) ||
        (responseText.toLowerCase().includes("detras de la calle clavel") && 
         !responseText.toLowerCase().includes("¿qué calle?") && 
         !responseText.toLowerCase().includes("¿qué flor?")) ||
        (responseText.toLowerCase().match(/\bla\s+calle\s+clavel\b/i) && 
         messageCountRef.current >= 3) ||
        messages.length >= 12)
      ) {
        setConversationEnded(true);
      }
      
      // Marcar que Gemini tuvo éxito
      setGeminiSuccess(true);
      
      // Set loading to false here since we're handling the response
      setIsLoading(false);
      
      return; // IMPORTANTE: Salir aquí para no intentar con OpenAI
      
    } catch (error: any) {
      // Si Gemini tuvo éxito, no deberíamos llegar aquí
      if (geminiSuccess) {
        console.warn('Código entró en catch a pesar del éxito de Gemini');
        setIsLoading(false);
        return;
      }
      
      console.error('Error al comunicarse con Gemini:', error);
      
      // Detección específica del error 429 (rate limit)
      const isRateLimitError = error.status === 429 || 
                               (error.message && error.message.includes('429')) ||
                               (error.message && error.message.includes('Too Many Requests')) ||
                               (error.message && error.message.includes('quota'));
      
      // Actualizar historial de API para Gemini
      const geminiHistoryIndex = apiCallsHistory.findIndex(
        call => call.apiName === 'gemini' && call.status === 'pending'
      );
      
      if (geminiHistoryIndex !== -1) {
        updateApiCallHistory(geminiHistoryIndex, {
          status: 'error',
          responseTimestamp: Date.now(),
          error: error
        });
      }
      
      // Actualizar estado de depuración - error con Gemini
      setDebugInfo(prev => ({
        ...prev,
        latestError: error
      }));
      
      // Si es un error de límite de tasa, marcar para siempre usar OpenAI en esta sesión
      if (isRateLimitError) {
        console.log("Error de límite de tasa detectado, cambiando a OpenAI para toda la sesión");
        setApiError(true); // Marcar que tuvimos un error con la API
      }
      
      // Intentar con OpenAI como respaldo
      console.log("Intentando con OpenAI como respaldo...");
      
      // Pequeño delay antes de intentar con OpenAI para asegurar timestamps distintos
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // Damos prioridad a OpenAI como respaldo principal
        const openAIResponse = await intentarConOpenAI([...messages, userMessage]);
        
        // Si OpenAI responde correctamente, no necesitamos usar el respaldo
        if (openAIResponse) {
          console.log("OpenAI respondió correctamente como respaldo");
          return;
        }
      } catch (openAIError) {
        console.error("Error también en OpenAI, recurriendo a respuestas de respaldo:", openAIError);
        // Solo si OpenAI también falla, recurrimos a las respuestas de respaldo
        usarRespuestasDeRespaldo();
      }
    } finally {
      // Solo desactivar loading si no se ha hecho ya
      if (!geminiSuccess) {
        setIsLoading(false);
      }
    }
  };

  // Función para intentar con OpenAI (usando operación del servidor)
  // Función para intentar con OpenAI (usando operación del servidor)
  const intentarConOpenAI = async (messageHistory: Message[]) => {
    // Verificar si Gemini ya tuvo éxito para no ejecutar OpenAI
    if (geminiSuccess) {
      console.warn('Intentando llamar a OpenAI cuando Gemini ya tuvo éxito');
      
      // Cancelar cualquier registro pendiente de OpenAI en el historial
      const pendingOpenAiIdx = apiCallsHistory.findIndex(
        call => call.apiName === 'openai' && call.status === 'pending'
      );
      
      if (pendingOpenAiIdx !== -1) {
        updateApiCallHistory(pendingOpenAiIdx, {
          status: 'error',
          responseTimestamp: Date.now(),
          error: 'Cancelado: Gemini ya respondió'
        });
      }
      
      return null;
    }
    
    // Añadir nueva entrada al historial
    const historyIndex = apiCallsHistory.length;
    addToApiCallsHistory({
      apiName: 'openai',
      status: 'pending',
      timestamp: Date.now()
    });
    
    try {
      // Actualizar estado de depuración - inicio de petición
      setDebugInfo(prev => ({
        ...prev,
        apiUsed: 'openai',
        requestTimestamp: Date.now(),
        latestError: null
      }));
      
      // Convertir mensajes para OpenAI (de 'model' a 'assistant')
      const openaiMessages = messageHistory.map(msg => {
        if (msg.role === 'user') {
          return { role: 'user' as const, content: msg.content };
        } else {
          return { role: 'assistant' as const, content: msg.content };
        }
      });
      
      console.log("Enviando solicitud a OpenAI con mensajes:", openaiMessages);
      
      // Llamar a la operación del servidor para OpenAI
      const result = await generateOpenAIResponse({
        messages: openaiMessages,
        systemPrompt: systemPrompt,
        model: OPENAI_MODEL_NAME
      });
      
      console.log("Respuesta de OpenAI:", result);
      
      // Actualizar historial de API - aseguramos que esto ocurra antes de actualizar cualquier otro estado
      updateApiCallHistory(historyIndex, {
        status: 'success',
        responseTimestamp: Date.now(),
        response: result
      });
      
      // Actualizar estado de depuración - respuesta recibida
      setDebugInfo(prev => ({
        ...prev,
        apiUsed: 'openai',
        responseTimestamp: Date.now(),
        latestResponse: result
      }));
      
      // Extraer el texto de la respuesta
      const responseText = result.content;
      
      // Agregamos esto para asegurar que geminiSuccess se actualice correctamente
      setGeminiSuccess(false);
      
      // Agregar respuesta del modelo al chat
      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'model', content: responseText }
      ]);
      
      // Verificar si la conversación debe terminar
      if (
        responseText.toLowerCase().includes("calle clavel") || 
        messageHistory.length >= 12
      ) {
        setConversationEnded(true);
      }
      
      return responseText;
    } catch (error) {
      console.error('Error al comunicarse con OpenAI:', error);
      
      // Actualizar historial de API para OpenAI
      updateApiCallHistory(historyIndex, {
        status: 'error',
        responseTimestamp: Date.now(),
        error: error
      });
      
      // Actualizar estado de depuración - error con OpenAI
      setDebugInfo(prev => ({
        ...prev,
        latestError: error
      }));
      
      // Usar respuestas de respaldo solo si ambos proveedores de IA fallaron
      usarRespuestasDeRespaldo();
      return null;
    }
  };
  // Función para obtener qué API respondió en base al historial
  const getRespondingApi = () => {
    // Si tenemos el historial de llamadas a la API
    if (apiCallsHistory && apiCallsHistory.length > 0) {
      // Buscar la última llamada exitosa
      for (let i = apiCallsHistory.length - 1; i >= 0; i--) {
        const call = apiCallsHistory[i];
        if (call.status === 'success') {
          return call.apiName;
        }
      }
    }
    
    // Usamos el estado debugInfo.apiUsed como respaldo en caso de que
    // no encontremos ninguna llamada exitosa en el historial
    if (debugInfo.apiUsed) {
      return debugInfo.apiUsed;
    }
    
    return 'ninguna';
  };

  // Función para usar respuestas de respaldo
  const usarRespuestasDeRespaldo = () => {
    console.log("Activando respuestas de respaldo como último recurso");
    setApiError(true);
    setUseBackupResponses(true);
    
    // Añadir nueva entrada al historial para respuestas de respaldo
    const backupHistoryIndex = apiCallsHistory.length;
    addToApiCallsHistory({
      apiName: 'backup',
      status: 'pending',
      timestamp: Date.now()
    });
    
    // Actualizar estado de depuración - cambiando a respaldos
    setDebugInfo(prev => ({
      ...prev,
      apiUsed: 'backup',
      requestTimestamp: Date.now()
    }));
    
    // Determinar qué respuesta de respaldo usar según el contador de mensajes
    const responseIndex = Math.min(messageCountRef.current - 1, backupResponses.length - 1);
    const backupResponse = backupResponses[responseIndex] + " [Nota: Los servidores de IA están ocupados, usando respuesta predefinida]";
    
    // Usar la respuesta de respaldo
    setMessages(prevMessages => [
      ...prevMessages,
      { role: 'model', content: backupResponse }
    ]);
    
    // Actualizar historial de API para respuesta de respaldo
    updateApiCallHistory(backupHistoryIndex, {
      status: 'success',
      responseTimestamp: Date.now(),
      response: { response: backupResponse }
    });
    
    // Si solo hay un mensaje del usuario, no terminar la conversación todavía
    if (messageCountRef.current > 1) {
      setConversationEnded(true);
    }
  };

  // Manejar la tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Efectos de depuración
  useEffect(() => {
    console.log("Estado de conversationEnded:", conversationEnded);
  }, [conversationEnded]);

  // Terminar la conversación y continuar el juego
  const handleComplete = async () => {
    console.log("Completando conversación...");
    
    try {
      // Importación dinámica para evitar problemas circulares
      const { updateGameProgress } = await import('wasp/client/operations');
      
      console.log("Actualizando progreso para permitir acceso al nivel 7");
      
      // Actualizar el progreso del juego para permitir el acceso al nivel 7
      await updateGameProgress({
        currentLevel: 7,
        levelCompleted: true
      });
      
      console.log("Progreso actualizado correctamente");
      
      // En lugar de navegar con React Router, forzar una redirección directa al nivel 7
      // Esto fuerza una recarga completa de la página, lo que garantiza que todo el estado se actualice
      console.log("Redirigiendo al nivel 7 con recarga completa...");
      window.location.href = '/game/level/7';
      
    } catch (error) {
      console.error("Error al actualizar el progreso del juego:", error);
      // En caso de error, también intentamos la redirección directa
      window.location.href = '/game/level/7';
    }
  };

  // Reiniciar la conversación para seguir hablando
  const handleContinueConversation = () => {
    console.log("Continuando conversación...");
    
    // Forzar estado no finalizado 
    setConversationEnded(false);
    // Ocultar inmediatamente los botones de acción y mostrar el input
    setShowActionButtons(false);
    
    // Agregar un mensaje de transición del anciano
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'model', 
          content: '¡Vaya, aún tenéis ganas de charla! A mis noventa años no se puede desperdiciar una buena conversación. ¿Qué más queréis saber, muchachos?' 
        }
      ]);
      
      // Forzar el scroll al final
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#f0f2f5] rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col relative">
        {/* Fondo estilo WhatsApp */}
        <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-[#e5ddd5] opacity-80 pattern-dots pattern-slate-300 pattern-bg-white pattern-size-2"></div>
        </div>
        
        {/* Cabecera estilo WhatsApp */}
        <div className="border-b border-gray-200 p-3 flex items-center relative z-10 bg-[#075e54] text-white">
          <div className="flex items-center w-full">
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-white">
              <img 
                src="/images/abuelos.png" 
                alt="Anciano" 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Anciano de Palencia</h3>
              <p className="text-xs text-gray-200">En línea</p>
            </div>
          </div>
        </div>
        
        {/* Contenido del chat */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ maxHeight: '50vh' }}
        >
          {apiError && (
            <div className="mx-4 my-2 bg-[#fef9c3] border-l-4 border-[#eab308] text-[#854d0e] p-2 text-xs rounded-md">
              Las palabras del anciano son difíciles de entender... pero seguirá hablando.
            </div>
          )}
          
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
            >
              {message.role !== 'user' && (
                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-2 self-end">
                  <img 
                    src="/images/abuelos.png" 
                    alt="Anciano" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div 
                className={`max-w-[80%] p-3 rounded-lg relative ${
                  message.role === 'user' 
                    ? 'bg-[#dcf8c6] text-black rounded-tr-none' 
                    : 'bg-white text-black rounded-tl-none shadow-sm'
                }`}
              >
                {message.content}
                <span className={`text-xs text-gray-500 inline-block mt-1 text-right w-full ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}>
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
                {/* Flecha de burbuja */}
                {message.role === 'user' ? (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-l-8 border-t-[#dcf8c6] border-l-transparent transform translate-x-[-1px]"></div>
                ) : (
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-8 border-r-8 border-t-white border-r-transparent transform translate-x-[-8px]"></div>
                )}
              </div>
            </div>
          ))}
          
          {/* Indicador de escritura tipo WhatsApp */}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0 mr-2 self-end">
                <img 
                  src="/images/abuelos.png" 
                  alt="Anciano" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="max-w-[80%] p-2 rounded-lg bg-white text-black rounded-tl-none shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Información de depuración */}
        {isDebugEnabled && (
          <div className="border-t border-gray-200 p-2 text-xs bg-slate-100">
            <div className="text-sm text-gray-700 font-medium mb-1">DEBUG</div>
            
            {/* Historial de llamadas API */}
            <div className="mb-2">
              <p className="text-xs font-medium text-gray-600">Historial API:</p>
              <div className="max-h-32 overflow-y-auto">
                {apiCallsHistory.map((call, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center text-xs border-l-2 pl-1 my-1 ${
                      call.status === 'pending' ? 'border-gray-400 text-gray-600' :
                      call.status === 'success' ? 'border-green-500 text-green-800' :
                      'border-red-500 text-red-800'
                    }`}
                  >
                    <span className={`font-medium mr-1 ${
                      call.apiName === 'gemini' ? 'text-green-600' :
                      call.apiName === 'openai' ? 'text-blue-600' :
                      'text-amber-600'
                    }`}>
                      {call.apiName}
                    </span>
                    <span className="text-gray-500 text-[10px]">
                      {new Date(call.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="ml-1 text-[10px] bg-gray-100 px-1 rounded">
                      {call.status}
                    </span>
                    {call.status === 'error' && (
                      <span className="ml-1 text-[10px] text-red-600 truncate max-w-[150px]">
                        Error: {typeof call.error === 'string' ? call.error : 
                        call.error?.message ? call.error.message.slice(0, 30) + '...' : 'Error'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="flex justify-between">
                <span>API:</span> 
                <span className={`font-mono ${
                  debugInfo.apiUsed === 'gemini' ? 'text-green-700' : 
                  debugInfo.apiUsed === 'openai' ? 'text-blue-700' : 
                  debugInfo.apiUsed === 'backup' ? 'text-amber-700' : 
                  'text-gray-500'
                }`}>
                  {debugInfo.apiUsed || 'N/A'}
                </span>
              </p>
              
              {debugInfo.requestTimestamp && (
                <p className="flex justify-between">
                  <span>Solicitado:</span>
                  <span className="font-mono">{new Date(debugInfo.requestTimestamp).toLocaleTimeString()}</span>
                </p>
              )}
              
              {debugInfo.responseTimestamp && (
                <p className="flex justify-between">
                  <span>Respuesta:</span>
                  <span className="font-mono">{new Date(debugInfo.responseTimestamp).toLocaleTimeString()}</span>
                </p>
              )}
              
              {debugInfo.requestTimestamp && debugInfo.responseTimestamp && (
                <p className="flex justify-between">
                  <span>Tiempo:</span>
                  <span className="font-mono">{debugInfo.responseTimestamp - debugInfo.requestTimestamp}ms</span>
                </p>
              )}
              
              {debugInfo.latestError && (
                <p className="text-red-600 font-mono text-xs overflow-hidden text-ellipsis">
                  Error: {typeof debugInfo.latestError === 'string' ? debugInfo.latestError : 
                  debugInfo.latestError.message ? 
                  debugInfo.latestError.message.slice(0, 100) + (debugInfo.latestError.message.length > 100 ? '...' : '') : 
                  JSON.stringify(debugInfo.latestError).slice(0, 100) + '...'}
                </p>
              )}
              
              <div className="mt-1 flex items-center justify-between text-gray-500">
                <span>Mensajes: {messages.length}</span>
                <span>Contador: {messageCountRef.current}</span>
                <span>Estado: {conversationEnded ? 'Finalizada' : 'Activa'}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="flex justify-between">
                <span>API Activa:</span> 
                <span className={`font-mono ${
                  debugInfo.apiUsed === 'gemini' ? 'text-green-700' : 
                  debugInfo.apiUsed === 'openai' ? 'text-blue-700' : 
                  debugInfo.apiUsed === 'backup' ? 'text-amber-700' : 
                  'text-gray-500'
                }`}>
                  {debugInfo.apiUsed || 'N/A'}
                </span>
              </p>
              
              <p className="flex justify-between">
                <span>Respondió:</span> 
                <span className={`font-mono font-bold ${
                  getRespondingApi() === 'gemini' ? 'text-green-700' : 
                  getRespondingApi() === 'openai' ? 'text-blue-700' : 
                  getRespondingApi() === 'backup' ? 'text-amber-700' : 
                  'text-gray-500'
                }`}>
                  {getRespondingApi()}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {/* Input para escribir mensajes estilo WhatsApp */}
        <div className="border-t border-gray-200 p-2 relative z-10 bg-[#f0f2f5]">
          {showActionButtons ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleComplete}
                className="flex-1 bg-[#128C7E] text-white font-medium py-2 px-4 rounded-md hover:bg-[#075e54] transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Vamos para allí
              </button>
              <button
                onClick={handleContinueConversation}
                className="flex-1 bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Seguir charlando
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-white border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
                disabled={isLoading}
                ref={inputRef}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isLoading || !inputMessage.trim() 
                    ? 'bg-gray-300 text-gray-500' 
                    : 'bg-[#128C7E] text-white hover:bg-[#075e54]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiChatModal; 