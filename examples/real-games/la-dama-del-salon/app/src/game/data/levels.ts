import { GeoCoordinates } from '../components/GeoLocationChecker';

// Tipos de nivel
export type LevelType = 'diary' | 'location' | 'puzzle';

// Interfaz para el tipo de nivel
export interface LevelData {
  id: string;
  type: LevelType;
  title: string;
  description: string;
  imageUrl?: string;
  hint: string;
  solution: string;
  diaryContent?: string;
  location?: GeoCoordinates;
  imagePositionAfterParagraph?: number;
  highlightedKeywords?: string[];
}

export interface Level {
  id: string;
  name: string;
  description: string;
  nextLevelId?: string;
  coordinates?: { lat: number; lng: number };
}

// Datos de niveles
const LEVELS_DATA: Record<string, LevelData> = {
  "1": {
    id: "1",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "15 de abril de 1897",
    imageUrl: "/images/templete.jpg",
    hint: "La foto da una buena pista.",
    solution: "templete",
    diaryContent: `Hoy, como cada amanecer, he huido de mi propia casa antes de que alcancen a susurrar en los salones: quieren casarme con don Manuel de la Riva, un joven de la burguesía palentina cuya fortuna opaca cualquier atisbo de deseo propio. Al cerrar tras de mí el pesado portón de roble, siento un extraño alivio en el aire frío de la mañana; el crujir de las hojas secas bajo mis pasos me recuerda que todavía existe un lugar donde mi voz y mis sueños pueden flotar sin cadenas.

Me he dirigido al claro junto al lugar que es un círculo de arte al aire libre, donde el viento lleva ritmos al atardecer, donde la bruma matinal envuelve las columnas de mármol y el canto distante de los pájaros se mezcla con el murmullo de mis pensamientos. Allí, acomodada sobre la piedra lisa que rodea el pilar sur, despliego mis cuadernos y abro con devoción el volumen de historia que me acompaña cada día. 

Hace ya varios meses, en una de mis lecturas casuales, encontré un pergamino firmado por el propio Ponce de León: relataba sus pesquisas sobre la legendaria Fuente de la Eterna Juventud. Me deleité con cada palabra, y desde entonces guardo aquel documento oculto entre las páginas de mi libro favorito.

Hoy he retomado la lectura de aquel antiguo manuscrito junto al este lugar donde cada trazo de tinta me recuerda que la curiosidad es mi aliada más fiel; me impulsa a buscar respuestas más allá de las murallas familiares. Entre sus líneas, Ponce de León describe un manantial oculto "donde el agua susurra a las raíces de los sauces", y aunque dudo que tal prodigio exista en realidad, sus palabras me llenan de un fervor que ninguna boda convenida logrará distraer.

Al cerrar mi diario y alzar la vista hacia la enigmática fuente de inspiración, sus columnas guardan ecos de trompetas y timbales, y en su techo habita el canto de bandurrias y pipas. Aquí el público se abisma en notas, y el silencio se viste de pentagramas.

Percibo el eco de mi propia voz. Aquí, rodeada de columnas claveadas y bajo el dosel del temprano sol, hallo la fuerza para escribir mis secretos y perfilar, con trazos indelebles, mi propia historia. Mañana, volveré de nuevo, porque solo fuera de aquellos muros familiares mi espíritu encuentra la paz necesaria para soñar.
    `,
    imagePositionAfterParagraph: 1,
    highlightedKeywords: ["columnas", "templete", "arte al aire libre", "trompetas", "timbales", "bandurrias"],
    location: {
      latitude: 42.0060,
      longitude: -4.5291,
      name: "Templete del Salón"
    }
  },
  "2": {
    id: "2",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "18 de abril de 1897",
    imageUrl: "/images/beto.jpg",
    hint: "La melodía es la clave.",
    solution: "beethoven",
    diaryContent: `Hoy me he despertado con las primeras luces del alba, y apenas he podido contener mi entusiasmo. La noticia llegó ayer en el periódico local: una orquesta de Viena visitará nuestra ciudad en junio para interpretar piezas selectas del repertorio clásico. ¡Imaginar que podré escuchar en directo las mismas melodías que he estudiado tantas veces en mis lecciones de música!

He desayunado rápidamente y he salido al jardín con mi libro de partituras, repasando las obras que anuncian en el programa. Entre todas ellas, hay una que hace estremecer mi corazón cada vez que la escucho; aquella cuyas primeras notas son como un llamado del destino que golpea a la puerta. Ta-ta-ta-taaa. Un tema tan simple y a la vez tan profundo, que cuando lo interpreto en mi viejo piano, siento que toda la habitación vibra con la intensidad de una tormenta.

Mi padre dice que este compositor alemán capturaba la esencia de la Ilustración, pero para mí representa algo más: la lucha por la libertad, por la búsqueda de nuestro propio camino. Su quinta creación sinfónica es, sin duda, la que más me conmueve. 

Me he sentado junto al estanque del parque y he abierto mi cuaderno para escribir sobre mis impresiones de esta pieza maestra. La forma en que el compositor desarrolla ese simple motivo a lo largo de la obra es magistral, como si estuviera contándonos la historia de un héroe que lucha contra la adversidad, que cae y se levanta, para finalmente triunfar en un glorioso do mayor.

Espero con impaciencia que llegue el día del concierto. Mientras tanto, seguiré practicando en mi piano.`,
    imagePositionAfterParagraph: 2,
    highlightedKeywords: ["Ta-ta-ta-taaa", "compositor alemán", "quinta creación sinfónica", "genio de Bonn", "Ludwig", "beethoven"]
  },
  "3": {
    id: "3",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "21 de abril de 1897",
    hint: "Los símbolos en forma de estrella de Ponce de León aparecen cerca de estatuas del explorador.",
    solution: "Monumento Ponce de León",
    diaryContent: `Hoy, al llegar al templete antes de que el sol despunte, me han sorprendido al interpretar mi canción favorita, esa balada suave cuyo estribillo parece susurrar mi nombre, llenando el aire de notas cálidas y reconfortantes. Por un instante sentí que mi corazón hallaba consuelo en la melodía, un breve refugio contra los murmullos de casa que planean mi boda como si yo fuera un mero objeto de intercambio.

He retomado la lectura del pergamino de Ponce de León junto al pilar sur del templete. En sus líneas, descubro que buscó "aguas que curan los años, manantiales que no conocen el otoño", y anotó unos símbolos en forma de estrella que, según él, señalaban la proximidad de la misteriosa Fuente de la Juventud. Anoté en mi diario que, tras comparar varios mapas antiguos, esos símbolos aparecen siempre cerca de estatuas dedicadas al gran explorador en plazas de ciudades nobles.

Además, encontré en sus apuntes una breve descripción de un monumento: "Allí, donde su figura alza la vista al cielo, reposan las claves del agua que no envejece". Creo reconocerla; no puede ser otro sitio que aquel homenaje en piedra que preside la ciudad.

He copiado varias veces sus símbolos junto a un croquis que apunta hacia el norte del Parque. Siento que mi búsqueda cobra un ritmo imparable: cada día recojo fragmentos, alineo coordenadas y descifro pistas que Ponce dejó ocultas entre sus anotaciones. Mañana investigaré el archivo municipal por si el monumento guarda alguna inscripción adicional.`,
    highlightedKeywords: ["Ponce de León", "símbolos en forma de estrella", "estatuas", "monumento", "Fuente de la Juventud", "homenaje en piedra"],
    location: {
      latitude: 42.0053,
      longitude: -4.5312,
      name: "Monumento Ponce de León"
    }
  },
  "4": {
    id: "4",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "27 de abril de 1897",
    imageUrl: "/images/cuaderno.jpg",
    hint: "Acudir al lugar te puede ayudar.",
    solution: "biblioteca",
    diaryContent: `La mañana despertó con un viento suave que dispersó la neblina del parque, y supe que mi investigación avanza a buen ritmo. Tras revisar una vez más los símbolos estrellados de Ponce de León junto al templete, decidí consultar los archivos de la ciudad en busca de referencias cruzadas. Allí, entre sellos y actas antiguas, hallé anotaciones calcadas a mi pergamino… pero firmadas por el Marqués de Albaida.

Al parecer, el Marqués ha estado tras la misma pista que yo: sus notas hablan de "aguas que susurran juventud" y mencionan la misma estrella grabada en su diario. Más inquietante aún, apunta que sus pesquisas le llevaron a rastrear inscripciones en monumentos dedicados a Ponce de León, exactamente como hice yo en el parque y en la plaza. Es evidente que no soy la única que desea desentrañar este secreto: su fortuna y ambición podrían llevarle a adelantarse si no actúo con cautela.

He conseguido copiar los pasajes cifrados de su cuaderno —letras invertidas y símbolos numéricos— y creo reconocer un patrón que revela la ubicación de su biblioteca privada. Mañana, al despuntar el alba, me colaré en la sala de mapas del Palacio del Marqués de Albaida (que se encuentra en la calle que tiene su nombre) para confrontar sus hallazgos con los míos y descubrir hasta dónde ha llegado su audacia.`,
    imagePositionAfterParagraph: 2,
    highlightedKeywords: ["Marqués de Albaida", "biblioteca privada", "sala de mapas", "símbolos estrellados", "letras invertidas", "símbolos numéricos", "Palacio del Marqués", "pasajes cifrados"],
  },
  "5": {
    id: "5",
    type: 'diary',
    title: "Juego de memoria",
    description: "",
    hint: "",
    diaryContent: ``,
    solution: "Juntar todas las piezas",
  },
  "6": {
    id: "6",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "3 de mayo de 1897",
    hint: "Pregunta por los abuelos y cualquiera te dirá donde los puedes encontrar.",
    solution: "ir a los abuelos",
    diaryContent: `Hoy al alba he sellado un pacto con dos ancianos del pueblo, conocidos en Palencia simplemente como "Los abuelos". Me citaron en un rincón apartado del Jardín del Norte, justo donde los rosales cobijan un banco de piedra. Vestidos con ropas sencillas y cargando sendos bastones, me ofrecieron su ayuda: aseguran poseer fragmentos de un mapa —heredados de sus familias durante generaciones— que señalaban la Fuente de la Juventud con una precisión que ni los apuntes de Ponce de León alcanzaban.

Mientras hablaban en voz baja, contemplé las arrugas de sus manos y comprendí que su sabiduría no es vana: conocen leyendas que se pierden en la memoria de la ciudad, y me prometieron revelar un valioso secreto… pero sólo si demuestro mi determinación. Me han citado de nuevo esta misma tarde para entregarme un trozo de pergamino antiguo, y juro que no volveré con las manos vacías.

Entre susurradas advertencias, uno de ellos musitó: "Cuidado con el Marqués de Albaida; su ambición no conoce límites." Al despedirnos, sentí una mezcla de gratitud y desasosiego: "Los abuelos" bien podrían inclinar la balanza a mi favor, o ser el último obstáculo antes de alcanzar el manantial legendario.`,
    highlightedKeywords: ["Los abuelos", "Jardín del Norte", "rosales", "banco de piedra", "Fuente de la Juventud", "Ponce de León", "Marqués de Albaida"],
    location: {
      latitude: 42.0060,
      longitude: -4.5303,
      name: "Los abuelos"
    }
  },
  "7": {
    id: "7",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "10 de mayo de 1897",
    hint: "¿En qué villa jugaba de pequeña?",
    solution: "celia",
    diaryContent: `Esta tarde, al pie de la puerta de mi casa, he contemplado el nuevo fragmento de pergamino que "Los abuelos" me confiaron. La brisa transportaba el perfume de los claveles, y sentí que aquel trozo de papel guardaba un susurro ancestral.

El documento, hoy desdoblado sobre mi regazo, muestra un dibujo tosca­mente esbozado de la ciudad: la silueta del Salón Antiguo, la Plaza de Pío XII y, junto a ellas, una pequeña capilla cuya espadaña apunta directamente hacia el norte. Unos versos cincelados a mano, en letra curva y elegante, describen "aguas que brotan bajo el canto de un ángel de piedra". Reconozco enseguida la hornacina de la Virgen en la fachada de la capilla de San Miguel, justo al cruzar la Calle Mayor.

He comparado este croquis con los apuntes de Ponce de León y las notas del Marqués de Albaida: todos coinciden en la proximidad de aquella capilla al verdadero manantial. Mi corazón se agita al pensar que el camino final podría comenzar en ese humilde templo.

Antes de entrar en casa, he marcado con carbón un pequeño punto en el mapa junto al dibujo de la Virgen alada. Mañana regresaré al amanecer para investigar el dintel y buscar inscripciones ocultas bajo la piedra.`,
    highlightedKeywords: ["perfume de los claveles", "Los abuelos", "Ponce de León", "Marqués de Albaida", "capilla de San Miguel", "manantial"],
  },
  "8": {
    id: "8",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "17 de mayo de 1897",
    imageUrl: "/images/puerta-mercado.jpg",
    hint: "¿Donde estaba la antigua puerta del mercado? La foto siempre ayuda :D",
    solution: "En ponce al lado de la calle mayor",
    diaryContent: `Hoy mi madre me obligó a madrugar aún más de lo habitual. Con mi cestillo en mano —traigo pan fresco, huevos de corral, una rueda de queso y un ramo de hierbas aromáticas— he recorrido el mercado de la Plaza Mayor. Mientras seleccionaba los mejores productos, mi mente no dejaba de trazar rutas y recordar los símbolos de Ponce de León.

A la vera del puesto de especias, he notado que uno de los pilares de madera está marcado con una estrella tallada en tinta roja: el mismo emblema que aparecía en mis pergaminos. Ningún sencillo mercader haría tal cosa; estoy convencida de que quien lo hizo también busca la Fuente.

He susurrado mis preguntas al anciano comerciante, y con gesto solemne deslizó un papel doblado entre mis hierbas. Su letra temblorosa coincide con la de "Los abuelos". Allí se describe un pasadizo junto a la fuente antigua del mercado, donde "un pescador tallado alza su caña hacia el norte".

Al regresar a casa, el sol casi me ciega y mi corazón late con fuerza. Mañana, antes del alba, volveré para inspeccionar esa fuente y buscar el pescador de piedra.`,
    highlightedKeywords: ["Plaza Mayor", "estrella tallada", "tinta roja", "Ponce de León", "Los abuelos", "fuente antigua", "pescador tallado", "caña", "norte"],
    imagePositionAfterParagraph: 1,
    location: {
      latitude: 42.0058,
      longitude: -4.5307,
      name: "Puerta - Ponce de León"
    }
  },
  "9": {
    id: "9",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "23 de mayo de 1897",
    imageUrl: "/images/arcos.jpg",
    hint: "Acude al lugar donde estaban antes los arcos de las rosas y presta atención a la melodía de los pájaros",
    solution: "Ir al arco de las rosas",
    diaryContent: `El alba me sorprendió de nuevo fuera de casa, recorriendo sin prisa los senderos del Jardín del Norte. El aire olía a rocío y rosas, y mis pasos me llevaron sin querer hasta unos arcos de hierro forjado cubiertos por de rosales en flor. Bajo sus pétalos, descubrí grabada con fina punta de hierro una estrella idéntica a la que Ponce de León describía en su pergamino.

Con el corazón acelerado, rasgué cuidadosamente la corteza de una rama cercana y hallé un trozo de papel doblado en cuatro. Al desplegarlo, reconocí la caligrafía cuidadosa de "Los abuelos": un mapa esquemático señalaba varios arcos delimitados por rosas, y una flecha indicaba uno en particular, cuyo perfil coincide con el quiosco del templete.

Mientras anotaba mis impresiones, el canto lejano de un ruiseñor me recordó que el tiempo apremia. Mañana, antes de que nadie despierte, debo volver a aquel rincón.

Cuando me disponía a abandonar el lugar, una melodia empezó a sonar a la lejanía y varios pajaros comenzaron a interpretarla.`,
    imagePositionAfterParagraph: 1,
    highlightedKeywords: ["Jardín del Norte", "arcos de hierro forjado", "rosales", "estrella", "Ponce de León", "Los abuelos", "quiosco", "templete", "melodía", "pájaros"],
    location: {
      latitude: 42.0068,
      longitude: -4.5277,
      name: "Arco de las rosas"
    }
  },
  "10": {
    id: "10",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "31 de mayo de 1897",
    hint: "Vuelve al templete y busca siempre la casilla más lejana a los perseguidores.",
    solution: "recuérdame",
    diaryContent: `Anoche, al caer en los brazos del sueño, me sobrecogió una melodía que me rondaba desde hacía días: la canción "Recuérdame". La escuché clara, como si alguien la cantara a mi lado, y sus versos despertaron en mí recuerdos olvidados de la infancia.

Me vi de nuevo junto a mi madre, pequeña, en la penumbra del salón antiguo, acunada mientras ella entonaba aquel lamento suave. Sentí el calor de su voz y la fragancia tenue de los azahares que perfumaban el aire en las tardes de primavera. Al despertar, el eco de "Recuérdame" todavía vibraba en mi cabeza, y comprendí que no era un sueño cualquiera, sino un mensaje: mi memoria comenzaba a hilo de la canción.

Durante la mañana, he escrito en mi cuaderno los fragmentos que retengo: palabras sueltas, estrofas incompletas y, sobre todo, el sentimiento de añoranza que la letra evoca. Creo que esa pieza musical me señala un camino: cada nota corresponde a un lugar del parque donde solía jugar de niña.

Con cada verso he recuperado una imagen: el tacto frío de las balaustradas, el resplandor pálido de la luna en el estanque y el crujir de las hojas bajo mis pies. Siento que "Recuérdame" está ligada a la Fuente: tal vez Ponce de León ocultó sus pistas en una partitura antigua o en el lugar donde mi madre cantaba para mí.

Mańana al alba regresaré al quiosco del templete. Allí, bajo la luz de la farola donde escuché por primera vez esa melodía, buscaré cualquier inscripción o fisura que revele la siguiente clave en mi búsqueda.`,
    highlightedKeywords: ["Recuérdame", "melodía", "canción", "salón antiguo", "memoria", "partitura antigua", "quiosco del templete", "Fuente", "Ponce de León", "farola"],
    location: {
      latitude: 42.0060,
      longitude: -4.5291,
      name: "Templete del Salón"
    }
  },
  "11": {
    id: "11",
    type: 'diary',
    title: "El diario de Clara Vela",
    description: "7 de junio de 1897",
    hint: "Busca en 'otro lado del silencio'",
    solution: "banco del paseo",
    diaryContent: `Hoy, al despuntar el alba, he logrado despistar a todos los que me seguían la pista. Dejé en la entrada del Palacio del Marqués una carta fingida que indica que abandoné mis pesquisas; en la fuente del mercado, mis cuadernos falsos con apuntes inconexos; y en el umbral del templete, un rumor en boca de los transeúntes que habla de direcciones erróneas. Nadie sospecha que la verdad está más cerca de lo que imaginan.

Esta será la última página que escriba en mi diario. Tras cerrar mi pluma, ocultaré estas hojas en el hueco bajo el último banco del paseo, donde la enredadera de rosas se enrosca con mayor espesor. Nadie hallará aquí mis secretos. Esconderé mis conclusiones en el "otro lado del silencio" un lugar único y poco conocido de este parque, así me aseguraré de que si algún día alguien lo encuentra sea digno de esta información.`,
    highlightedKeywords: ["despistar", "Palacio del Marqués", "fuente del mercado", "templete", "último banco del paseo", "enredadera de rosas", "otro lado del silencio"],
    location: {
      latitude: 42.0069,
      longitude: -4.5268,
      name: "Estatua 'Otro lado del silencio'"
    }
  },
  "12": {
    id: "12",
    type: 'diary',
    title: "La caja de los secretos",
    description: "2025",
    hint: "Sabes contar?",
    solution: "63239",
    diaryContent: `Finalmente, después de tantas aventuras, he hallado la caja de los secretos que Clara mencionaba en su diario. La caja parece sellada con una combinación especial, y solo podré abrirla si descifro el código correcto.

Según las pistas que he ido reuniendo, el número debe estar relacionado con alguna fecha significativa o algún evento importante en la vida de Clara. Quizás el año que aparece mencionado en alguna parte del diario sea la clave para desvelar este último misterio.

La caja está decorada con símbolos grabados, entre ellos destaca un diamante (♦) que parece indicar algo especial. Al examinarla más de cerca, noto que los mecanismos son delicados y antiguos, por lo que debo proceder con cuidado.

Es el momento de reunir todos los conocimientos adquiridos durante esta travesía y abrir la caja que contiene el secreto final de Clara Vela.`,
    imagePositionAfterParagraph: 1,
    highlightedKeywords: ["caja de los secretos", "combinación", "código", "Clara", "diamante", "secreto final"]
  },
  "13": {
    id: "13",
    type: 'diary',
    title: "Mensaje",
    description: "Clara Vela",
    hint: "Clarita te lo dice bien claro xD",
    solution: "",
    diaryContent: ``,
    imagePositionAfterParagraph: 3,
    highlightedKeywords: ["viajero", "Clara Vela", "Palencia", "Fuente de la Juventud", "Ponce de León", "aventura"],
    location: {
      latitude: 42.0052,
      longitude: -4.5317,
      name: "Puente de Hierro"
    }
  }
};

// Obtener el tipo de nivel basado en el ID
export const getLevelType = (levelId: string | undefined): LevelType => {
  if (!levelId) return 'diary'; // Por defecto
  
  const level = LEVELS_DATA[levelId];
  return level?.type || 'diary';
};

// Obtener los datos de un nivel por su ID
export const getLevelById = (levelId: string | undefined): LevelData | null => {
  if (!levelId) return null;
  return LEVELS_DATA[levelId] || null;
};

// Obtener el nivel siguiente
export const getNextLevelId = (currentLevelId: string): string | undefined => {
  // Mapeo numérico en lugar del mapeo basado en nombres
  const nextLevelMap: Record<string, string> = {
    '1': '2',
    '2': '3',
    '3': '4',
    '4': '5',
    '5': '6',
    '6': '7',
    '7': '8',
    '8': '9',
    '9': '10',
    '10': '11',
    '11': '12',
    '12': '13',
    // Más niveles pueden ser añadidos aquí según sea necesario
  };
  
  return nextLevelMap[currentLevelId];
};

// Verificar si un nivel existe
export const levelExists = (levelId: string | undefined): boolean => {
  if (!levelId) return false;
  return !!LEVELS_DATA[levelId];
}; 