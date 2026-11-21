document.addEventListener("DOMContentLoaded", function () {

    // ================= DATOS =================
    // Usuarios de prueba (los usuarios nuevos se guardan aparte, en el navegador)
    const usuarios = [
        { usuario: "estudiante", clave: "1234", nombre: "Estudiante" },
        { usuario: "profesor", clave: "1234", nombre: "Profesor" }
    ];

    // Banco de preguntas. "r" es la respuesta correcta.
    const banco = {
        ingles: {
            titulo: "Inglés",
            preguntas: [
                { p: "¿Cómo se dice \"gato\" en inglés?", o: ["Cat", "Dog", "Bird"], r: "Cat" },
                { p: "¿Qué significa \"Red\"?", o: ["Azul", "Rojo", "Verde"], r: "Rojo" },
                { p: "¿Cómo se dice \"manzana\" en inglés?", o: ["Banana", "Apple", "Orange"], r: "Apple" },
                { p: "¿Qué significa \"Book\"?", o: ["Libro", "Lápiz", "Mesa"], r: "Libro" },
                { p: "¿Cómo se dice \"gracias\" en inglés?", o: ["Please", "Hello", "Thank you"], r: "Thank you" }
            ]
        },
        sociales: {
            titulo: "Sociales",
            preguntas: [
                { p: "¿Cuál es la capital de Colombia?", o: ["Medellín", "Bogotá", "Cali"], r: "Bogotá" },
                { p: "¿Qué océano baña la costa occidental de Colombia?", o: ["Pacífico", "Atlántico", "Índico"], r: "Pacífico" },
                { p: "¿Cuál es el río más importante de Colombia?", o: ["Magdalena", "Amazonas", "Orinoco"], r: "Magdalena" },
                { p: "¿Cuántos departamentos tiene Colombia?", o: ["30", "32", "35"], r: "32" },
                { p: "¿Qué colores tiene la bandera de Colombia?", o: ["Amarillo, azul y rojo", "Verde, blanco y rojo", "Azul, blanco y negro"], r: "Amarillo, azul y rojo" }
            ]
        },
        lenguaje: {
            titulo: "Lenguaje",
            preguntas: [
                { p: "¿Cuál palabra está bien escrita?", o: ["Girafa", "Jirafa", "Jirrafa"], r: "Jirafa" },
                { p: "¿Cuál es un sinónimo de \"feliz\"?", o: ["Triste", "Contento", "Enojado"], r: "Contento" },
                { p: "¿Cuál es el antónimo de \"grande\"?", o: ["Pequeño", "Alto", "Ancho"], r: "Pequeño" },
                { p: "¿Cuál de estas palabras es un sustantivo?", o: ["Correr", "Bonito", "Mesa"], r: "Mesa" },
                { p: "¿Cuántas sílabas tiene \"mariposa\"?", o: ["3", "4", "5"], r: "4" }
            ]
        }
    };

    // ================= ELEMENTOS =================
    const $ = function (id) { return document.getElementById(id); };

    const botonMenu = $("botonMenu");
    const enlaces = $("enlaces");
    const linkSalir = $("linkSalir");

    const formLogin = $("formLogin");
    const campoUsuario = $("usuario");
    const campoClave = $("clave");
    const mensajeLogin = $("mensajeLogin");
    const loginBox = $("loginBox");
    const registroBox = $("registroBox");
    const bienvenidaBox = $("bienvenidaBox");
    const tituloIngreso = $("tituloIngreso");
    const imagenIngreso = $("imagenIngreso");

    const formRegistro = $("formRegistro");
    const regNombre = $("regNombre");
    const regCorreo = $("regCorreo");
    const regUsuario = $("regUsuario");
    const regClave = $("regClave");
    const regClave2 = $("regClave2");
    const mensajeRegistro = $("mensajeRegistro");
    const nombreUsuario = $("nombreUsuario");

    const zonaJuego = $("zonaJuego");
    const pantallaJuego = $("pantallaJuego");
    const pantallaResultado = $("pantallaResultado");
    const tituloModulo = $("tituloModulo");
    const contadorPregunta = $("contadorPregunta");
    const enunciado = $("enunciado");
    const contenedorOpciones = $("opciones");
    const retroalimentacion = $("retroalimentacion");
    const botonSiguiente = $("botonSiguiente");
    const textoResultado = $("textoResultado");

    const datoUsuario = $("datoUsuario");
    const datoPuntaje = $("datoPuntaje");
    const datoJuegos = $("datoJuegos");

    // ================= ESTADO =================
    let usuarioActual = null;
    let puntajeTotal = 0;
    let juegosJugados = 0;
    let moduloActual = "";
    let preguntas = [];
    let indice = 0;
    let aciertos = 0;
    let respondida = false;

    // ================= FUNCIONES AUXILIARES =================
    function irA(id) {
        $(id).scrollIntoView({ behavior: "smooth" });
    }

    function mezclar(lista) {
        const copia = lista.slice();
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = copia[i];
            copia[i] = copia[j];
            copia[j] = temp;
        }
        return copia;
    }

    function actualizarProgreso() {
        datoUsuario.textContent = usuarioActual ? usuarioActual.nombre : "-";
        datoPuntaje.textContent = puntajeTotal;
        datoJuegos.textContent = juegosJugados;
    }

    function guardarProgreso() {
        try {
            localStorage.setItem("progreso_" + usuarioActual.usuario,
                JSON.stringify({ puntaje: puntajeTotal, juegos: juegosJugados }));
        } catch (e) { /* si el navegador no deja guardar, se ignora */ }
    }

    function cargarProgreso() {
        puntajeTotal = 0;
        juegosJugados = 0;
        try {
            const guardado = localStorage.getItem("progreso_" + usuarioActual.usuario);
            if (guardado) {
                const datos = JSON.parse(guardado);
                puntajeTotal = datos.puntaje || 0;
                juegosJugados = datos.juegos || 0;
            }
        } catch (e) { /* sin progreso guardado */ }
    }

    // Matematicas: las preguntas se crean al azar cada vez
    function generarMatematicas() {
        const lista = [];
        const operaciones = ["+", "-", "×"];
        for (let i = 0; i < 5; i++) {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const op = operaciones[Math.floor(Math.random() * operaciones.length)];
            let correcta;
            if (op === "+") correcta = a + b;
            else if (op === "-") correcta = a - b;
            else correcta = a * b;

            const opciones = [String(correcta)];
            while (opciones.length < 3) {
                const falsa = String(correcta + Math.floor(Math.random() * 11) - 5);
                if (!opciones.includes(falsa)) opciones.push(falsa);
            }
            lista.push({
                p: "¿Cuánto es " + a + " " + op + " " + b + "?",
                o: opciones,
                r: String(correcta)
            });
        }
        return lista;
    }

    // ================= MENU DE CELULAR (HAMBURGUESA) =================
    const iconoMenu = botonMenu.querySelector("i");

    function cerrarMenu() {
        enlaces.classList.remove("abierto");
        iconoMenu.className = "fas fa-bars";
    }

    botonMenu.addEventListener("click", function (evento) {
        evento.stopPropagation();
        const abierto = enlaces.classList.toggle("abierto");
        // Cambia el icono: tres rayas cuando esta cerrado, X cuando esta abierto
        iconoMenu.className = abierto ? "fas fa-times" : "fas fa-bars";
    });

    // Se cierra al elegir una opcion del menu
    enlaces.querySelectorAll("a").forEach(function (enlace) {
        enlace.addEventListener("click", cerrarMenu);
    });

    // Se cierra al tocar fuera del menu
    document.addEventListener("click", function (evento) {
        if (!enlaces.contains(evento.target)) cerrarMenu();
    });

    // Si la pantalla se agranda (computador), el menu vuelve a su estado normal
    window.addEventListener("resize", function () {
        if (window.innerWidth > 800) cerrarMenu();
    });

    // ================= REGISTRO DE USUARIOS =================
    // Los usuarios nuevos se guardan en este navegador (localStorage)
    function leerRegistrados() {
        try {
            return JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        } catch (e) {
            return [];
        }
    }

    function guardarRegistrados(lista) {
        try {
            localStorage.setItem("usuarios_registrados", JSON.stringify(lista));
            return true;
        } catch (e) {
            return false;
        }
    }

    function todosLosUsuarios() {
        return usuarios.concat(leerRegistrados());
    }

    // Muestra solo una caja ("login", "registro" o "bienvenida") y cambia la imagen
    function mostrarFormulario(cual) {
        loginBox.classList.add("oculto");
        registroBox.classList.add("oculto");
        bienvenidaBox.classList.add("oculto");
        mensajeLogin.textContent = "";
        mensajeRegistro.textContent = "";

        if (cual === "registro") {
            registroBox.classList.remove("oculto");
            tituloIngreso.textContent = "Crea tu cuenta";
            imagenIngreso.src = "img/registro.svg";
        } else if (cual === "bienvenida") {
            bienvenidaBox.classList.remove("oculto");
            tituloIngreso.textContent = "Ingresa para jugar";
            imagenIngreso.src = "img/login.svg";
        } else {
            loginBox.classList.remove("oculto");
            tituloIngreso.textContent = "Ingresa para jugar";
            imagenIngreso.src = "img/login.svg";
        }
    }

    $("irRegistro").addEventListener("click", function () {
        mostrarFormulario("registro");
    });

    $("irLogin").addEventListener("click", function () {
        mostrarFormulario("login");
    });

    formRegistro.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = regNombre.value.trim();
        const correo = regCorreo.value.trim();
        const usuario = regUsuario.value.trim();
        const clave = regClave.value;
        const clave2 = regClave2.value;

        mensajeRegistro.className = "mensaje error";

        if (nombre === "" || correo === "" || usuario === "" || clave === "" || clave2 === "") {
            mensajeRegistro.textContent = "Completa todos los campos.";
            return;
        }
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {
            mensajeRegistro.textContent = "El nombre solo debe tener letras.";
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            mensajeRegistro.textContent = "Escribe un correo válido (ej: nombre@correo.com).";
            return;
        }
        if (!/^[A-Za-z0-9_]{3,15}$/.test(usuario)) {
            mensajeRegistro.textContent = "El usuario debe tener de 3 a 15 letras, números o guion bajo.";
            return;
        }
        if (clave.length < 4) {
            mensajeRegistro.textContent = "La contraseña debe tener mínimo 4 caracteres.";
            return;
        }
        if (clave !== clave2) {
            mensajeRegistro.textContent = "Las contraseñas no coinciden.";
            return;
        }

        const existe = todosLosUsuarios().some(function (u) {
            return u.usuario.toLowerCase() === usuario.toLowerCase();
        });
        if (existe) {
            mensajeRegistro.textContent = "Ese usuario ya existe. Elige otro.";
            return;
        }

        const registrados = leerRegistrados();
        registrados.push({ usuario: usuario, clave: clave, nombre: nombre, correo: correo });
        if (!guardarRegistrados(registrados)) {
            mensajeRegistro.textContent = "Tu navegador no deja guardar la cuenta. Intenta en otra ventana.";
            return;
        }

        formRegistro.reset();
        mostrarFormulario("login");
        mensajeLogin.className = "mensaje ok";
        mensajeLogin.textContent = "¡Cuenta creada! Ahora ingresa con tu usuario y contraseña.";
        campoUsuario.value = usuario;
        campoClave.focus();
    });

    // ================= LOGIN =================
    formLogin.addEventListener("submit", function (evento) {
        evento.preventDefault();
        const usuario = campoUsuario.value.trim();
        const clave = campoClave.value;

        mensajeLogin.className = "mensaje error";

        if (usuario === "" || clave === "") {
            mensajeLogin.textContent = "Escribe tu usuario y tu contraseña.";
            return;
        }

        const encontrado = todosLosUsuarios().find(function (u) {
            return u.usuario.toLowerCase() === usuario.toLowerCase() && u.clave === clave;
        });

        if (!encontrado) {
            mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
            return;
        }

        usuarioActual = encontrado;
        cargarProgreso();
        actualizarProgreso();
        nombreUsuario.textContent = usuarioActual.nombre;
        formLogin.reset();
        mensajeLogin.textContent = "";
        mostrarFormulario("bienvenida");
        linkSalir.classList.remove("oculto");
        irA("modulos");
    });

    function cerrarSesion() {
        usuarioActual = null;
        puntajeTotal = 0;
        juegosJugados = 0;
        actualizarProgreso();
        zonaJuego.classList.add("oculto");
        mostrarFormulario("login");
        linkSalir.classList.add("oculto");
        irA("inicio");
    }

    linkSalir.addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
    });

    // ================= JUEGO =================
    function iniciarJuego(modulo) {
        if (!usuarioActual) {
            mensajeLogin.className = "mensaje error";
            mensajeLogin.textContent = "Primero inicia sesión para jugar.";
            irA("ingreso");
            return;
        }
        moduloActual = modulo;
        if (modulo === "matematicas") {
            tituloModulo.textContent = "Matemáticas";
            preguntas = generarMatematicas();
        } else {
            tituloModulo.textContent = banco[modulo].titulo;
            preguntas = mezclar(banco[modulo].preguntas);
        }
        indice = 0;
        aciertos = 0;
        zonaJuego.classList.remove("oculto");
        pantallaResultado.classList.add("oculto");
        pantallaJuego.classList.remove("oculto");
        mostrarPregunta();
        irA("zonaJuego");
    }

    function mostrarPregunta() {
        const actual = preguntas[indice];
        respondida = false;
        contadorPregunta.textContent = "Pregunta " + (indice + 1) + " de " + preguntas.length;
        enunciado.textContent = actual.p;
        retroalimentacion.textContent = "";
        retroalimentacion.className = "mensaje";
        botonSiguiente.classList.add("oculto");
        contenedorOpciones.innerHTML = "";

        mezclar(actual.o).forEach(function (texto) {
            const boton = document.createElement("button");
            boton.textContent = texto;
            boton.addEventListener("click", function () {
                responder(boton, texto, actual.r);
            });
            contenedorOpciones.appendChild(boton);
        });
    }

    function responder(boton, elegida, correcta) {
        if (respondida) return;
        respondida = true;

        if (elegida === correcta) {
            boton.classList.add("correcta");
            retroalimentacion.textContent = "¡Correcto! +10 puntos";
            retroalimentacion.className = "mensaje ok";
            aciertos++;
            puntajeTotal += 10;
        } else {
            boton.classList.add("incorrecta");
            retroalimentacion.textContent = "Incorrecto. La respuesta era: " + correcta;
            retroalimentacion.className = "mensaje error";
            contenedorOpciones.querySelectorAll("button").forEach(function (b) {
                if (b.textContent === correcta) b.classList.add("correcta");
            });
        }
        actualizarProgreso();
        botonSiguiente.textContent = (indice === preguntas.length - 1) ? "Ver resultado" : "Siguiente";
        botonSiguiente.classList.remove("oculto");
    }

    botonSiguiente.addEventListener("click", function () {
        indice++;
        if (indice < preguntas.length) {
            mostrarPregunta();
        } else {
            juegosJugados++;
            guardarProgreso();
            actualizarProgreso();
            let mensaje = "Acertaste " + aciertos + " de " + preguntas.length + " preguntas. ";
            if (aciertos === preguntas.length) mensaje += "¡Perfecto!";
            else if (aciertos >= 3) mensaje += "¡Muy bien!";
            else mensaje += "¡Sigue practicando!";
            textoResultado.textContent = mensaje + " Puntaje total: " + puntajeTotal;
            pantallaJuego.classList.add("oculto");
            pantallaResultado.classList.remove("oculto");
        }
    });

    $("botonRepetir").addEventListener("click", function () {
        iniciarJuego(moduloActual);
    });

    $("botonCerrarJuego").addEventListener("click", function () {
        zonaJuego.classList.add("oculto");
        irA("modulos");
    });

    // Enlaces "Jugar" de las tarjetas de modulos
    document.querySelectorAll("[data-modulo]").forEach(function (elemento) {
        elemento.addEventListener("click", function (evento) {
            evento.preventDefault();
            iniciarJuego(elemento.dataset.modulo);
        });
    });

    // ================= PIE DE PAGINA =================
    $("anio").textContent = new Date().getFullYear();

    actualizarProgreso();
});
