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

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
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

/**
 * PASO 7: FUNCIÓN DE BÚSQUEDA DE COMENTARIOS
 * Instrucciones:
 * 1. Usa la URL: ${API_URL}/posts/${id}/comments
 * 2. Recuerda que la respuesta es una LISTA (Array) de objetos Comment.
 * 3. Usa un bucle o método de array (como .forEach) para mostrar los datos.
 */
/**
 * RETO DE LABORATORIO: Obtener recursos anidados (Comments)
 * * Instrucciones para el estudiante:
 * Sigue los pasos numerados para completar la función.
 */
const fetchCommentsByPost = async (postId: number): Promise<void> => {

  // 1. [LOG]: Imprime en consola un mensaje avisando que vas a buscar 
  // los comentarios del 'postId' recibido. Usa estilos %c si quieres.

  console.log(`%c [LAB 3] Buscando comentarios del post ${postId}...`, 
    "color: purple; font-weight: bold;"
  );

  try {

    // 2. [PETICIÓN]: Crea una constante 'response'.
    // Usa 'fetch' con backticks para unir API_URL + /posts/ + postId + /comments.
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);

    // 3. [VALIDACIÓN]: Si la respuesta (response.ok) es falsa, 
    // lanza un error (throw new Error) indicando que falló la carga.
    if (!response.ok) {
      throw new Error(`Error al cargar comentarios: ${response.status}`);
    }

     // 4. [TRADUCCIÓN]: Crea una constante 'data'.
    // Usa 'await response.json()' y asígnale el tipo 'Comment[]' (Array de comentarios).
    const data: Comment[] = await response.json();

    // 5. [PROCESAMIENTO]: Una vez tengas los datos, imprime cuántos comentarios llegaron.
    // Tip: Usa data.length.
    console.log(`✅ Se encontraron ${data.length} comentarios`);

    // 6. [RECORRIDO]: Usa un método de array (como .forEach) para recorrer la lista.
    // Dentro, imprime solo el 'email' de cada comentario para verificar el tipado.
    data.forEach((comment) => {
      console.log(`📧 Email: ${comment.email}`);
    });

  } catch (error) {
    // 7. [ERRORES]: Captura el error y muéstralo con console.error.
    console.error("❌ Error en Lab 3:", error);
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
const SUPABASE_URL: string = "https://xfijisdbgepqzhaimnnv.supabase.co";
const SUPABASE_KEY: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmaWppc2RiZ2VwcXpoYWltbm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTI3NzEsImV4cCI6MjA4OTI2ODc3MX0.23u-tBlQIlvvyplUEWNfxPYKTr6Oz1uc2ArfJ6cM9zQ";

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
interface Producto {
  id: number;       
  nombre: string;       
  categoria: string;
  precio: number;
  stock: number;
}

/**
 * PASO 4: LA FUNCIÓN DE LECTURA (GET)
 * Esta función entra a la base de datos y trae los registros.
 */
const getProductos = async (): Promise<void> => {
  
  // Realizamos la consulta: 
  // 1. .from('autos') -> Selecciona la tabla de tu imagen.
  // 2. .select('*')   -> Pide todas las columnas de esa tabla.

  // DESCOMENTAR ESTAS LINEAS QUE SIGUEN

  const { data, error } = await supabase
    .from('productos')   
    .select('*');

  // Si Supabase responde con un error (ej: tabla inexistente o sin permisos RLS)
  if (error) {
    console.error("❌ Error al obtener los productos:", error.message);
    return;
  }

  // Si todo sale bien, 'data' contiene el array de objetos.
  // Usamos 'as Auto[]' para decirle a TS que confíe en nuestra interfaz.
  const listaProductos: Producto[] = data as Producto[];

  // Mostramos el resultado final en la consola del navegador
  console.log("✅ Lista de productos recibida:");
  console.table(listaProductos); 
  
};

const createProducto = async (): Promise<void> => {

  const nuevoProducto = {
    nombre: "Laptop Gamer",
    categoria: "Tecnología",
    precio: 25000,
    stock: 5
  };

  const { data, error } = await supabase
    .from('productos')
    .insert([nuevoProducto]);

  if (error) {
    console.error("❌ Error al insertar producto:", error.message);
    return;
  }

  console.log("✅ Producto insertado:", data);
};







/**
 * PASO final: EJECUCIÓN DEL LABORATORIO
 * Creamos una función orquestadora para manejar el flujo de las llamadas.
 */
const runLaboratory = async () => {
  console.log("%c --- INICIO DEL EXPERIMENTO ---", "background: #222; color: #bada55; padding: 5px;");
  
  await fetchSinglePost(POST_ID_TO_SEARCH); 
  await createNewPost();    
  await fetchCommentsByPost(POST_ID_TO_SEARCH);

  // 🔥 SUPABASE
  await createProducto();
  await getProductos();
  // await updateProducto();
  // await deleteProducto();

  console.log("%c --- EXPERIMENTO FINALIZADO ---", "background: #222; color: #bada55; padding: 5px;");
};





// Disparamos todo el proceso.
runLaboratory();