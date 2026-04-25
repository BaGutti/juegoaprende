export type TipoPregunta =
  | "completar"        // completar huecos en el código
  | "ordenar"          // ordenar bloques de código
  | "opcion-multiple"  // elegir la opción correcta
  | "verdadero-falso"  // decidir si una afirmación es verdadera o falsa
  | "emparejar";       // unir conceptos con sus definiciones

export interface ParEmparejar {
  izquierda: string;
  derecha: string;
}

export interface Puzzle {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: TipoPregunta;
  // Para "completar": código con [HUECO] donde el usuario escribe
  codigoBase?: string;
  // Para "ordenar": bloques desordenados
  bloques?: string[];
  // Orden correcto de los bloques (índices)
  ordenCorrecto?: number[];
  // Para "opcion-multiple"
  opciones?: string[];
  respuestaCorrecta?: string | string[];
  // Para "verdadero-falso": la afirmación y si es verdadera
  afirmacion?: string;
  esVerdadero?: boolean;
  // Para "emparejar": lista de pares izquierda-derecha
  pares?: ParEmparejar[];
  pista?: string;
  explicacion: string;
  xp: number;
}

export interface Nivel {
  id: string;
  numero: number;
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  colorClaro: string;
  puzzles: Puzzle[];
}

export const niveles: Nivel[] = [
  {
    id: "variables",
    numero: 1,
    titulo: "Variables",
    descripcion: "Aprende a guardar información en cajitas llamadas variables",
    icono: "📦",
    color: "from-blue-500 to-cyan-500",
    colorClaro: "bg-blue-50 border-blue-200",
    puzzles: [
      {
        id: "var-1",
        titulo: "¿Qué es una variable?",
        descripcion:
          "Una variable es como una cajita donde guardas información. Imagina que quieres guardar la temperatura de tu cuarto. En Arduino escribirías:",
        tipo: "opcion-multiple",
        opciones: [
          "int temperatura = 25;",
          "temperatura int = 25;",
          "25 = int temperatura;",
          "guardar temperatura 25;",
        ],
        respuestaCorrecta: "int temperatura = 25;",
        pista: "En Arduino, primero va el tipo (int), luego el nombre, luego = y el valor",
        explicacion:
          "¡Correcto! En Arduino (y en C++) primero escribes el tipo de dato (int = número entero), luego el nombre de la variable, luego = y el valor. El ; al final es obligatorio.",
        xp: 10,
      },
      {
        id: "var-2",
        titulo: "Tipos de variables",
        descripcion:
          "Los números con decimales usan el tipo 'float'. Completa el código para guardar el voltaje de una batería:",
        tipo: "completar",
        codigoBase: "[TIPO] voltaje = 3.7;",
        respuestaCorrecta: ["float"],
        pista: "Los números con punto decimal usan el tipo 'float'",
        explicacion:
          "¡Exacto! 'float' se usa para números con decimales (como 3.7). 'int' solo sirve para números enteros (1, 2, 3...).",
        xp: 15,
      },
      {
        id: "var-3",
        titulo: "Variables de texto",
        descripcion:
          "Para guardar texto (letras y palabras) se usa 'String'. Ordena el código para guardar el nombre de tu robot:",
        tipo: "ordenar",
        bloques: ["nombreRobot", "=", "String", '"RoboBot";'],
        ordenCorrecto: [2, 0, 1, 3],
        explicacion:
          "¡Bien hecho! String nombreRobot = \"RoboBot\"; guarda el texto RoboBot. Los textos siempre van entre comillas dobles.",
        xp: 15,
      },
      {
        id: "var-4",
        titulo: "Variables verdadero/falso",
        descripcion:
          "¿Qué tipo usarías para saber si un LED está encendido o apagado? Solo puede ser verdadero (true) o falso (false).",
        tipo: "opcion-multiple",
        opciones: ["bool", "int", "String", "float"],
        respuestaCorrecta: "bool",
        pista: "Este tipo solo acepta dos valores: true o false",
        explicacion:
          "¡Perfecto! 'bool' (boolean) solo puede ser true (verdadero) o false (falso). Ideal para saber si algo está encendido/apagado, abierto/cerrado.",
        xp: 10,
      },
    ],
  },
  {
    id: "condiciones",
    numero: 2,
    titulo: "Condiciones (if/else)",
    descripcion: "Haz que tu programa tome decisiones según la situación",
    icono: "🔀",
    color: "from-purple-500 to-pink-500",
    colorClaro: "bg-purple-50 border-purple-200",
    puzzles: [
      {
        id: "if-1",
        titulo: "Tu primer if",
        descripcion:
          "Quieres encender un LED si la temperatura supera 30 grados. ¿Cuál es la sintaxis correcta del if?",
        tipo: "opcion-multiple",
        opciones: [
          "if (temperatura > 30) {",
          "if temperatura > 30 {",
          "cuando (temperatura > 30) {",
          "if [temperatura > 30] {",
        ],
        respuestaCorrecta: "if (temperatura > 30) {",
        pista: "La condición va siempre entre paréntesis ( )",
        explicacion:
          "¡Correcto! El if necesita la condición entre paréntesis: if (condicion). Luego las instrucciones van entre llaves { }.",
        xp: 10,
      },
      {
        id: "if-2",
        titulo: "if y else",
        descripcion:
          "Completa el código: si la luz es menor a 100, enciende el LED, si no, apágalo.",
        tipo: "completar",
        codigoBase: `if (luz < 100) {
  encenderLED();
} [PALABRA] {
  apagarLED();
}`,
        respuestaCorrecta: ["else"],
        pista: "La palabra para 'si no' en inglés es...",
        explicacion:
          "¡Exacto! 'else' significa 'si no' o 'de lo contrario'. Cuando la condición del if es falsa, se ejecuta el bloque del else.",
        xp: 15,
      },
      {
        id: "if-3",
        titulo: "Operadores de comparación",
        descripcion:
          "¿Cuál operador usarías para comprobar si dos valores son IGUALES?",
        tipo: "opcion-multiple",
        opciones: ["==", "=", "!=", ">"],
        respuestaCorrecta: "==",
        pista: "Un solo = asigna valor. Para comparar se usan dos ==",
        explicacion:
          "¡Bien! == compara si dos valores son iguales. Con un solo = estarías asignando un valor, no comparando. Es un error muy común al principio.",
        xp: 10,
      },
      {
        id: "if-4",
        titulo: "Ordena el semáforo",
        descripcion:
          "Ordena el código para que el robot se detenga si hay un obstáculo:",
        tipo: "ordenar",
        bloques: [
          "if (distancia < 20) {",
          "  detenerRobot();",
          "}",
          "else {",
          "  avanzar();",
          "}",
        ],
        ordenCorrecto: [0, 1, 2, 3, 4, 5],
        explicacion:
          "¡Perfecto! Primero la condición if, luego la acción dentro de llaves, el cierre }, y opcionalmente el else con su bloque.",
        xp: 20,
      },
    ],
  },
  {
    id: "bucles",
    numero: 3,
    titulo: "Bucles (loops)",
    descripcion: "Repite acciones sin escribir el mismo código mil veces",
    icono: "🔁",
    color: "from-green-500 to-teal-500",
    colorClaro: "bg-green-50 border-green-200",
    puzzles: [
      {
        id: "loop-1",
        titulo: "¿Para qué sirve un loop?",
        descripcion:
          "Quieres hacer parpadear un LED 5 veces. Sin un bucle, tendrías que escribir el código 5 veces. ¿Cuál es la ventaja del bucle for?",
        tipo: "opcion-multiple",
        opciones: [
          "Repite código automáticamente sin escribirlo varias veces",
          "Hace el código más lento",
          "Solo funciona con LEDs",
          "Ejecuta el código una sola vez",
        ],
        respuestaCorrecta:
          "Repite código automáticamente sin escribirlo varias veces",
        explicacion:
          "¡Exacto! Los bucles nos permiten repetir instrucciones sin duplicar código. Esto hace programas más cortos y fáciles de cambiar.",
        xp: 10,
      },
      {
        id: "loop-2",
        titulo: "El bucle for",
        descripcion:
          "Completa el bucle para que parpadee el LED exactamente 5 veces:",
        tipo: "completar",
        codigoBase: `for (int i = 0; i [CONDICION] 5; i++) {
  parpadearLED();
}`,
        respuestaCorrecta: ["<"],
        pista: "El bucle corre mientras i sea menor que 5 (0,1,2,3,4 = 5 veces)",
        explicacion:
          "¡Correcto! i < 5 hace que el bucle repita con i=0, i=1, i=2, i=3, i=4 (5 veces en total). i++ aumenta i en 1 cada vuelta.",
        xp: 20,
      },
      {
        id: "loop-3",
        titulo: "El bucle loop() de Arduino",
        descripcion:
          "En Arduino, la función loop() es especial. ¿Qué hace exactamente?",
        tipo: "opcion-multiple",
        opciones: [
          "Se repite infinitamente mientras el Arduino esté encendido",
          "Se ejecuta solo una vez al iniciar",
          "Se ejecuta 10 veces y para",
          "Solo corre cuando presionas un botón",
        ],
        respuestaCorrecta:
          "Se repite infinitamente mientras el Arduino esté encendido",
        pista: "loop en inglés significa 'bucle'... ¡y este nunca termina!",
        explicacion:
          "¡Genial! loop() es el corazón de Arduino. Todo lo que pongas ahí se repite sin parar. Es como un while(true) permanente.",
        xp: 10,
      },
      {
        id: "loop-4",
        titulo: "Ordena el for",
        descripcion:
          "Ordena las partes del bucle for para hacer sonar un buzzer 3 veces:",
        tipo: "ordenar",
        bloques: [
          "for",
          "(int i = 0;",
          "i < 3;",
          "i++)",
          "{",
          "  sonarBuzzer();",
          "}",
        ],
        ordenCorrecto: [0, 1, 2, 3, 4, 5, 6],
        explicacion:
          "¡Perfecto! La estructura completa: for (inicio; condición; incremento) { instrucciones }",
        xp: 20,
      },
    ],
  },
  {
    id: "funciones",
    numero: 4,
    titulo: "Funciones",
    descripcion: "Organiza tu código en bloques reutilizables",
    icono: "⚡",
    color: "from-orange-500 to-red-500",
    colorClaro: "bg-orange-50 border-orange-200",
    puzzles: [
      {
        id: "func-1",
        titulo: "¿Qué es una función?",
        descripcion:
          "Una función es como una receta: le pones un nombre y cuando la 'llamas' ejecuta todas sus instrucciones. ¿Cuál es la sintaxis correcta para definir una función que enciende un LED?",
        tipo: "opcion-multiple",
        opciones: [
          "void encenderLED() { ... }",
          "encenderLED void() { ... }",
          "function encenderLED { ... }",
          "def encenderLED(): ...",
        ],
        respuestaCorrecta: "void encenderLED() { ... }",
        pista: "void significa que la función no devuelve ningún valor",
        explicacion:
          "¡Correcto! En Arduino/C++ las funciones se definen con: tipo nombreFuncion() { }. 'void' significa que no devuelve nada.",
        xp: 15,
      },
      {
        id: "func-2",
        titulo: "Llamar una función",
        descripcion: "Completa el código para llamar a la función parpadear():",
        tipo: "completar",
        codigoBase: `void loop() {
  [FUNCION];
  delay(1000);
}`,
        respuestaCorrecta: ["parpadear()"],
        pista: "Para llamar una función escribes su nombre seguido de ()",
        explicacion:
          "¡Bien! Para ejecutar una función la llamas por su nombre con paréntesis: parpadear(); El ; al final es obligatorio.",
        xp: 15,
      },
      {
        id: "func-3",
        titulo: "setup() y loop()",
        descripcion:
          "En Arduino hay dos funciones obligatorias. ¿Cuál es la diferencia?",
        tipo: "opcion-multiple",
        opciones: [
          "setup() corre una vez al inicio, loop() se repite siempre",
          "Ambas se repiten infinitamente",
          "loop() corre una vez, setup() se repite",
          "Son exactamente iguales",
        ],
        respuestaCorrecta:
          "setup() corre una vez al inicio, loop() se repite siempre",
        explicacion:
          "¡Exacto! setup() es para configuración inicial (definir pines, iniciar comunicación). loop() es el programa principal que se repite.",
        xp: 10,
      },
      {
        id: "func-4",
        titulo: "Función con parámetro",
        descripcion:
          "Ordena el código de una función que recibe un número y espera esa cantidad de milisegundos:",
        tipo: "ordenar",
        bloques: [
          "void",
          "esperar",
          "(int milisegundos)",
          "{",
          "  delay(milisegundos);",
          "}",
        ],
        ordenCorrecto: [0, 1, 2, 3, 4, 5],
        explicacion:
          "¡Perfecto! Las funciones pueden recibir parámetros (datos de entrada) entre paréntesis. Así puedes reutilizar la función con diferentes valores.",
        xp: 25,
      },
    ],
  },
  // ─── Nivel 5: Arrays ──────────────────────────────────────────────────────
  {
    id: "arrays",
    numero: 5,
    titulo: "Arrays",
    descripcion: "Guarda múltiples valores en una sola variable",
    icono: "📋",
    color: "from-violet-500 to-fuchsia-500",
    colorClaro: "bg-violet-50 border-violet-200",
    puzzles: [
      {
        id: "arr-1",
        titulo: "¿Qué es un array?",
        descripcion:
          "Un array es como una fila de cajitas numeradas donde puedes guardar varios valores del mismo tipo. ¿Cuál declaración crea correctamente un array de 3 enteros?",
        tipo: "opcion-multiple",
        opciones: [
          "int numeros[3] = {1, 2, 3};",
          "int numeros = {1, 2, 3};",
          "array int numeros[3];",
          "int[3] numeros = 1, 2, 3;",
        ],
        respuestaCorrecta: "int numeros[3] = {1, 2, 3};",
        pista: "El tamaño va entre corchetes [ ] y los valores entre llaves { }",
        explicacion:
          "¡Correcto! Un array se declara con el tipo, nombre, tamaño entre [ ] y los valores iniciales entre { }. Los índices empiezan desde 0.",
        xp: 10,
      },
      {
        id: "arr-2",
        titulo: "Acceder a un elemento",
        descripcion:
          "¿Es verdad que en Arduino el primer elemento de un array tiene índice 0?",
        tipo: "verdadero-falso",
        afirmacion: "El primer elemento de un array se accede con el índice 0. Por ejemplo: leds[0] accede al primer elemento de 'leds'.",
        esVerdadero: true,
        explicacion:
          "¡Verdadero! Los arrays en C++/Arduino comienzan en el índice 0. Si el array tiene 5 elementos, los índices son 0, 1, 2, 3 y 4.",
        xp: 10,
      },
      {
        id: "arr-3",
        titulo: "Leer un elemento",
        descripcion:
          "Tienes un array de temperaturas. Completa el código para leer el tercer elemento:",
        tipo: "completar",
        codigoBase: `int temps[5] = {20, 22, 25, 19, 23};
int tercero = temps[[HUECO]];`,
        respuestaCorrecta: ["2"],
        pista: "Los índices empiezan en 0, así que el tercero es el índice...",
        explicacion:
          "¡Exacto! El tercer elemento está en el índice 2 (0=primero, 1=segundo, 2=tercero). temps[2] devuelve 25.",
        xp: 15,
      },
      {
        id: "arr-4",
        titulo: "Recorrer un array",
        descripcion:
          "Ordena el código para encender 5 LEDs usando un array y un bucle for:",
        tipo: "ordenar",
        bloques: [
          "int pines[5] = {2,3,4,5,6};",
          "for (int i = 0; i < 5; i++) {",
          "  pinMode(pines[i], OUTPUT);",
          "}",
        ],
        ordenCorrecto: [0, 1, 2, 3],
        explicacion:
          "¡Perfecto! Combinando arrays con bucles for puedes procesar todos los elementos sin repetir código. pines[i] accede al elemento i del array.",
        xp: 20,
      },
      {
        id: "arr-5",
        titulo: "Emparejar: tipos de arrays",
        descripcion:
          "Une cada declaración de array con su descripción correcta:",
        tipo: "emparejar",
        pares: [
          { izquierda: "int valores[4]", derecha: "Array de 4 enteros" },
          { izquierda: "float medidas[3]", derecha: "Array de 3 decimales" },
          { izquierda: "bool estados[2]", derecha: "Array de 2 booleanos" },
          { izquierda: "String nombres[5]", derecha: "Array de 5 textos" },
        ],
        explicacion:
          "¡Bien hecho! Los arrays pueden ser de cualquier tipo de dato: int, float, bool, String... El número entre [ ] indica cuántos elementos tiene.",
        xp: 20,
      },
      {
        id: "arr-6",
        titulo: "Modificar un elemento",
        descripcion:
          "¿Es correcto este código para cambiar el segundo elemento de un array?",
        tipo: "verdadero-falso",
        afirmacion: "El siguiente código cambia el segundo elemento del array:\n\nint leds[3] = {0, 0, 0};\nleds[1] = 1;",
        esVerdadero: true,
        explicacion:
          "¡Verdadero! leds[1] apunta al segundo elemento (índice 1). Asignarle 1 cambia ese elemento. El array queda {0, 1, 0}.",
        xp: 15,
      },
    ],
  },

  // ─── Nivel 6: Strings ─────────────────────────────────────────────────────
  {
    id: "strings",
    numero: 6,
    titulo: "Strings (Texto)",
    descripcion: "Trabaja con texto: mensajes, nombres y comunicación serial",
    icono: "💬",
    color: "from-amber-500 to-orange-500",
    colorClaro: "bg-amber-50 border-amber-200",
    puzzles: [
      {
        id: "str-1",
        titulo: "¿Qué es un String?",
        descripcion:
          "Un String es una cadena de caracteres (texto). ¿Cuál de estas opciones declara correctamente un String en Arduino?",
        tipo: "opcion-multiple",
        opciones: [
          'String mensaje = "Hola Arduino";',
          'string mensaje = "Hola Arduino";',
          'text mensaje = "Hola Arduino";',
          'char mensaje = "Hola Arduino";',
        ],
        respuestaCorrecta: 'String mensaje = "Hola Arduino";',
        pista: "En Arduino, String va con S mayúscula",
        explicacion:
          '¡Correcto! En Arduino, String (con S mayúscula) es la clase para manejar texto. El texto siempre va entre comillas dobles " ".',
        xp: 10,
      },
      {
        id: "str-2",
        titulo: "Longitud de un String",
        descripcion:
          "Completa el código para obtener cuántos caracteres tiene un mensaje:",
        tipo: "completar",
        codigoBase: `String saludo = "Hola";
int longitud = saludo.[HUECO]();`,
        respuestaCorrecta: ["length"],
        pista: "El método que devuelve la longitud se llama igual en inglés: length",
        explicacion:
          "¡Exacto! El método .length() devuelve el número de caracteres del String. \"Hola\".length() devuelve 4.",
        xp: 15,
      },
      {
        id: "str-3",
        titulo: "Emparejar: métodos de String",
        descripcion:
          "Une cada método de String con lo que hace:",
        tipo: "emparejar",
        pares: [
          { izquierda: ".length()", derecha: "Devuelve la cantidad de caracteres" },
          { izquierda: ".toUpperCase()", derecha: "Convierte a MAYÚSCULAS" },
          { izquierda: ".toLowerCase()", derecha: "Convierte a minúsculas" },
          { izquierda: ".charAt(0)", derecha: "Devuelve el primer carácter" },
        ],
        explicacion:
          "¡Bien! Los Strings tienen muchos métodos útiles. Los métodos se llaman con un punto después del nombre de la variable: miTexto.length()",
        xp: 20,
      },
      {
        id: "str-4",
        titulo: "Concatenar Strings",
        descripcion:
          "¿Es verdad que en Arduino puedes unir dos Strings usando el operador +?",
        tipo: "verdadero-falso",
        afirmacion: 'En Arduino puedes unir (concatenar) Strings con el operador +:\n\nString nombre = "Robot";\nString mensaje = "Hola " + nombre;\n// resultado: "Hola Robot"',
        esVerdadero: true,
        explicacion:
          '¡Verdadero! El operador + concatena Strings en Arduino. También puedes usar += para agregar texto al final: mensaje += "!"',
        xp: 15,
      },
      {
        id: "str-5",
        titulo: "Ordena la comunicación serial",
        descripcion:
          "Ordena el código para enviar un mensaje por el monitor serial de Arduino:",
        tipo: "ordenar",
        bloques: [
          "void setup() {",
          "  Serial.begin(9600);",
          '  String msg = "Listo!";',
          "  Serial.println(msg);",
          "}",
        ],
        ordenCorrecto: [0, 1, 2, 3, 4],
        explicacion:
          "¡Perfecto! Serial.begin(9600) inicia la comunicación. Serial.println() envía el texto y salta de línea. Puedes verlo en el Monitor Serial del IDE de Arduino.",
        xp: 20,
      },
      {
        id: "str-6",
        titulo: "Comparar Strings",
        descripcion:
          "¿Cuál es la forma correcta de comparar dos Strings en Arduino?",
        tipo: "opcion-multiple",
        opciones: [
          'texto.equals("hola")',
          'texto == "hola"',
          'texto.compare("hola")',
          'strcmp(texto, "hola")',
        ],
        respuestaCorrecta: 'texto.equals("hola")',
        pista: "Los Strings en Arduino son objetos, se comparan con un método",
        explicacion:
          '¡Correcto! Para comparar Strings usa el método .equals(). Aunque == a veces funciona, .equals() es el método recomendado y confiable para comparar texto.',
        xp: 15,
      },
    ],
  },

  // ─── Nivel 7: Tipos de Datos ──────────────────────────────────────────────
  {
    id: "tipos-datos",
    numero: 7,
    titulo: "Tipos de Datos",
    descripcion: "Domina todos los tipos de datos y sus conversiones",
    icono: "🔢",
    color: "from-teal-500 to-cyan-500",
    colorClaro: "bg-teal-50 border-teal-200",
    puzzles: [
      {
        id: "tipo-1",
        titulo: "Emparejar tipos de datos",
        descripcion:
          "Une cada tipo de dato con su descripción correcta:",
        tipo: "emparejar",
        pares: [
          { izquierda: "int", derecha: "Número entero (-32768 a 32767)" },
          { izquierda: "float", derecha: "Número decimal (3.14, 2.5)" },
          { izquierda: "bool", derecha: "Verdadero (true) o Falso (false)" },
          { izquierda: "char", derecha: "Un solo carácter ('A', '5')" },
        ],
        explicacion:
          "¡Excelente! Cada tipo de dato ocupa diferente espacio en memoria y sirve para guardar distintos valores. Elegir bien el tipo ahorra memoria en Arduino.",
        xp: 15,
      },
      {
        id: "tipo-2",
        titulo: "¿Cuánto ocupa cada tipo?",
        descripcion:
          "¿Es verdad que un 'int' ocupa más memoria que un 'byte' en Arduino?",
        tipo: "verdadero-falso",
        afirmacion: "En Arduino, el tipo 'int' ocupa 2 bytes de memoria, mientras que 'byte' solo ocupa 1 byte. Por eso 'byte' es más eficiente para números del 0 al 255.",
        esVerdadero: true,
        explicacion:
          "¡Verdadero! byte (0-255) ocupa 1 byte. int (-32768 a 32767) ocupa 2 bytes. En Arduino con poca memoria, elegir el tipo correcto es importante.",
        xp: 10,
      },
      {
        id: "tipo-3",
        titulo: "Conversión de tipos",
        descripcion:
          "Completa el código para convertir un float a int (descartando los decimales):",
        tipo: "completar",
        codigoBase: `float voltaje = 4.75;
int entero = [HUECO](voltaje);`,
        respuestaCorrecta: ["int", "(int)"],
        pista: "Para convertir a entero, escribe el tipo entre paréntesis antes del valor: casting",
        explicacion:
          "¡Correcto! (int) antes de un valor lo convierte a entero. 4.75 se convierte a 4 (trunca los decimales). Esto se llama 'casting' o conversión de tipos.",
        xp: 20,
      },
      {
        id: "tipo-4",
        titulo: "El tipo long",
        descripcion:
          "¿Para qué sirve el tipo 'long' en Arduino?",
        tipo: "opcion-multiple",
        opciones: [
          "Guardar números enteros muy grandes (hasta 2,147,483,647)",
          "Guardar texto largo",
          "Es igual que int pero más lento",
          "Guardar números decimales con más precisión",
        ],
        respuestaCorrecta: "Guardar números enteros muy grandes (hasta 2,147,483,647)",
        pista: "long es como int pero más... ¡grande!",
        explicacion:
          "¡Exacto! long ocupa 4 bytes y puede guardar hasta 2,147,483,647. Se usa mucho en Arduino con millis() que devuelve el tiempo en milisegundos (¡un número enorme!)",
        xp: 10,
      },
      {
        id: "tipo-5",
        titulo: "Desbordamiento de tipos",
        descripcion:
          "¿Es verdad que si sumas 1 a una variable byte con valor 255, el resultado es 0?",
        tipo: "verdadero-falso",
        afirmacion: "Si tienes: byte b = 255; b = b + 1;\nEl resultado guardado en b será 0, no 256. Esto se llama 'overflow' o desbordamiento.",
        esVerdadero: true,
        explicacion:
          "¡Verdadero! Cuando un tipo se desborda (overflow), vuelve a empezar desde 0. byte solo puede guardar 0-255. ¡Es un error común y difícil de detectar!",
        xp: 15,
      },
      {
        id: "tipo-6",
        titulo: "Ordena la conversión",
        descripcion:
          "Ordena el código para leer un sensor analógico y convertir su valor a voltaje:",
        tipo: "ordenar",
        bloques: [
          "int lectura = analogRead(A0);",
          "float voltaje = lectura * (5.0 / 1023.0);",
          "Serial.println(voltaje);",
        ],
        ordenCorrecto: [0, 1, 2],
        explicacion:
          "¡Perfecto! analogRead devuelve un int (0-1023). Multiplicar por 5.0/1023.0 convierte a voltaje (0-5V). Usar 5.0 (float) en vez de 5 (int) es importante para que la división sea decimal.",
        xp: 20,
      },
    ],
  },
];

export function getNivel(id: string): Nivel | undefined {
  return niveles.find((n) => n.id === id);
}

export function getPuzzle(
  nivelId: string,
  puzzleId: string
): { puzzle: Puzzle; nivel: Nivel } | undefined {
  const nivel = getNivel(nivelId);
  if (!nivel) return undefined;
  const puzzle = nivel.puzzles.find((p) => p.id === puzzleId);
  if (!puzzle) return undefined;
  return { puzzle, nivel };
}
