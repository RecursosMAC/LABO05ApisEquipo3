import { createClient } from '@supabase/supabase-js';
/**
 * PASO 1: DATOS PRIMITIVOS (Configuración base)
 * Definimos valores básicos con tipado explícito para que el compilador sepa 
 * exactamente qué tipo de datos estamos manejando desde el inicio.
 */
// Declaramos la URL base como string para no escribirla muchas veces.
const API_URL: string = "https://jsonplaceholder.typicode.com"; 

// El ID que usaremos para las pruebas. Especificamos que es un número.
const POST_ID_TO_SEARCH: number = 1; 

// Un booleano para decidir si mostramos mensajes de log detallados.
const IS_DEBUG_MODE: boolean = true; 

/**
 * PASO 2: INTERFACES (El contrato de datos)
 * Creamos una interfaz 'Post'. Esto no genera código JS, es una guía para TS
 * que define la estructura exacta que esperamos recibir de la API.
 */
interface Post {
  userId: number;   // ID del autor (numérico)
  id: number;       // ID único del post (numérico)
  title: string;    // Título del post (texto)
  body: string;     // Contenido del post (texto)
}

/**
 * PASO 3: FUNCIÓN PARA OBTENER DATOS (GET)
 * Usamos 'async' para indicar que la función maneja procesos de llamadas a APIS.
 * 'Promise<void>' indica que la función no retorna un valor, sino una promesa vacía.
 */
const fetchSinglePost = async (id: number): Promise<void> => {
  // Aplicamos un estilo visual a la consola si estamos en modo debug.
  if (IS_DEBUG_MODE) {
    console.log(`%c [LAB 1] Buscando post con ID: ${id}...`, "color: cyan; font-weight: bold;");
  }

  try {
    // 'fetch' realiza la petición HTTP. 'await' espera a que se complete.
    // Usamos backticks (``) para concatenar la URL y el ID de forma dinámica.
    const response = await fetch(`${API_URL}/posts/${id}`);

    // Verificamos si la respuesta es exitosa (status 200-299).
    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }

    // Convertimos el cuerpo de la respuesta a JSON.
    // Le decimos a TS que el resultado es de tipo 'Post'.
    const data: Post = await response.json();

    // Imprimimos el resultado accediendo a las propiedades definidas en la interfaz.
    console.log("✅ Post recuperado:");
    console.log(`   - Título: ${data.title}`);
    console.log(`   - Cuerpo: ${data.body.substring(0, 50)}...`);
    
  } catch (error) {
    // Si algo falla (red, error de servidor, etc.), el error cae aquí.
    console.error("❌ Fallo en Lab 1:", error);
  }
};

/**
 * PASO 4: FUNCIÓN PARA CREAR DATOS (POST)
 * Aquí aprendemos a enviar un objeto JS al servidor.
 */
const createNewPost = async (): Promise<void> => {
  console.log("%c [LAB 2] Creando un nuevo recurso...", "color: orange; font-weight: bold;");

  // Definimos un objeto literal que sigue la lógica de nuestra interfaz.
  const myNewPost = {
    title: "Mi Post de Prueba",
    body: "Contenido generado desde el laboratorio de TypeScript.",
    userId: 10
  };

  try {
    // En el fetch, pasamos un objeto de configuración como segundo parámetro.
    const response = await fetch(`${API_URL}/posts`, {
      method: "POST", // Especificamos que vamos a "enviar/crear".
      
      // El servidor requiere una cadena de texto, no un objeto JS.
      // 'JSON.stringify' hace esa conversión.
      body: JSON.stringify(myNewPost), 
      
      headers: {
        // Metadata: Informamos al servidor que el contenido es JSON con codificación UTF-8.
        "Content-type": "application/json; charset=UTF-8", 
      },
    });

    // La API responde con el objeto creado y un nuevo ID (usualmente el 101).
    const createdPost: Post = await response.json();
    
    console.log("✅ Recurso creado exitosamente en el servidor:");
    console.log(createdPost);

  } catch (error) {
    console.error("❌ Fallo en Lab 2:", error);
  }
};
/*
        ##################################################
        EL RETO 
        ##################################################
*/

/**
 * PASO 6: RETO DE RECURSOS ANIDADOS (Pistas y estructura)
 * Objetivo: Obtener los comentarios que pertenecen a un Post específico.
 */
// PISTA A: Crea la interfaz 'Comment'. 
// Recuerda que la API devuelve: postId, id, name, email y body.
   interface Comment {
    "postId": number,
    "id": number,
    "name": string,
    "email": string,
    "body": string
  }
/**
 * PASO 7: FUNCIÓN DE BÚSQUEDA DE COMENTARIOS
 * Instrucciones:
 * 1. Usa la URL: ${API_URL}/posts/${id}/comments
 * 2. Recuerda que la respuesta es una LISTA (Array) de objetos Comment.
 * 3. Usa un bucle o método de array (como .forEach) para mostrar los datos.
 */
/** PRUEBA DE EMI
  const getPosts = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/posts/${id}/comments`);
  const comments : Comment[] = await response.json();
  
  comments.forEach((comment) => {
    console.log(comment.name, comment.email, comment.body);
  });
}
getPosts(1);
/**
 * RETO DE LABORATORIO: Obtener recursos anidados (Comments)
 * * Instrucciones para el estudiante:
 * Sigue los pasos numerados para completar la función.
 */
const fetchCommentsByPost = async (postId: number): Promise<void> => {
  console.log(
  `%c [LAB 3] Buscando comentarios del post con ID: ${postId}...`,
  "color: purple; font-weight: bold;"
);
  
  // 1. [LOG]: Imprime en consola un mensaje avisando que vas a buscar 
  // los comentarios del 'postId' recibido. Usa estilos %c si quieres.

  try {
    // 2. [PETICIÓN]: Crea una constante 'response'.
    // Usa 'fetch' con backticks para unir API_URL + /posts/ + postId + /comments.
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);

    // 3. [VALIDACIÓN]: Si la respuesta (response.ok) es falsa, 
    // lanza un error (throw new Error) indicando que falló la carga.
    if(!response.ok){
      throw new Error(`No se pudieron cargar los comentarios: ${response.status}`);
      
    }

    // 4. [TRADUCCIÓN]: Crea una constante 'data'.
    // Usa 'await response.json()' y asígnale el tipo 'Comment[]' (Array de comentarios).
    const data : Comment[] = await response.json();

    // 5. [PROCESAMIENTO]: Una vez tengas los datos, imprime cuántos comentarios llegaron.
    // Tip: Usa data.length.
    console.log(`Se recibieron ${data.length} comentarios`);
 

    // 6. [RECORRIDO]: Usa un método de array (como .forEach) para recorrer la lista.
    // Dentro, imprime solo el 'email' de cada comentario para verificar el tipado.
       data.forEach((comment) => {
    console.log(comment.email);
  });

  } catch (error) {
    // 7. [ERRORES]: Captura el error y muéstralo con console.error.
    console.error("%c Fallo en Lab 3:", "color: red; font-weight: bold;", error);
  }
};


/**
 * PISTA FINAL DE EJECUCIÓN:
 * Dentro de tu función 'runLaboratory', no olvides añadir:
 * await fetchCommentsByPost(POST_ID_TO_SEARCH);
 */

/*
    ################################################################################
    
    Supabase challenge

    #################################################################################



 */

/**
 * PASO 1: CONFIGURACIÓN DE CONEXIÓN
 * Sustituye estos valores con los de tu proyecto en Supabase (Project Settings > API)
 */

const SUPABASE_URL: string = "https://rkvqsxrownrpnqsgjtvo.supabase.co";
const SUPABASE_KEY: string = "sb_publishable_Q0frxsvJkHQr0e-dw3ed2w_fuSZos2U";

/**
 * PASO 2: INICIALIZACIÓN DEL CLIENTE
 * Creamos el objeto que nos permite hablar con la base de datos.
 */

// DESCOMENTAR LA LINEA DE ABAJO
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * PASO 3: INTERFAZ DE DATOS
 * Definimos la estructura exacta de la tabla que vemos en tu imagen.
 */
interface material {
  id_material: number;       // Columna ID (Primary Key)
  id_clasificacion: number;       // Columna Patente (Varchar)
  nombre: string;
  materia: string;
  autor_materia: string; // Columna ID Propietario (Foreign Key)
}

/**
 * PASO 4: LA FUNCIÓN DE LECTURA (GET)
 * Esta función entra a la base de datos y trae los registros.
 */
const getmaterial = async (): Promise<void> => {
  
  // Realizamos la consulta: 
  // 1. .from('autos') -> Selecciona la tabla de tu imagen.
  // 2. .select('*')   -> Pide todas las columnas de esa tabla.

  // DESCOMENTAR ESTAS LINEAS QUE SIGUEN

  const { data, error } = await supabase
    .from('material')   
    .select('*');

  // Si Supabase responde con un error (ej: tabla inexistente o sin permisos RLS)
  if (error) {
    console.error(" Error al obtener el material:", error.message);
    return;
  }

  // Si todo sale bien, 'data' contiene el array de objetos.
  // Usamos 'as Auto[]' para decirle a TS que confíe en nuestra interfaz.
  const listamateriales: material[] = data as material[];

  // Mostramos el resultado final en la consola del navegador
  console.log("✅ Lista de material recibida:");
  console.table(listamateriales); 

  
  
};







/**
 * PASO final: EJECUCIÓN DEL LABORATORIO
 * Creamos una función orquestadora para manejar el flujo de las llamadas.
 */
const runLaboratory = async () => {
  console.log("%c --- INICIO DEL EXPERIMENTO ---", "background: #222; color: #bada55; padding: 5px;");
  
  // Usamos await para que los logs salgan en orden y no se mezclen.
  await fetchSinglePost(POST_ID_TO_SEARCH); 
  await createNewPost();
  await fetchCommentsByPost(POST_ID_TO_SEARCH);  
  await getmaterial();                
  
  console.log("%c --- EXPERIMENTO FINALIZADO ---", "background: #222; color: #bada55; padding: 5px;");
};





// Disparamos todo el proceso.
runLaboratory();


