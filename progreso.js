/**
 * Sistema de Registro de Usuarios, Barra de Progreso, Gamificacion y Sincronizacion con Google Sheets
 * Portal Elite - Entrenamiento Oficial OPPO
 */

(function () {
    // =========================================================================
    // 1. CONFIGURACION DE GOOGLE SHEETS (OPCION 2)
    // =========================================================================
    // Pega aqui la URL de tu aplicacion web de Google Apps Script una vez publicada:
    const DEFAULT_GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzUqBbRtaAC7yt4Byy2s54SoKEx62b3BNKzubFD5wpnUSyLi-Dm1I_25uu-R2-Mz0Om/exec"; 

    function getGoogleScriptUrl() {
        return DEFAULT_GOOGLE_SCRIPT_URL || localStorage.getItem('oppo_google_script_url');
    }

    // =========================================================================
    // 2. CATALOGO OFICIAL DE RECURSOS DE CAPACITACION (45 VIDEOS + 4 CAPSULAS WEB + 12 FICHAS)
    // =========================================================================
    const CATALOGO_VIDEOS = {
        // Serie A (4)
        'OGOiKpTwrGs': { page: 'serie-a.html', module: 'Serie A', title: 'OPPO A6' },
        'CkmlybnER0g': { page: 'serie-a.html', module: 'Serie A', title: 'Certificacion IP69 A6' },
        'AUELsBnxAE8': { page: 'serie-a.html', module: 'Serie A', title: 'Puntos Clave A6K' },
        'q2pN7liYddo': { page: 'serie-a.html', module: 'Serie A', title: 'Ventajas del A6T' },
        // Serie Reno (6)
        'eFHqbvl9SfQ': { page: 'serie-reno.html', module: 'Serie Reno', title: 'Resumen Reno 16F' },
        '7vVrprscToE': { page: 'serie-reno.html', module: 'Serie Reno', title: 'Alternativa vs iPhone' },
        'K9Ri0pyV9Bw': { page: 'serie-reno.html', module: 'Serie Reno', title: 'Rendimiento vs iPhone' },
        'uE1hpafAxjI': { page: 'serie-reno.html', module: 'Serie Reno', title: 'Certificacion IP69K Reno 16F' },
        '0UdxmWS6XEI': { page: 'serie-reno.html', module: 'Serie Reno', title: 'Conoce el Reno 14F' },
        'A0nmSwMeY2o': { page: 'serie-reno.html', module: 'Serie Reno', title: 'Flash Fiesta Reno 14 5G' },
        // Serie Find (2)
        'iQlywdNl50M': { page: 'serie-find.html', module: 'Serie Find', title: 'Find X9 Ultra Tope de Gama' },
        'lhaKFp0Zogo': { page: 'serie-find.html', module: 'Serie Find', title: 'Magia del Teleobjetivo' },
        // OPPO IA (4)
        'Xg-DvC2Od78': { page: 'oppo-ia.html', module: 'OPPO IA', title: 'AI Mind Space' },
        '0MFl15Ztm48': { page: 'oppo-ia.html', module: 'OPPO IA', title: 'Funciones de Mind Pilot' },
        'Oso4-p7EMyQ': { page: 'oppo-ia.html', module: 'OPPO IA', title: 'Asistente Financiero AI' },
        '8TwNL9GTPro': { page: 'oppo-ia.html', module: 'OPPO IA', title: 'Traductor de Menu AI' },
        // Tecnologia y Ecosistema (4)
        'B7oOMGf5IVI': { page: 'tecnologia.html', module: 'Ecosistema', title: 'Vende OPPO Bubble' },
        'X8rAR_8X9Gs': { page: 'tecnologia.html', module: 'Ecosistema', title: 'Llamadas BeaconLink' },
        'bRwK9ZDr1eo': { page: 'tecnologia.html', extraPages: ['capsulas.html'], module: 'Ecosistema', title: 'O+ Connect: Envio Directo con iPhone y Mac' },
        'PXOuUyj2OU0': { page: 'tecnologia.html', extraPages: ['capsulas.html'], module: 'Ecosistema', title: 'ColorOS: Fluidez e Inteligencia Garantizada' },
        // Ventas (12)
        'W94H_4fYjrg': { page: 'ventas.html', extraPages: ['capsulas.html'], module: 'Ventas', title: 'Aprende a leer a cualquier persona en 60s' },
        'mUbzZ8WnJMQ': { page: 'ventas.html', extraPages: ['capsulas.html'], module: 'Ventas', title: 'La Venta Consultiva' },
        'eSLuPJJWjDA': { page: 'ventas.html', module: 'Ventas', title: 'Lenguaje no verbal' },
        'EPsShS_ndKU': { page: 'ventas.html', module: 'Ventas', title: 'Objecion: El Precio' },
        '0KKUK3nD76g': { page: 'ventas.html', module: 'Ventas', title: 'Objecion: La Marca' },
        'u2wdb3J5wCY': { page: 'ventas.html', module: 'Ventas', title: 'Objecion: Competencia' },
        '_xenqYWztiI': { page: 'ventas.html', module: 'Ventas', title: 'Objecion: Lo pensare' },
        'w_p6RJGNPOE': { page: 'ventas.html', module: 'Ventas', title: 'Cierre Presuntivo' },
        'WlWCCs7_R4A': { page: 'ventas.html', module: 'Ventas', title: 'Cierre Directo' },
        'Bus_Q9V1ZjM': { page: 'ventas.html', module: 'Ventas', title: 'Cierre Alternativo' },
        'GRjUV4YRe9o': { page: 'ventas.html', module: 'Ventas', title: 'Cierre de Prueba' },
        'VZwVcG333ok': { page: 'ventas.html', module: 'Ventas', title: 'Cierre de Resumen' },
        // Tutoriales (6)
        'Am15k-VoQVA': { page: 'tutoriales.html', module: 'Tutoriales', title: 'Pantalla de Bloqueo' },
        '3CF9J189AhM': { page: 'tutoriales.html', module: 'Tutoriales', title: 'Barra Inteligente' },
        'f1Yc9MXEZhw': { page: 'tutoriales.html', module: 'Tutoriales', title: 'Proteger Archivos' },
        'duuHE3fQYrw': { page: 'tutoriales.html', module: 'Tutoriales', title: 'Activar BeaconLink' },
        'cbnkfMQ2b6E': { page: 'tutoriales.html', module: 'Tutoriales', title: 'Borrador IA' },
        'JxotNm2qZGs': { page: 'tutoriales.html', module: 'Tutoriales', title: 'Tramite de Garantia' },
        // Capsulas de Video y Web Interactivas (6)
        'wuge6mbhoqA': { page: 'capsulas.html', module: 'Capsulas', title: 'Domina el Efecto WOW' },
        '4J_a1p5ZGNY': { page: 'capsulas.html', module: 'Capsulas', title: 'Capacitacion OPPO Bubble' },
        'web_neuroventas': {
            page: 'capsulas.html',
            module: 'Capsulas Web',
            title: 'Neuroventas: Neurobiologia de la Decision de Compra',
            isWeb: true,
            url: 'https://neuro-ventas-oppo.saules-alejandroh.workers.dev/'
        },
        'web_reno16_opcion': {
            page: 'capsulas.html',
            module: 'Capsulas Web',
            title: 'Reno 16: La Camara Mas Facil de Usar del Mercado',
            isWeb: true,
            url: 'https://homero133.github.io/Reno-16-tu-mejor-opci-n-/'
        },
        'web_natural_divertido': {
            page: 'capsulas.html',
            module: 'Capsulas Web',
            title: 'OPPO Reno 16: Real, Natural y Divertido',
            isWeb: true,
            url: 'https://homero133.github.io/Nautural_y_Divertido/'
        },
        'web_popcam': {
            page: 'capsulas.html',
            module: 'Capsulas Web',
            title: 'OPPO Reno 16: Vibe Retro Pop Cam',
            isWeb: true,
            url: 'https://homero133.github.io/POPCAM/'
        },
        // Lanzamiento A7 Pro 5G (5)
        'eMzoj1D8BuE': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Resistencia Grado Militar' },
        'yIsJYE4ISNk': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Carga Reversible (5 Dispositivos)' },
        'cImwExhU0E8': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Certificacion IP69K (Cafe a 80 grados)' },
        'dtBWua0FQYI': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Prueba de Caida Extrema' },
        'ppXGDoyd6io': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Rompiendo Dulces (Resistencia)' }
    };

    // Rubricas de Conocimiento ("En esta capsula vas a aprender a...")
    const RUBRICAS_DETALLE = {
        // 4 Capsulas Web Interactivas
        'web_neuroventas': {
            badge: 'C&aacute;psula Interactiva Web &bull; Neuroventas',
            titleHtml: 'Neuroventas: Neurobiolog&iacute;a de la Decisi&oacute;n de Compra',
            learnings: [
                'Activar el <strong>sistema l&iacute;mbico y reptiliano</strong> del cliente en los primeros Segundos de oro con est&iacute;mulos visuales y t&aacute;ctiles.',
                'Traducir caracter&iacute;sticas t&eacute;cnicas complejas en <strong>beneficios emocionales inmediatos</strong> (seguridad, estatus, tranquilidad y pertenencia).',
                'Aplicar gatillos mentales y micro-compromisos que reducen la fricci&oacute;n del precio y aceleran el <strong>cierre natural en piso de venta</strong>.'
            ],
            impact: 'Incrementa tu tasa de cierre entendiendo por qu&eacute; el 85% de la decisi&oacute;n de compra de un smartphone es subconsciente.'
        },
        'web_reno16_opcion': {
            badge: 'C&aacute;psula Interactiva Web &bull; Serie Reno 16',
            titleHtml: 'Reno 16: La C&aacute;mara M&aacute;s F&aacute;cil de Usar del Mercado',
            learnings: [
                'Demostrar por qu&eacute; el <strong>OPPO Reno 16</strong> entrega resultados profesionales al primer toque sin que el cliente tenga que configurar par&aacute;metros complicados.',
                'Realizar la prueba en vivo de <strong>Retrato Experto, Livephoto IA y Borrador AI</strong> en menos de 30 segundos frente al mostrador.',
                'Rebatir con pruebas visuales directas a clientes que buscan c&aacute;mara en Samsung Serie A o iPhone de generaci&oacute;n anterior.'
            ],
            impact: 'Convierte la prueba de c&aacute;mara en tu argumento m&aacute;s demoledor: cuando el cliente se ve incre&iacute;ble en la pantalla del Reno 16, la venta est&aacute; hecha.'
        },
        'web_natural_divertido': {
            badge: 'C&aacute;psula Interactiva Web &bull; Experiencia Reno 16',
            titleHtml: 'OPPO Reno 16: Real, Natural y Divertido',
            learnings: [
                'Explicar la ciencia de <strong>Tonos de Piel Naturales</strong> de OPPO que evita el aspecto artificial o sobreprocesado de otros competidores.',
                'Conectar con clientes j&oacute;venes y creadores de contenido mostrando funciones din&aacute;micas, creativas y listas para redes sociales.',
                'Guiar al cliente para que tome una selfie o retrato en tienda y compruebe por s&iacute; mismo la textura, luz y naturalidad del sensor.'
            ],
            impact: 'Ideal para enamorar a usuarios de Instagram y TikTok que buscan autenticidad y diversi&oacute;n instant&aacute;nea en cada disparo.'
        },
        'web_popcam': {
            badge: 'C&aacute;psula Interactiva Web &bull; Tendencia Creativa',
            titleHtml: 'OPPO Reno 16: Vibe Retro Pop Cam',
            learnings: [
                'Dominar la experiencia <strong>Pop Cam y est&eacute;tica Retro</strong> del OPPO Reno 16 para sorprender a clientes que buscan estilo y originalidad.',
                'Combinar el poder del <strong>Flash Fiesta / iluminaci&oacute;n de retrato</strong> con filtros creativos que simulan c&aacute;maras cl&aacute;sicas con calidad de estudio.',
                'Crear un momento memorable (Efecto WOW) en el punto de venta entregando al cliente una muestra visual &uacute;nica que ninguna otra marca ofrece.'
            ],
            impact: 'Diferencia de inmediato al OPPO Reno 16 frente a tel&eacute;fonos aburridos y gen&eacute;ricos de la competencia.'
        },
        // 4 Nuevos Videos de Entrenamiento
        'W94H_4fYjrg': {
            badge: 'Videoc&aacute;psula &bull; Psicolog&iacute;a y Abordaje',
            titleHtml: 'Aprende a leer a cualquier persona en 60 segundos',
            learnings: [
                'Identificar en el primer minuto si tu cliente es <strong>visual, auditivo o kinest&eacute;sico</strong>, y si compra por estatus, seguridad, ahorro o innovaci&oacute;n.',
                'Detectar micro-expresiones, postura corporal y tono de voz para saber exactamente <strong>qu&eacute; modelo OPPO presentarle primero</strong>.',
                'Adaptar tu velocidad de habla y argumentos para generar empat&iacute;a instant&aacute;nea (Rapport) y derribar la barrera del &laquo;solo estoy viendo&raquo;.'
            ],
            impact: 'Ahorra tiempo en piso de venta y enfoca tu demostraci&oacute;n exactamente en el dolor o deseo real del cliente desde el primer minuto.'
        },
        'mUbzZ8WnJMQ': {
            badge: 'Videoc&aacute;psula &bull; Metodolog&iacute;a de Ventas',
            titleHtml: 'La Venta Consultiva en Piso de Venta',
            learnings: [
                'Cambiar el rol de &laquo;vendedor que recita fichas t&eacute;cnicas&raquo; a <strong>Asesor Experto OPPO</strong> que diagnostica antes de recomendar.',
                'Formular las <strong>3 preguntas estrat&eacute;gicas de sondeo</strong> que revelan para qu&eacute; usa su celular el cliente y qu&eacute; le frustra de su equipo actual.',
                'Conectar cada respuesta del cliente con el diferenciador exacto de OPPO (bater&iacute;a Titan, IP69K, Retrato IA o fluidez ColorOS) para un cierre sin presi&oacute;n.'
            ],
            impact: 'Eleva tu ticket promedio llevando al cliente de gama de entrada hacia Serie A Pro o Serie Reno con argumentos basados en sus propias necesidades.'
        },
        'bRwK9ZDr1eo': {
            badge: 'Videoc&aacute;psula &bull; Ecosistema sin Barreras',
            titleHtml: 'O+ Connect: Env&iacute;o Directo con iPhone y Mac',
            learnings: [
                'Demostrar en vivo c&oacute;mo <strong>O+ Connect</strong> permite transferir fotos, videos y Livephotos entre OPPO y iPhone sin cables y sin perder calidad.',
                'Derribar la objeci&oacute;n n&uacute;mero 1 de los usuarios de Apple: <em>&laquo;Toda mi familia usa iPhone y nos pasamos fotos por AirDrop&raquo;</em>.',
                'Guiar paso a paso la conexi&oacute;n instant&aacute;nea para que el cliente compruebe que cambiarse a OPPO es 100% compatible con su entorno.'
            ],
            impact: 'Tu arma secreta para conquistar usuarios de iPhone o clientes indecisos que conviven con ecosistemas Apple en casa o trabajo.'
        },
        'PXOuUyj2OU0': {
            badge: 'Videoc&aacute;psula &bull; Tecnolog&iacute;a y Software',
            titleHtml: 'ColorOS: Fluidez e Inteligencia Garantizada',
            learnings: [
                'Explicar con seguridad c&oacute;mo el motor <strong>Trinity Engine de ColorOS</strong> mantiene el tel&eacute;fono tan r&aacute;pido como el primer d&iacute;a durante a&ntilde;os.',
                'Demostrar en segundos la multitarea inteligente, ventanas flotantes, Barra Inteligente y animaciones ultra fluidas sin trabas.',
                'Convertir la certificaci&oacute;n de fluidez de OPPO en una garant&iacute;a de inversi&oacute;n a largo plazo frente a equipos de la competencia que se vuelven lentos.'
            ],
            impact: 'Da certeza absoluta al cliente que busca un smartphone durable que no se congele al abrir sus apps bancarias, juegos o redes sociales.'
        },
        // Capsulas existentes
        'wuge6mbhoqA': {
            badge: 'Videoc&aacute;psula &bull; Demostraci&oacute;n de Impacto',
            titleHtml: 'Domina el Efecto WOW en menos de 10 segundos',
            learnings: [
                'Capturar la atenci&oacute;n total del cliente en los primeros 10 segundos con una demostraci&oacute;n f&iacute;sica o visual inesperada.',
                'Poner el equipo OPPO en las manos del cliente activando el sentido del tacto (dise&ntilde;o, delgadez, brillo de pantalla y c&aacute;mara).',
                'Transformar la curiosidad inicial en deseo de compra inmediato antes de hablar de precios o mensualidades.'
            ],
            impact: 'Un cliente sorprendido en los primeros 10 segundos escucha con el triple de atenci&oacute;n todo tu argumento comercial.'
        },
        '4J_a1p5ZGNY': {
            badge: 'Videoc&aacute;psula &bull; Experiencia ColorOS',
            titleHtml: 'Capacitaci&oacute;n Completa: Domina OPPO Bubble',
            learnings: [
                'Mostrar c&oacute;mo los servicios din&aacute;micos de <strong>OPPO Bubble</strong> mantienen visible la informaci&oacute;n clave (m&uacute;sica, grabadora, temporizador y apps) sin interrumpir lo que haces.',
                'Realizar una demostraci&oacute;n interactiva tocando y deslizando la c&aacute;psula superior para que el cliente sienta la modernidad de ColorOS.',
                'Usar OPPO Bubble como gancho visual frente a clientes que buscan una interfaz premium estilo gama alta.'
            ],
            impact: 'Hace que cualquier equipo OPPO luzca tecnol&oacute;gicamente superior y m&aacute;s moderno en la vitrina.'
        }
    };

    function getRubricForItem(id) {
        if (RUBRICAS_DETALLE[id]) {
            return RUBRICAS_DETALLE[id];
        }
        const item = CATALOGO_VIDEOS[id] || { module: 'Portal Elite', title: 'Capsula de Entrenamiento' };
        const mod = item.module || 'Portal Elite';
        const title = escapeHtml(item.title || 'Capsula OPPO');

        if (mod === 'Serie A' || mod === 'A7 Pro 5G') {
            return {
                badge: 'R&uacute;brica de Conocimiento &bull; ' + escapeHtml(mod),
                titleHtml: title,
                learnings: [
                    'Dominar los puntos fuertes de <strong>' + title + '</strong> (resistencia IP69/IP69K, bater&iacute;a de larga duraci&oacute;n y carga SUPERVOOC).',
                    'Ejecutar una demostraci&oacute;n pr&aacute;ctica en el piso de venta que transmita confianza total en la durabilidad del equipo.',
                    'Rebatir a competidores directos de su rango de precio destacando el valor superior y garant&iacute;a de OPPO.'
                ],
                impact: 'Cierra ventas con clientes que buscan un smartphone ultra resistente, confiable y con bater&iacute;a para todo el d&iacute;a.'
            };
        }
        if (mod === 'Serie Reno') {
            return {
                badge: 'R&uacute;brica de Conocimiento &bull; Serie Reno',
                titleHtml: title,
                learnings: [
                    'Presentar a <strong>' + title + '</strong> como el Experto en Retrato con Inteligencia Artificial y dise&ntilde;o ic&oacute;nico.',
                    'Realizar una comparativa visual directa en tienda destacando c&aacute;mara, pantalla AMOLED de 120Hz y certificaci&oacute;n IP69.',
                    'Posicionar la Serie Reno como la mejor alternativa frente a gamas medias-altas tradicionales e iPhone de entrada.'
                ],
                impact: 'Aumenta tus cierres en gama media-alta enamorando al cliente con fotograf&iacute;a profesional y dise&ntilde;o premium.'
            };
        }
        if (mod === 'Serie Find') {
            return {
                badge: 'R&uacute;brica de Conocimiento &bull; Serie Find Flagship',
                titleHtml: title,
                learnings: [
                    'Dominar la ingenier&iacute;a fotogr&aacute;fica y el sistema de teleobjetivo de <strong>' + title + '</strong>.',
                    'Transmitir exclusividad, potencia extrema y tecnolog&iacute;a de vanguardia a clientes de perfil exigente o ejecutivo.',
                    'Demostrar en vivo el zoom &oacute;ptico y procesamiento de imagen que supera a cualquier flagship tradicional.'
                ],
                impact: 'Domina el segmento premium con argumentos de nivel experto.'
            };
        }
        if (mod === 'OPPO IA') {
            return {
                badge: 'R&uacute;brica de Conocimiento &bull; Inteligencia Artificial OPPO',
                titleHtml: title,
                learnings: [
                    'Explicar de forma sencilla y pr&aacute;ctica c&oacute;mo funciona <strong>' + title + '</strong> en la vida diaria del usuario.',
                    'Realizar una demostraci&oacute;n en vivo de menos de 20 segundos que deje al cliente sorprendido con la IA de OPPO.',
                    'Traducir la Inteligencia Artificial en ahorro de tiempo, productividad y fotograf&iacute;as perfectas para el cliente.'
                ],
                impact: 'Posiciona a OPPO como l&iacute;der en innovaci&oacute;n f&aacute;cil de usar para cualquier persona.'
            };
        }
        if (mod === 'Ventas') {
            return {
                badge: 'R&uacute;brica de Conocimiento &bull; Cl&iacute;nica de Ventas',
                titleHtml: title,
                learnings: [
                    'Identificar el momento exacto en la conversaci&oacute;n para aplicar la t&eacute;cnica de <strong>' + title + '</strong>.',
                    'Responder con seguridad, empat&iacute;a y argumentos de valor sin entrar en confrontaci&oacute;n con el cliente.',
                    'Guiar al comprador hacia una decisi&oacute;n afirmativa manteniendo el control consultivo de la venta.'
                ],
                impact: 'Convierte la indecisi&oacute;n y las objeciones cotidianas en cierres efectivos todos los d&iacute;as.'
            };
        }
        if (mod === 'Tutoriales' || mod === 'Ecosistema') {
            return {
                badge: 'R&uacute;brica de Conocimiento &bull; ' + escapeHtml(mod),
                titleHtml: title,
                learnings: [
                    'Configurar y mostrar paso a paso la funci&oacute;n <strong>' + title + '</strong> en menos de 30 segundos.',
                    'Resolver dudas frecuentes del cliente en mostrador agregando valor post-venta y confianza en la marca.',
                    'Usar esta herramienta oculta de ColorOS como diferenciador sorpresa durante tu demostraci&oacute;n.'
                ],
                impact: 'Genera confianza inmediata al demostrar dominio total del sistema operativo y soporte OPPO.'
            };
        }
        return {
            badge: 'R&uacute;brica de Conocimiento &bull; ' + escapeHtml(mod),
            titleHtml: title,
            learnings: [
                'Comprender los conceptos clave de <strong>' + title + '</strong> y su aplicaci&oacute;n pr&aacute;ctica en tienda.',
                'Demostrar con fluidez y seguridad los beneficios exclusivos del ecosistema OPPO frente al cliente.',
                'Aplicar lo aprendido para incrementar tu tasa de cierre y avanzar hacia tu Certificaci&oacute;n Master OPPO.'
            ],
            impact: 'Fortalece tu perfil como Promotor Certificado Portal Elite.'
        };
    }

    const TOTAL_VIDEOS = Object.keys(CATALOGO_VIDEOS).length; // 49 (45 videos + 4 capsulas web)
    const TOTAL_DOWNLOADS = 26; // 12 fichas tecnicas + 14 one pages oficiales

    const STORAGE_USER_KEY = 'oppo_promotor_profile_v1';
    const STORAGE_PROGRESS_KEY = 'oppo_promotor_progress_v1';
    const STORAGE_PRIVACY_KEY = 'oppo_promotor_privacy_v1';
    const GA_MEASUREMENT_ID = 'G-6D6ZC9K790';

    // =========================================================================
    // 3. GESTION DE ESTADO LOCAL (LOCALSTORAGE) Y PRIVACIDAD
    // =========================================================================
    function isPrivacyModeEnabled() {
        return localStorage.getItem(STORAGE_PRIVACY_KEY) === '1';
    }

    function togglePrivacyMode() {
        const next = !isPrivacyModeEnabled();
        localStorage.setItem(STORAGE_PRIVACY_KEY, next ? '1' : '0');
        refreshProgressUI();
        const certModal = document.getElementById('oppoCertificateModal');
        if (certModal && !certModal.classList.contains('hidden')) {
            openCertificateModal();
        }
        showToast(next ? 'Privacidad activa: tus datos estan ocultos para captura' : 'Tus datos de perfil ahora son visibles');
    }

    function maskPromotorName(fullName) {
        const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'Promotor';
        if (parts.length === 1) return parts[0];
        return parts[0] + ' ' + parts[1].charAt(0).toUpperCase() + '.';
    }
    function getUserProfile() {
        try {
            const raw = localStorage.getItem(STORAGE_USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function saveUserProfile(profile) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
    }

    function getProgressData() {
        try {
            const raw = localStorage.getItem(STORAGE_PROGRESS_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                parsed.videos = parsed.videos || {};
                parsed.downloads = parsed.downloads || {};
                return parsed;
            }
        } catch (e) {}
        return { videos: {}, downloads: {}, completed100Notified: false };
    }

    function saveProgressData(data) {
        localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(data));
    }

    function getStats() {
        const progress = getProgressData();
        const watchedIds = Object.keys(progress.videos).filter(id => CATALOGO_VIDEOS[id]);
        const watchedCount = watchedIds.length;
        const downloadCount = Object.keys(progress.downloads).length;
        const percentage = Math.min(100, Math.round((watchedCount / TOTAL_VIDEOS) * 100));

        let rank = {
            title: 'Promotor en Entrenamiento',
            icon: 'fa-seedling',
            color: 'text-emerald-400',
            bgBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        };
        if (percentage >= 100) {
            rank = {
                title: 'Master Certificado OPPO',
                icon: 'fa-trophy',
                color: 'text-yellow-400',
                bgBadge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
            };
        } else if (percentage >= 60) {
            rank = {
                title: 'Promotor Elite Pro',
                icon: 'fa-fire',
                color: 'text-orange-400',
                bgBadge: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
            };
        } else if (percentage >= 25) {
            rank = {
                title: 'Especialista OPPO',
                icon: 'fa-bolt',
                color: 'text-cyan-400',
                bgBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            };
        }

        return {
            watchedCount,
            TOTAL_VIDEOS,
            downloadCount,
            TOTAL_DOWNLOADS,
            percentage,
            rank,
            progress
        };
    }

    function getModuleStats(pageName) {
        const progress = getProgressData();
        const moduleIds = Object.keys(CATALOGO_VIDEOS).filter(function (id) {
            const item = CATALOGO_VIDEOS[id];
            return item.page === pageName || (item.extraPages && item.extraPages.indexOf(pageName) !== -1);
        });
        if (moduleIds.length === 0) return null;
        const watchedInModule = moduleIds.filter(function (id) { return progress.videos[id]; }).length;
        const pct = Math.round((watchedInModule / moduleIds.length) * 100);
        const modName = (pageName === 'capsulas.html')
            ? 'C&aacute;psulas y Capacitaciones'
            : CATALOGO_VIDEOS[moduleIds[0]].module;
        return {
            watched: watchedInModule,
            total: moduleIds.length,
            percentage: pct,
            moduleName: modName
        };
    }

    // =========================================================================
    // 4. VINCULACION DE USER-ID EN GOOGLE ANALYTICS 4 Y ENVIO A GOOGLE SHEETS
    // =========================================================================
    function syncGA4UserIdentity(sendSessionIdentifyEvent) {
        if (typeof window.gtag !== 'function') return;
        const user = getUserProfile();
        if (!user || !user.idEmpleado) return;

        const cleanId = String(user.idEmpleado).trim();
        if (!cleanId || cleanId === '-') return;

        const stats = getStats();
        try {
            // Vincular User-ID oficial en GA4 (sin PII como nombre o telefono)
            window.gtag('config', GA_MEASUREMENT_ID, {
                user_id: cleanId,
                send_page_view: false
            });
            window.gtag('set', {
                user_id: cleanId
            });
            window.gtag('set', 'user_properties', {
                promotor_id: cleanId,
                promotor_cadena: user.cadena || '-',
                promotor_ciudad: user.ciudad || '-',
                promotor_rango: stats.rank.title,
                promotor_avance_pct: String(stats.percentage)
            });

            // Evento automatico de sesion para detectar en GA4 a promotores ya registrados con solo abrir el portal
            if (sendSessionIdentifyEvent) {
                const sessionKey = 'oppo_ga4_uid_sent_' + cleanId;
                if (!sessionStorage.getItem(sessionKey)) {
                    sessionStorage.setItem(sessionKey, '1');
                    window.gtag('event', 'promotor_identificado', {
                        promotor_id: cleanId,
                        promotor_cadena: user.cadena || '-',
                        promotor_ciudad: user.ciudad || '-',
                        promotor_rango: stats.rank.title,
                        videos_vistos: stats.watchedCount,
                        fichas_descargadas: stats.downloadCount,
                        avance_pct: stats.percentage,
                        pagina_entrada: getCurrentPageName()
                    });
                }
            }
        } catch (e) {}
    }

    function trackGA4CourseStart(itemId, itemType) {
        if (typeof window.gtag !== 'function') return;
        const user = getUserProfile();
        const cleanId = (user && user.idEmpleado) ? String(user.idEmpleado).trim() : 'sin_registrar';
        const info = CATALOGO_VIDEOS[itemId] || {
            module: document.title.split('|')[0].trim(),
            title: itemId
        };
        const stats = getStats();
        syncGA4UserIdentity(false);
        try {
            window.gtag('event', 'inicio_recurso', {
                event_category: info.module,
                event_label: info.title,
                tipo_evento: itemType === 'web' ? 'Inicio Capsula Web' : 'Inicio Video',
                modulo: info.module,
                recurso: info.title,
                recurso_id: itemId,
                promotor_id: cleanId,
                promotor_cadena: user ? user.cadena : 'Sin Registrar',
                promotor_ciudad: user ? user.ciudad : '-',
                avance_pct: stats.percentage
            });
        } catch (e) {}
    }

    function syncToGoogleSheets(tipoEvento, modulo, detalleRecurso) {
        const user = getUserProfile() || {
            nombre: 'Sin Registrar',
            idEmpleado: '-',
            cadena: '-',
            ciudad: '-'
        };
        const stats = getStats();
        const cleanId = (user.idEmpleado && user.idEmpleado !== '-') ? String(user.idEmpleado).trim() : 'sin_registrar';

        const payload = {
            fecha: new Date().toLocaleString('es-MX'),
            timestamp: new Date().toISOString(),
            nombre: user.nombre,
            idEmpleado: user.telefono ? (user.idEmpleado + ' | Tel: ' + user.telefono) : user.idEmpleado,
            cadena: user.cadena,
            ciudad: user.ciudad,
            evento: tipoEvento,
            modulo: modulo,
            recurso: detalleRecurso,
            videosVistos: stats.watchedCount + '/' + stats.TOTAL_VIDEOS,
            fichasDescargadas: stats.downloadCount,
            porcentajeAvance: stats.percentage + '%',
            rango: stats.rank.title
        };

        // Actualizar identidad User-ID y enviar evento enriquecido a Google Analytics 4 (sin PII)
        if (typeof window.gtag === 'function') {
            syncGA4UserIdentity(false);
            try {
                window.gtag('event', 'progreso_capacitacion', {
                    event_category: modulo,
                    event_label: tipoEvento + ': ' + detalleRecurso,
                    tipo_evento: tipoEvento,
                    modulo: modulo,
                    recurso: detalleRecurso,
                    promotor_id: cleanId,
                    promotor_cadena: user.cadena || 'Sin Registrar',
                    promotor_ciudad: user.ciudad || '-',
                    promotor_rango: stats.rank.title,
                    videos_vistos: stats.watchedCount,
                    fichas_descargadas: stats.downloadCount,
                    avance_pct: stats.percentage,
                    value: stats.percentage
                });
            } catch (e) {}
        }

        const scriptUrl = getGoogleScriptUrl();
        if (!scriptUrl) {
            return;
        }

        if (cleanId !== 'sin_registrar' && user.nombre && user.nombre !== 'Sin Registrar') {
            const syncFingerprint = [cleanId, user.nombre, user.cadena || '', user.ciudad || '', stats.watchedCount, stats.downloadCount].join('|');
            try {
                localStorage.setItem('oppo_sheets_autosync_v1', syncFingerprint);
            } catch (e) {}
        }

        try {
            fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'
                },
                body: JSON.stringify(payload)
            }).catch(function () {});
        } catch (e) {}
    }

    function autoSyncExistingProfileToSheets() {
        const user = getUserProfile();
        if (!user || !user.idEmpleado || String(user.idEmpleado).trim() === '' || String(user.idEmpleado).trim() === '-') {
            return;
        }
        const cleanId = String(user.idEmpleado).trim();
        const stats = getStats();
        const syncFingerprint = [cleanId, user.nombre || '', user.cadena || '', user.ciudad || '', stats.watchedCount, stats.downloadCount].join('|');
        let lastSynced = null;
        try {
            lastSynced = localStorage.getItem('oppo_sheets_autosync_v1');
        } catch (e) {}

        if (lastSynced !== syncFingerprint) {
            syncToGoogleSheets('Respaldo Automatico de Perfil', 'Portal Elite', 'Sincronizacion de Promotor Activo');
        }
    }

    // =========================================================================
    // 5. REGISTRO DE AVANCE (VIDEOS Y DESCARGAS)
    // =========================================================================
    function markVideoWatched(videoId) {
        if (!videoId) return;
        const data = getProgressData();
        const isFirstTime = !data.videos[videoId];
        data.videos[videoId] = new Date().toISOString();
        saveProgressData(data);

        const info = CATALOGO_VIDEOS[videoId] || {
            module: document.title.split('|')[0].trim(),
            title: 'Video ' + videoId
        };

        updateVideoCardBadges();
        refreshProgressUI();

        if (isFirstTime) {
            showToast('Progreso guardado: ' + info.title);
            syncToGoogleSheets('Video Completado', info.module, info.title);

            const stats = getStats();
            if (stats.percentage === 100 && data.lastCompletedTotal !== stats.TOTAL_VIDEOS) {
                data.completed100Notified = true;
                data.lastCompletedTotal = stats.TOTAL_VIDEOS;
                saveProgressData(data);
                syncToGoogleSheets('Capacitacion 100% Completada', 'Portal Elite', 'Certificado Desbloqueado (' + stats.TOTAL_VIDEOS + ' recursos)');
                setTimeout(function () {
                    openCertificateModal();
                }, 1200);
            }
        }
    }

    function markDownloadCompleted(href) {
        if (!href) return;
        const cleanHref = href.split('?')[0];
        const data = getProgressData();
        const isFirstTime = !data.downloads[cleanHref];
        data.downloads[cleanHref] = new Date().toISOString();
        saveProgressData(data);

        const fileName = cleanHref.split('/').pop().replace(/\.(png|jpg|jpeg|pdf)$/i, '').replace(/_/g, ' ');
        updateDownloadBadges();
        refreshProgressUI();

        if (isFirstTime) {
            showToast('Ficha registrada: ' + fileName);
            syncToGoogleSheets('Infografia Descargada', document.title.split('|')[0].trim(), fileName);
        }
    }

    // =========================================================================
    // 6. INTERFAZ VISUAL: BARRA DE PROGRESO, INSIGNIAS Y MODALES
    // =========================================================================
    function getCurrentPageName() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page === '' ? 'index.html' : page;
    }

    function injectInternalNavbarBrand() {
        if (document.getElementById('portalEliteNavBadge')) return;
        const stickyHeader = document.querySelector('.sticky.top-0');
        if (!stickyHeader) return;

        const badge = document.createElement('a');
        badge.id = 'portalEliteNavBadge';
        badge.href = 'index.html';
        badge.title = 'Inicio - Portal Elite';
        badge.className = 'inline-flex items-center gap-2 bg-[#121318] text-white px-2.5 py-1.5 rounded-full border border-amber-400/35 shadow-sm hover:scale-105 transition shrink-0';
        badge.innerHTML =
            '<img src="Recursos/Logo/favicon.png" alt="Portal Elite" class="w-6 h-6 rounded-full object-cover border border-amber-400/40">' +
            '<span class="text-xs font-extrabold tracking-wide pr-1 hidden sm:inline">Portal <span class="text-amber-400">Elite</span></span>';

        const themeBtn = stickyHeader.querySelector('button[onclick*="toggleDarkMode"]');
        if (themeBtn && themeBtn.parentNode) {
            const rightGroup = document.createElement('div');
            rightGroup.className = 'flex items-center gap-2 shrink-0';
            themeBtn.parentNode.insertBefore(rightGroup, themeBtn);
            rightGroup.appendChild(badge);
            rightGroup.appendChild(themeBtn);
            return;
        }

        const backLink = stickyHeader.querySelector('a[href="index.html"]');
        if (backLink && backLink.parentNode) {
            badge.classList.add('ml-auto');
            backLink.parentNode.appendChild(badge);
        }
    }

    function injectProgressUI() {
        const page = getCurrentPageName();
        if (page === 'index.html') {
            injectHomeDashboard();
            updateHomeModuleBadges();
        } else {
            injectInternalNavbarBrand();
            injectInternalPageBar(page);
            updateVideoCardBadges();
            updateDownloadBadges();
        }
        injectModals();
    }

    function injectHomeDashboard() {
        const main = document.getElementById('mainContent');
        if (!main || document.getElementById('oppoProgressDashboard')) return;

        const container = document.createElement('div');
        container.id = 'oppoProgressDashboard';
        container.className = 'mb-8 animate-fade-in';
        main.insertBefore(container, main.firstChild);
        renderHomeDashboard();
    }

    function renderHomeDashboard() {
        const container = document.getElementById('oppoProgressDashboard');
        if (!container) return;

        const user = getUserProfile();
        const stats = getStats();

        if (!user) {
            container.innerHTML =
                '<div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 text-white shadow-xl border border-amber-400/30 relative overflow-hidden">' +
                    '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">' +
                        '<div class="flex items-center gap-4">' +
                            '<img src="Recursos/Logo/favicon.png" alt="Portal Elite" class="w-14 h-14 rounded-2xl object-cover border border-amber-400/50 shadow-lg shrink-0">' +
                            '<div>' +
                                '<span class="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full mb-1">Portal Elite</span>' +
                                '<h3 class="text-xl font-black">Reg&iacute;strate para guardar tu progreso</h3>' +
                                '<p class="text-gray-300 text-xs sm:text-sm">Lleva el control de tus c&aacute;psulas completadas y desbloquea tu Certificado Digital Elite.</p>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="window.oppoProgress.openProfileModal()" class="w-full sm:w-auto bg-oppogreen hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm shrink-0">' +
                            '<i class="fas fa-id-badge mr-2"></i> Comenzar Registro' +
                        '</button>' +
                    '</div>' +
                    '<div class="mt-5 pt-4 border-t border-white/10">' +
                        '<div class="flex justify-between text-xs text-gray-300 mb-1.5">' +
                            '<span>Tu avance actual en este dispositivo</span>' +
                            '<span class="font-bold text-oppogreen">' + stats.watchedCount + ' de ' + stats.TOTAL_VIDEOS + ' videos y c&aacute;psulas (' + stats.percentage + '%)</span>' +
                        '</div>' +
                        '<div class="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">' +
                            '<div class="h-full bg-gradient-to-r from-oppogreen to-teal-400 rounded-full transition-all duration-700" style="width: ' + stats.percentage + '%"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            return;
        }

        const initials = user.nombre
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(function (n) { return n[0].toUpperCase(); })
            .join('');

        const hideData = isPrivacyModeEnabled();
        const displayName = hideData ? escapeHtml(maskPromotorName(user.nombre)) : escapeHtml(user.nombre);
        const badgesExtraHtml = hideData
            ? '<span class="text-xs font-bold text-amber-300 bg-amber-400/15 border border-amber-400/35 px-2.5 py-0.5 rounded-full">' +
                  '<i class="fas fa-eye-slash mr-1 text-amber-400"></i> Datos ocultos' +
              '</span>'
            : '<span class="text-xs font-bold text-white bg-oppogreen/30 border border-oppogreen/50 px-2.5 py-0.5 rounded-full">' +
                  '<i class="fas fa-id-card mr-1 text-oppogreen"></i> ID: ' + escapeHtml(user.idEmpleado) +
              '</span>' +
              '<span class="text-xs text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-full">' +
                  '<i class="fas fa-store mr-1 text-oppogreen"></i> ' + escapeHtml(user.cadena) +
              '</span>';

        const subtitleHtml = hideData
            ? 'ID: &bull;&bull;&bull;&bull;&bull;&bull;' + (user.telefono ? ' &bull; Tel: &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;' : '') + ' &bull; Cadena y sucursal protegidas'
            : escapeHtml(user.ciudad) + (user.telefono ? ' &bull; Tel: ' + escapeHtml(user.telefono) : '');

        const eyeBtnClass = hideData
            ? 'bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10';
        const eyeIcon = hideData ? 'fa-eye-slash' : 'fa-eye';
        const eyeTitle = hideData ? 'Mostrar mis datos de registro' : 'Ocultar mis datos para tomar captura';
        const eyeLabel = hideData ? 'Mostrar datos' : 'Ocultar datos';

        container.innerHTML =
            '<div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 text-white shadow-xl border border-white/10 relative overflow-hidden">' +
                '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">' +
                    '<div class="flex items-center gap-4">' +
                        '<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-oppogreen to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">' +
                            initials +
                        '</div>' +
                        '<div>' +
                            '<div class="flex flex-wrap items-center gap-2 mb-1">' +
                                '<span class="text-xs font-bold px-2.5 py-0.5 rounded-full border ' + stats.rank.bgBadge + '">' +
                                    '<i class="fas ' + stats.rank.icon + ' mr-1"></i> ' + stats.rank.title +
                                '</span>' +
                                badgesExtraHtml +
                            '</div>' +
                            '<h3 class="text-xl font-black leading-tight">' + displayName + '</h3>' +
                            '<p class="text-xs text-gray-400">' + subtitleHtml + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex flex-wrap items-center gap-2 self-start md:self-center">' +
                        '<button onclick="window.oppoProgress.openCertificateModal()" class="bg-oppogreen hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow transition flex items-center gap-1.5">' +
                            '<i class="fas fa-award"></i> <span>Mi Avance / Certificado</span>' +
                        '</button>' +
                        '<button onclick="window.oppoProgress.togglePrivacyMode()" title="' + eyeTitle + '" class="' + eyeBtnClass + ' text-xs sm:text-sm font-semibold py-2.5 px-3 rounded-xl transition flex items-center gap-1.5">' +
                            '<i class="fas ' + eyeIcon + '"></i> <span class="text-xs">' + eyeLabel + '</span>' +
                        '</button>' +
                        '<button onclick="window.oppoProgress.openProfileModal()" title="Editar mis datos" class="bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium py-2.5 px-3 rounded-xl transition">' +
                            '<i class="fas fa-user-edit"></i>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="mt-5">' +
                    '<div class="flex flex-wrap items-center justify-between text-xs sm:text-sm mb-2 gap-2">' +
                        '<span class="font-semibold text-gray-200 flex items-center">' +
                            '<i class="fas fa-chart-line text-oppogreen mr-2"></i> Progreso General de Capacitaci&oacute;n' +
                        '</span>' +
                        '<div class="flex items-center gap-3">' +
                            '<span class="text-gray-300"><strong class="text-white">' + stats.watchedCount + '</strong>/' + stats.TOTAL_VIDEOS + ' videos y c&aacute;psulas</span>' +
                            '<span class="bg-oppogreen text-white font-black px-2.5 py-0.5 rounded-lg text-xs">' + stats.percentage + '%</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="w-full h-3.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">' +
                        '<div class="h-full bg-gradient-to-r from-oppogreen via-emerald-400 to-teal-300 rounded-full transition-all duration-700 relative" style="width: ' + Math.max(stats.percentage, 2) + '%"></div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function updateHomeModuleBadges() {
        const links = document.querySelectorAll('a[href$=".html"]');
        links.forEach(function (link) {
            const href = link.getAttribute('href');
            if (!href || href === 'index.html' || href === 'ola.html' || href === 'capacita-piso.html') return;

            const modStats = getModuleStats(href);
            if (!modStats) return;

            const unitLabel = (href === 'capsulas.html') ? 'c&aacute;psulas' : 'videos';

            let badge = link.querySelector('.oppo-mod-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'oppo-mod-badge mt-2 inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all';
                const targetContainer = link.querySelector('div') || link;
                targetContainer.appendChild(badge);
            }

            if (modStats.watched >= modStats.total) {
                badge.className = 'oppo-mod-badge mt-2 inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-oppogreen border border-oppogreen/30';
                badge.innerHTML = '<i class="fas fa-check-circle mr-1"></i> Completado (' + modStats.watched + '/' + modStats.total + ')';
            } else if (modStats.watched > 0) {
                badge.className = 'oppo-mod-badge mt-2 inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30';
                badge.innerHTML = '<i class="fas fa-play-circle mr-1"></i> En curso (' + modStats.watched + '/' + modStats.total + ' ' + unitLabel + ')';
            } else {
                badge.className = 'oppo-mod-badge mt-2 inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-200/70 text-gray-600';
                badge.innerHTML = '<i class="far fa-circle mr-1"></i> ' + modStats.total + ' ' + unitLabel;
            }
        });
    }

    function injectInternalPageBar(pageName) {
        if (pageName === 'ola.html' || pageName === 'capacita-piso.html') return;
        const modStats = getModuleStats(pageName);
        if (!modStats) return;

        let bar = document.getElementById('oppoInternalProgressBar');
        if (!bar) {
            const main = document.querySelector('main');
            if (!main) return;
            bar = document.createElement('div');
            bar.id = 'oppoInternalProgressBar';
            bar.className = 'mb-6';
            main.insertBefore(bar, main.firstChild);
        }

        const globalStats = getStats();
        const user = getUserProfile();
        const hideData = isPrivacyModeEnabled();
        const userLabel = user
            ? (hideData ? escapeHtml(maskPromotorName(user.nombre)) : (escapeHtml(user.nombre.split(' ')[0]) + ' (ID: ' + escapeHtml(user.idEmpleado) + ')'))
            : 'Registrarme';
        const unitLabel = (pageName === 'capsulas.html') ? 'c&aacute;psulas y videos' : 'videos';
        const internalEyeBtn = user
            ? '<button onclick="window.oppoProgress.togglePrivacyMode()" title="' + (hideData ? 'Mostrar mis datos' : 'Ocultar mis datos para captura') + '" class="text-xs font-bold ' + (hideData ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600') + ' px-2.5 py-2 rounded-xl transition flex items-center justify-center shrink-0">' +
                  '<i class="fas ' + (hideData ? 'fa-eye-slash' : 'fa-eye') + '"></i>' +
              '</button>'
            : '';

        bar.innerHTML =
            '<div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
                '<div class="flex-1">' +
                    '<div class="flex items-center justify-between text-xs font-bold mb-1.5">' +
                        '<span class="text-gray-700 flex items-center">' +
                            '<i class="fas fa-check-double text-oppogreen mr-1.5"></i> Avance en ' + modStats.moduleName + ': ' +
                            '<span class="text-oppogreen ml-1">' + modStats.watched + ' de ' + modStats.total + ' ' + unitLabel + ' (' + modStats.percentage + '%)</span>' +
                        '</span>' +
                        '<span class="text-gray-400">Total Global: ' + globalStats.watchedCount + '/' + globalStats.TOTAL_VIDEOS + ' (' + globalStats.percentage + '%)</span>' +
                    '</div>' +
                    '<div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">' +
                        '<div class="h-full bg-gradient-to-r from-oppogreen to-teal-400 rounded-full transition-all duration-500" style="width: ' + modStats.percentage + '%"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">' +
                    internalEyeBtn +
                    '<button onclick="window.oppoProgress.openProfileModal()" class="text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0">' +
                        '<i class="fas fa-user-circle text-oppogreen text-sm"></i> <span>' + userLabel + '</span>' +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    function updateVideoCardBadges() {
        const progress = getProgressData();
        const cards = document.querySelectorAll('[onclick*="openVideo"], [onclick*="openWebCapsule"]');
        cards.forEach(function (card) {
            const onclickAttr = card.getAttribute('onclick') || '';
            const match = onclickAttr.match(/(?:openVideo|openWebCapsule)\(['"]([^'"]+)['"]\)/);
            if (!match) return;
            const videoId = match[1];
            const isWatched = !!progress.videos[videoId];

            const thumbContainer = card.querySelector('.aspect-video') || card;
            let badge = thumbContainer.querySelector('.oppo-video-status-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'oppo-video-status-badge absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold shadow-md transition-all duration-300 flex items-center gap-1';
                thumbContainer.appendChild(badge);
            }

            if (isWatched) {
                badge.className = 'oppo-video-status-badge absolute top-3 right-3 z-20 px-3 py-1 rounded-full text-xs font-bold shadow-md bg-oppogreen text-white flex items-center gap-1';
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Completado';
                card.classList.add('ring-2', 'ring-oppogreen/40');
            } else {
                badge.className = 'oppo-video-status-badge absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow bg-black/60 text-white/90 backdrop-blur-sm flex items-center gap-1';
                badge.innerHTML = '<i class="far fa-clock"></i> Pendiente';
                card.classList.remove('ring-2', 'ring-oppogreen/40');
            }
        });
    }

    function updateDownloadBadges() {
        const progress = getProgressData();
        const dlLinks = document.querySelectorAll('a[download]');
        dlLinks.forEach(function (link) {
            const href = (link.getAttribute('href') || '').split('?')[0];
            if (!href) return;

            if (!link.dataset.oppoBound) {
                link.dataset.oppoBound = '1';
                link.addEventListener('click', function () {
                    markDownloadCompleted(href);
                });
            }

            const isDownloaded = !!progress.downloads[href];
            let statusEl = link.querySelector('.oppo-dl-status');
            if (isDownloaded && !statusEl) {
                statusEl = document.createElement('span');
                statusEl.className = 'oppo-dl-status ml-2 text-xs bg-white text-oppogreen font-extrabold px-2.5 py-1 rounded-full shadow-sm';
                statusEl.innerHTML = '<i class="fas fa-check mr-1"></i> Descargada';
                link.appendChild(statusEl);
            }
        });
    }

    function refreshProgressUI() {
        const page = getCurrentPageName();
        if (page === 'index.html') {
            renderHomeDashboard();
            updateHomeModuleBadges();
        } else {
            injectInternalPageBar(page);
        }
    }

    // =========================================================================
    // 7. MODALES DE REGISTRO Y CERTIFICADO DIGITAL
    // =========================================================================
    function injectModals() {
        if (document.getElementById('oppoProfileModal')) return;

        const modalWrapper = document.createElement('div');
        modalWrapper.innerHTML =
            '<!-- MODAL DE REGISTRO DE PROMOTOR -->' +
            '<div id="oppoProfileModal" class="fixed inset-0 bg-black/80 z-[110] hidden items-center justify-center p-4 backdrop-blur-sm" onclick="if(event.target === this) window.oppoProgress.closeProfileModal()">' +
                '<div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">' +
                    '<button onclick="window.oppoProgress.closeProfileModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                    '<div class="flex items-center gap-3 mb-4">' +
                        '<div class="w-12 h-12 rounded-2xl bg-oppogreen/15 text-oppogreen flex items-center justify-center text-2xl">' +
                            '<i class="fas fa-user-graduate"></i>' +
                        '</div>' +
                        '<div>' +
                            '<span class="text-[11px] font-bold uppercase tracking-wider text-oppogreen">Registro Oficial</span>' +
                            '<h3 class="text-xl font-black text-gray-800">Perfil de Capacitaci&oacute;n</h3>' +
                        '</div>' +
                    '</div>' +
                    '<p class="text-xs sm:text-sm text-gray-500 mb-5">Ingresa tus datos para sincronizar tu barra de progreso y emitir tu Certificado OPPO.</p>' +
                    '<form id="oppoProfileForm" onsubmit="window.oppoProgress.submitProfileForm(event)" class="space-y-4">' +
                        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
                            '<div>' +
                                '<label class="block text-xs font-bold text-gray-700 uppercase mb-1"><i class="fas fa-id-card text-oppogreen mr-1"></i> ID de Promotor *</label>' +
                                '<input type="text" id="oppoInputId" required placeholder="Ej. OPPO-1024" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-semibold focus:outline-none focus:border-oppogreen">' +
                            '</div>' +
                            '<div>' +
                                '<label class="block text-xs font-bold text-gray-700 uppercase mb-1">Tel&eacute;fono / WhatsApp</label>' +
                                '<input type="tel" id="oppoInputTelefono" placeholder="Ej. 5512345678" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-oppogreen">' +
                            '</div>' +
                        '</div>' +
                        '<div>' +
                            '<label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nombre y Apellido *</label>' +
                            '<input type="text" id="oppoInputNombre" required placeholder="Ej. Carlos Mendoza" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-oppogreen">' +
                        '</div>' +
                        '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
                            '<div>' +
                                '<label class="block text-xs font-bold text-gray-700 uppercase mb-1">Cadena / Punto *</label>' +
                                '<select id="oppoInputCadena" required class="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-oppogreen">' +
                                    '<option value="">Seleccionar...</option>' +
                                    '<option value="OPPO Elite">OPPO Elite</option>' +
                                    '<option value="Telcel">Telcel</option>' +
                                    '<option value="AT&T">AT&amp;T</option>' +
                                    '<option value="Movistar">Movistar</option>' +
                                    '<option value="Coppel">Coppel</option>' +
                                    '<option value="Elektra">Elektra</option>' +
                                    '<option value="Sears">Sears</option>' +
                                    '<option value="Suburbia">Suburbia</option>' +
                                    '<option value="Liverpool">Liverpool</option>' +
                                    '<option value="Otra Cadena">Otra Cadena</option>' +
                                '</select>' +
                            '</div>' +
                            '<div>' +
                                '<label class="block text-xs font-bold text-gray-700 uppercase mb-1">Ciudad / Sucursal *</label>' +
                                '<input type="text" id="oppoInputCiudad" required placeholder="Ej. CDMX - Centro" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm focus:outline-none focus:border-oppogreen">' +
                            '</div>' +
                        '</div>' +
                        '<button type="submit" class="w-full bg-oppogreen hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition transform hover:scale-[1.01] text-sm mt-2">' +
                            '<i class="fas fa-save mr-2"></i> Guardar y Activar Mi Progreso' +
                        '</button>' +
                    '</form>' +
                '</div>' +
            '</div>' +

            '<!-- MODAL DE CERTIFICADO Y RESUMEN DE AVANCE -->' +
            '<div id="oppoCertificateModal" class="fixed inset-0 bg-black/85 z-[110] hidden items-center justify-center p-4 backdrop-blur-sm overflow-y-auto" onclick="if(event.target === this) window.oppoProgress.closeCertificateModal()">' +
                '<div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 my-8">' +
                    '<button onclick="window.oppoProgress.closeCertificateModal()" class="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                    '<div id="oppoCertificateContent"></div>' +
                '</div>' +
            '</div>' +

            '<!-- MODAL DE RUBRICA PREVIA DE CONOCIMIENTO -->' +
            '<div id="oppoRubricModal" class="fixed inset-0 bg-black/85 z-[115] hidden items-center justify-center p-4 backdrop-blur-md overflow-y-auto" onclick="if(event.target === this) window.oppoProgress.closeRubricModal()">' +
                '<div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-oppogreen/30 my-6 animate-fade-in">' +
                    '<button onclick="window.oppoProgress.closeRubricModal()" title="Cerrar" class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                    '<div class="flex items-center gap-3 mb-4 pr-8">' +
                        '<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-oppogreen to-emerald-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">' +
                            '<i class="fas fa-clipboard-check"></i>' +
                        '</div>' +
                        '<div>' +
                            '<span id="oppoRubricBadge" class="inline-block text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-oppogreen px-2.5 py-0.5 rounded-full border border-oppogreen/25">R&uacute;brica de Conocimiento</span>' +
                            '<h3 id="oppoRubricTitle" class="text-lg sm:text-xl font-black text-gray-900 leading-tight mt-1">Objetivo de Aprendizaje</h3>' +
                        '</div>' +
                    '</div>' +
                    '<div class="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200/80 mb-4">' +
                        '<p class="text-xs font-extrabold uppercase tracking-wider text-oppogreen mb-3 flex items-center gap-1.5">' +
                            '<i class="fas fa-bullseye"></i> En esta c&aacute;psula vas a aprender a:' +
                        '</p>' +
                        '<ul id="oppoRubricList" class="space-y-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed"></ul>' +
                    '</div>' +
                    '<div class="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-2xl p-3.5 sm:p-4 mb-5 flex items-start gap-3 border border-oppogreen/30">' +
                        '<div class="w-8 h-8 rounded-xl bg-oppogreen/20 border border-oppogreen/40 text-oppogreen flex items-center justify-center shrink-0 mt-0.5">' +
                            '<i class="fas fa-bolt text-sm"></i>' +
                        '</div>' +
                        '<div>' +
                            '<span class="text-[10px] font-extrabold uppercase tracking-wider text-oppogreen block">Impacto en Piso de Venta</span>' +
                            '<p id="oppoRubricImpact" class="text-xs text-gray-200 leading-relaxed mt-0.5"></p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex flex-col gap-2.5">' +
                        '<button id="oppoRubricConfirmBtn" onclick="window.oppoProgress.confirmRubricAndStart()" class="w-full bg-oppogreen hover:bg-emerald-600 text-white font-black py-3.5 px-5 rounded-2xl shadow-lg transition transform hover:scale-[1.01] text-sm flex items-center justify-center gap-2">' +
                            '<i class="fas fa-play-circle text-lg"></i> <span id="oppoRubricConfirmText">&iexcl;Estoy listo! Iniciar C&aacute;psula</span>' +
                        '</button>' +
                        '<a id="oppoRubricExternalBtn" href="#" target="_blank" rel="noopener noreferrer" onclick="window.oppoProgress.markExternalWebStarted()" class="hidden w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs text-center items-center justify-center gap-1.5 transition">' +
                            '<i class="fas fa-external-link-alt text-oppogreen"></i> <span>Abrir directamente en pesta&ntilde;a completa</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<!-- MODAL VISOR INTERACTIVO DE CAPSULA WEB -->' +
            '<div id="oppoWebCapsuleModal" class="fixed inset-0 bg-black/95 z-[118] hidden flex-col items-center justify-center p-2 sm:p-4 backdrop-blur-md" onclick="if(event.target === this) window.oppoProgress.closeWebCapsuleModal()">' +
                '<div class="w-full max-w-6xl flex items-center justify-between px-2 sm:px-4 py-2 mb-2 text-white z-10 gap-2">' +
                    '<div class="flex items-center gap-2.5 truncate pr-2">' +
                        '<span class="bg-oppogreen text-white text-[10px] sm:text-xs font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0">' +
                            '<i class="fas fa-laptop-code"></i> C&aacute;psula Web' +
                        '</span>' +
                        '<h4 id="oppoWebCapsuleTitle" class="text-xs sm:text-sm font-bold text-white/90 truncate">C&aacute;psula Interactiva OPPO</h4>' +
                    '</div>' +
                    '<div class="flex items-center gap-2 shrink-0">' +
                        '<a id="oppoWebCapsuleExtLink" href="#" target="_blank" rel="noopener noreferrer" class="bg-oppogreen hover:bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition flex items-center gap-1.5 shadow">' +
                            '<i class="fas fa-external-link-alt"></i> <span class="hidden sm:inline">Abrir en Pesta&ntilde;a Completa</span>' +
                        '</a>' +
                        '<button onclick="window.oppoProgress.closeWebCapsuleModal()" title="Cerrar c&aacute;psula (Esc)" class="bg-white/10 hover:bg-white/20 text-white text-lg w-9 h-9 rounded-xl flex items-center justify-center transition">' +
                            '<i class="fas fa-times"></i>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<div class="w-full max-w-6xl h-[80vh] bg-gray-900 rounded-2xl overflow-hidden relative shadow-2xl border border-white/15">' +
                    '<div id="oppoWebCapsuleSpinner" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-10 transition-opacity duration-300">' +
                        '<div class="w-12 h-12 border-4 border-oppogreen/30 border-t-oppogreen rounded-full animate-spin mb-3"></div>' +
                        '<span class="text-xs text-gray-300 tracking-wider">Cargando experiencia interactiva OPPO...</span>' +
                    '</div>' +
                    '<iframe id="oppoWebCapsuleIframe" src="about:blank" class="w-full h-full border-0 bg-white" allow="fullscreen; clipboard-write; autoplay" onload="window.oppoProgress.onWebCapsuleLoad()"></iframe>' +
                '</div>' +
                '<div id="oppoWebWatchStatus" class="mt-2.5 text-xs font-semibold px-3.5 py-1 rounded-full bg-white/10 text-gray-200 border border-white/15 flex items-center gap-1.5">' +
                    '<i class="fas fa-info-circle text-oppogreen"></i> <span>Para completar, m&iacute;ralo hasta el final</span>' +
                '</div>' +
            '</div>' +

            '<!-- TOAST DE NOTIFICACION -->' +
            '<div id="oppoProgressToast" class="fixed bottom-6 right-6 z-[125] hidden items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-oppogreen/40 text-xs sm:text-sm font-semibold">' +
                '<i id="oppoProgressToastIcon" class="fas fa-check-circle text-oppogreen text-lg"></i>' +
                '<span id="oppoProgressToastText">Progreso actualizado</span>' +
            '</div>';

        document.body.appendChild(modalWrapper);

        // Si el usuario nunca se ha registrado y entra a index.html, mostrar registro tras 1.5s
        const user = getUserProfile();
        if (!user && getCurrentPageName() === 'index.html' && !sessionStorage.getItem('oppo_prompted_reg')) {
            sessionStorage.setItem('oppo_prompted_reg', '1');
            setTimeout(function () {
                openProfileModal();
            }, 1200);
        }
    }

    function openProfileModal() {
        const modal = document.getElementById('oppoProfileModal');
        if (!modal) return;
        const user = getUserProfile();
        if (user) {
            document.getElementById('oppoInputNombre').value = user.nombre || '';
            document.getElementById('oppoInputId').value = user.idEmpleado || '';
            const telInput = document.getElementById('oppoInputTelefono');
            if (telInput) telInput.value = user.telefono || '';
            document.getElementById('oppoInputCadena').value = user.cadena || '';
            document.getElementById('oppoInputCiudad').value = user.ciudad || '';
        }
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeProfileModal() {
        const modal = document.getElementById('oppoProfileModal');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    function submitProfileForm(e) {
        e.preventDefault();
        const nombre = document.getElementById('oppoInputNombre').value.trim();
        const idEmpleado = document.getElementById('oppoInputId').value.trim();
        const telInput = document.getElementById('oppoInputTelefono');
        const telefono = telInput ? telInput.value.trim() : '';
        const cadena = document.getElementById('oppoInputCadena').value.trim();
        const ciudad = document.getElementById('oppoInputCiudad').value.trim();
        if (!nombre || !idEmpleado || !cadena || !ciudad) return;

        const existing = getUserProfile();
        const profile = {
            nombre: nombre,
            idEmpleado: idEmpleado,
            telefono: telefono,
            cadena: cadena,
            ciudad: ciudad,
            fechaRegistro: existing ? existing.fechaRegistro : new Date().toISOString()
        };
        saveUserProfile(profile);
        closeProfileModal();
        refreshProgressUI();
        showToast('Bienvenido/a, ' + nombre.split(' ')[0] + ' (ID: ' + idEmpleado + ')');
        syncToGoogleSheets(existing ? 'Actualizacion de Perfil' : 'Nuevo Registro', 'Perfil Promotor', 'ID: ' + idEmpleado + ' | ' + cadena + ' - ' + ciudad);
    }

    function openCertificateModal() {
        const modal = document.getElementById('oppoCertificateModal');
        const content = document.getElementById('oppoCertificateContent');
        if (!modal || !content) return;

        const user = getUserProfile() || {
            nombre: 'Promotor Sin Registrar',
            idEmpleado: '-',
            cadena: '-',
            ciudad: '-'
        };
        const stats = getStats();
        const fechaHoy = new Date().toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const pages = [
            'a7-pro-5g.html',
            'serie-a.html',
            'serie-reno.html',
            'serie-find.html',
            'oppo-ia.html',
            'tecnologia.html',
            'ventas.html',
            'tutoriales.html',
            'capsulas.html'
        ];

        let modulesHtml = '';
        pages.forEach(function (p) {
            const m = getModuleStats(p);
            if (!m) return;
            const done = m.watched >= m.total;
            modulesHtml +=
                '<div class="flex items-center justify-between py-2 border-b border-gray-100 text-xs">' +
                    '<span class="font-semibold text-gray-700 flex items-center">' +
                        '<i class="fas ' + (done ? 'fa-check-circle text-oppogreen' : 'fa-circle text-gray-300') + ' mr-2"></i>' +
                        m.moduleName +
                    '</span>' +
                    '<span class="font-bold ' + (done ? 'text-oppogreen' : 'text-gray-500') + '">' + m.watched + '/' + m.total + ' (' + m.percentage + '%)</span>' +
                '</div>';
        });

        const hideData = isPrivacyModeEnabled();
        const certNameHtml = hideData ? escapeHtml(maskPromotorName(user.nombre)) : escapeHtml(user.nombre);
        const certSubHtml = hideData
            ? 'Datos de registro protegidos &bull; ID: &bull;&bull;&bull;&bull;&bull;&bull;'
            : escapeHtml(user.cadena) + ' &bull; ' + escapeHtml(user.ciudad) + ' &bull; ID: ' + escapeHtml(user.idEmpleado);

        const shareIdentity = hideData
            ? maskPromotorName(user.nombre)
            : (user.nombre + ' (ID: ' + user.idEmpleado + ' | ' + user.cadena + ' - ' + user.ciudad + ')');

        const shareText = encodeURIComponent(
            'Hola! Soy ' + shareIdentity + '. ' +
            'Llevo un ' + stats.percentage + '% de avance (' + stats.watchedCount + '/' + stats.TOTAL_VIDEOS + ' videos y capsulas) ' +
            'en Portal Elite. Rango actual: ' + stats.rank.title + '.'
        );

        const certEyeBtn =
            '<div class="flex justify-center mb-3">' +
                '<button onclick="window.oppoProgress.togglePrivacyMode()" class="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition ' + (hideData ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200') + '">' +
                    '<i class="fas ' + (hideData ? 'fa-eye-slash text-amber-600' : 'fa-eye text-oppogreen') + '"></i>' +
                    '<span>' + (hideData ? 'Datos ocultos (toca para mostrar)' : 'Ocultar mis datos para captura') + '</span>' +
                '</button>' +
            '</div>';

        content.innerHTML =
            certEyeBtn +
            '<div class="text-center border-2 border-amber-400/40 rounded-2xl p-5 bg-gradient-to-b from-amber-50/30 via-emerald-50/20 to-white">' +
                '<div class="w-36 mx-auto mb-3 rounded-2xl overflow-hidden border border-amber-400/40 shadow-lg bg-[#121318] p-1">' +
                    '<img src="Recursos/Logo/logo_portal_elite.jpg" alt="Portal Elite" class="w-full h-auto rounded-xl object-contain">' +
                '</div>' +
                '<span class="text-[11px] font-extrabold uppercase tracking-widest text-oppogreen">Constancia Oficial &bull; Portal Elite</span>' +
                '<h3 class="text-2xl font-black text-gray-800 mt-1">' + certNameHtml + '</h3>' +
                '<p class="text-xs text-gray-500 mt-0.5">' + certSubHtml + '</p>' +
                '<div class="my-4 inline-flex items-center gap-3 bg-gray-900 text-white px-5 py-2.5 rounded-2xl shadow">' +
                    '<div class="text-left">' +
                        '<div class="text-[10px] uppercase text-gray-400">Nivel Alcanzado</div>' +
                        '<div class="text-sm font-extrabold text-oppogreen">' + stats.rank.title + '</div>' +
                    '</div>' +
                    '<div class="h-7 w-px bg-white/20"></div>' +
                    '<div class="text-right">' +
                        '<div class="text-[10px] uppercase text-gray-400">Avance Total</div>' +
                        '<div class="text-lg font-black">' + stats.percentage + '%</div>' +
                    '</div>' +
                '</div>' +
                '<div class="text-left mt-3 bg-white rounded-xl p-3 border border-gray-100 max-h-48 overflow-y-auto">' +
                    '<div class="text-[11px] font-bold uppercase text-gray-400 mb-1">Desglose por M&oacute;dulo (' + stats.watchedCount + '/' + stats.TOTAL_VIDEOS + ' videos y c&aacute;psulas)</div>' +
                    modulesHtml +
                '</div>' +
                '<p class="text-[11px] text-gray-400 mt-3">Emitido el ' + fechaHoy + '</p>' +
            '</div>' +
            '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">' +
                '<a href="https://wa.me/?text=' + shareText + '" target="_blank" class="bg-oppogreen hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow">' +
                    '<i class="fab fa-whatsapp text-lg"></i> Compartir por WhatsApp' +
                '</a>' +
                '<button onclick="window.print()" class="bg-gray-800 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2">' +
                    '<i class="fas fa-print"></i> Guardar / Imprimir PDF' +
                '</button>' +
            '</div>';

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeCertificateModal() {
        const modal = document.getElementById('oppoCertificateModal');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    let toastTimeout = null;
    function showToast(message, isWarning) {
        const toast = document.getElementById('oppoProgressToast');
        const text = document.getElementById('oppoProgressToastText');
        const icon = document.getElementById('oppoProgressToastIcon');
        if (!toast || !text) return;
        text.textContent = message;
        if (icon) {
            icon.className = isWarning
                ? 'fas fa-exclamation-triangle text-amber-400 text-lg'
                : 'fas fa-check-circle text-oppogreen text-lg';
        }
        toast.className = isWarning
            ? 'fixed bottom-6 right-6 z-[125] flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/60 text-xs sm:text-sm font-semibold'
            : 'fixed bottom-6 right-6 z-[125] flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-oppogreen/40 text-xs sm:text-sm font-semibold';
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toast.classList.add('hidden');
            toast.classList.remove('flex');
        }, 3800);
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // =========================================================================
    // 8. RUBRICA PREVIA, VERIFICACION DE VIDEO COMPLETO Y VISOR DE CAPSULAS WEB
    // =========================================================================
    let pendingRubricItem = null;
    let rawOpenVideoFn = null;
    let rawCloseModalFn = null;

    // Estado del rastreador de reproduccion de video
    let activeVideoTracker = null;
    // Estado del rastreador de capsula web
    let activeWebTracker = null;

    function ensureVideoStatusBadge() {
        const modal = document.getElementById('videoModal');
        if (!modal) return null;
        let badge = document.getElementById('oppoVideoWatchStatus');
        if (!badge) {
            const videoContainer = document.getElementById('videoContainer');
            badge = document.createElement('div');
            badge.id = 'oppoVideoWatchStatus';
            if (videoContainer && videoContainer.parentNode) {
                videoContainer.parentNode.insertBefore(badge, videoContainer.nextSibling);
            } else {
                modal.appendChild(badge);
            }
        }
        return badge;
    }

    function renderVideoStatusBadge(state) {
        const badge = ensureVideoStatusBadge();
        if (!badge) return;
        if (state === 'completed') {
            badge.className = 'mt-2.5 text-xs font-extrabold tracking-wide bg-oppogreen text-white px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 shadow-lg transition-all';
            badge.innerHTML = '<i class="fas fa-check-circle"></i> <span>&iexcl;Completado!</span>';
        } else {
            badge.className = 'mt-2.5 text-xs font-semibold tracking-wide bg-white/10 text-gray-200 border border-white/15 px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 transition-all';
            badge.innerHTML = '<i class="fas fa-info-circle text-oppogreen"></i> <span>Para completar, m&iacute;ralo hasta el final</span>';
        }
    }

    function stopVideoCompletionTracker(wasClosedByUser) {
        if (!activeVideoTracker) return;
        const tracker = activeVideoTracker;
        activeVideoTracker = null;

        if (tracker.intervalId) clearInterval(tracker.intervalId);
        if (tracker.handshakeId) clearInterval(tracker.handshakeId);
        if (tracker.msgHandler) window.removeEventListener('message', tracker.msgHandler);
    }

    function startVideoCompletionTracker(videoId) {
        stopVideoCompletionTracker(false);

        const alreadyWatched = !!getProgressData().videos[videoId];
        if (alreadyWatched) {
            renderVideoStatusBadge('completed');
            return;
        }

        renderVideoStatusBadge('watching');

        // Si se abre en protocolo local file://, limpiar &origin= para permitir comunicacion postMessage con YouTube
        const iframe = document.getElementById('modalIframe');
        if (iframe && window.location.protocol === 'file:' && iframe.src && iframe.src.indexOf('&origin=') !== -1) {
            iframe.src = iframe.src.replace(/&origin=[^&]+/, '');
        }

        const tracker = {
            id: videoId,
            completed: false,
            ytConnected: false,
            duration: 0,
            currentTime: 0,
            playerState: -1,
            activeWatchedSeconds: 0,
            fallbackSeconds: 0,
            intervalId: null,
            handshakeId: null,
            msgHandler: null
        };
        activeVideoTracker = tracker;

        tracker.msgHandler = function (e) {
            if (!activeVideoTracker || activeVideoTracker.id !== videoId) return;
            if (!e.origin || (e.origin.indexOf('youtube.com') === -1 && e.origin.indexOf('youtube-nocookie.com') === -1)) return;
            let data = null;
            try {
                data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
            } catch (err) {
                return;
            }
            if (!data) return;

            if (data.event === 'infoDelivery' && data.info) {
                tracker.ytConnected = true;
                if (typeof data.info.duration === 'number' && data.info.duration > 0) {
                    tracker.duration = data.info.duration;
                }
                if (typeof data.info.currentTime === 'number') {
                    tracker.currentTime = data.info.currentTime;
                }
                if (typeof data.info.playerState === 'number') {
                    tracker.playerState = data.info.playerState;
                }
            } else if (data.event === 'onStateChange' && typeof data.info === 'number') {
                tracker.ytConnected = true;
                tracker.playerState = data.info;
            }

            // Si el reproductor reporta estado 0 (ENDED = finalizado)
            if (tracker.playerState === 0 && tracker.duration > 0) {
                const minRequired = Math.max(4, Math.min(tracker.duration * 0.78, tracker.duration - 3));
                if (tracker.activeWatchedSeconds >= minRequired) {
                    completeTrackedVideo(tracker);
                }
            }
        };

        window.addEventListener('message', tracker.msgHandler);

        // Enviar handshake periodico al iframe de YouTube
        tracker.handshakeId = setInterval(function () {
            const frame = document.getElementById('modalIframe');
            if (!frame || !frame.contentWindow) return;
            try {
                frame.contentWindow.postMessage(JSON.stringify({
                    event: 'listening',
                    id: 'oppo_yt_tracker'
                }), '*');
                frame.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'addEventListener',
                    args: ['onStateChange']
                }), '*');
            } catch (err) {}
        }, 800);

        // Reloj de verificacion interna silenciosa segundo a segundo
        tracker.intervalId = setInterval(function () {
            if (!activeVideoTracker || activeVideoTracker.id !== videoId || tracker.completed) return;

            const modal = document.getElementById('videoModal');
            if (!modal || modal.classList.contains('hidden')) {
                stopVideoCompletionTracker(true);
                return;
            }

            if (tracker.ytConnected && tracker.duration > 0) {
                if (tracker.playerState === 1 && !document.hidden) {
                    tracker.activeWatchedSeconds += 1;
                }

                const minRequired = Math.max(4, Math.min(tracker.duration * 0.80, tracker.duration - 2.5));
                if ((tracker.playerState === 0 || tracker.currentTime >= tracker.duration - 1.5) && tracker.activeWatchedSeconds >= minRequired) {
                    completeTrackedVideo(tracker);
                }
            } else {
                // Modo respaldo (ej. archivo local file:// sin respuesta de API)
                if (!document.hidden) {
                    tracker.fallbackSeconds += 1;
                }
                const REQUIRED_FALLBACK = 35;
                if (tracker.fallbackSeconds >= REQUIRED_FALLBACK) {
                    completeTrackedVideo(tracker);
                }
            }
        }, 1000);
    }

    function completeTrackedVideo(tracker) {
        if (!tracker || tracker.completed) return;
        tracker.completed = true;
        if (tracker.intervalId) clearInterval(tracker.intervalId);
        if (tracker.handshakeId) clearInterval(tracker.handshakeId);
        if (tracker.msgHandler) window.removeEventListener('message', tracker.msgHandler);

        renderVideoStatusBadge('completed');
        markVideoWatched(tracker.id);
    }

    function stopWebCapsuleCompletionTracker(wasClosedByUser) {
        if (!activeWebTracker) return;
        const tracker = activeWebTracker;
        activeWebTracker = null;
        if (tracker.intervalId) clearInterval(tracker.intervalId);
    }

    function startWebCapsuleCompletionTracker(capsuleId) {
        stopWebCapsuleCompletionTracker(false);

        const statusEl = document.getElementById('oppoWebWatchStatus');
        const alreadyWatched = !!getProgressData().videos[capsuleId];
        if (alreadyWatched) {
            if (statusEl) {
                statusEl.className = 'mt-2.5 text-xs font-extrabold px-4 py-1.5 rounded-full bg-oppogreen text-white flex items-center justify-center gap-1.5 shadow';
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i> <span>&iexcl;Completado!</span>';
            }
            return;
        }

        const REQUIRED_WEB_SECONDS = 30;
        const tracker = {
            id: capsuleId,
            completed: false,
            elapsed: 0,
            intervalId: null
        };
        activeWebTracker = tracker;

        if (statusEl) {
            statusEl.className = 'mt-2.5 text-xs font-semibold px-4 py-1.5 rounded-full bg-white/10 text-gray-200 border border-white/15 flex items-center justify-center gap-1.5';
            statusEl.innerHTML = '<i class="fas fa-info-circle text-oppogreen"></i> <span>Para completar, m&iacute;ralo hasta el final</span>';
        }

        tracker.intervalId = setInterval(function () {
            if (!activeWebTracker || activeWebTracker.id !== capsuleId || tracker.completed) return;
            const modal = document.getElementById('oppoWebCapsuleModal');
            if (!modal || modal.classList.contains('hidden')) {
                stopWebCapsuleCompletionTracker(true);
                return;
            }
            if (!document.hidden) {
                tracker.elapsed += 1;
            }

            if (tracker.elapsed >= REQUIRED_WEB_SECONDS) {
                tracker.completed = true;
                clearInterval(tracker.intervalId);
                if (statusEl) {
                    statusEl.className = 'mt-2.5 text-xs font-extrabold px-4 py-1.5 rounded-full bg-oppogreen text-white flex items-center justify-center gap-1.5 shadow';
                    statusEl.innerHTML = '<i class="fas fa-check-circle"></i> <span>&iexcl;Completado!</span>';
                }
                markVideoWatched(capsuleId);
            }
        }, 1000);
    }

    function openRubricModal(id, type) {
        const modal = document.getElementById('oppoRubricModal');
        if (!modal) {
            if (type === 'web') {
                launchWebCapsuleModal(id);
                startWebCapsuleCompletionTracker(id);
            } else if (typeof rawOpenVideoFn === 'function') {
                rawOpenVideoFn(id);
                startVideoCompletionTracker(id);
            }
            return;
        }

        pendingRubricItem = { id: id, type: type };
        const rubric = getRubricForItem(id);
        const item = CATALOGO_VIDEOS[id] || {};

        const badgeEl = document.getElementById('oppoRubricBadge');
        const titleEl = document.getElementById('oppoRubricTitle');
        const listEl = document.getElementById('oppoRubricList');
        const impactEl = document.getElementById('oppoRubricImpact');
        const confirmTextEl = document.getElementById('oppoRubricConfirmText');
        const extBtn = document.getElementById('oppoRubricExternalBtn');

        if (badgeEl) badgeEl.innerHTML = rubric.badge;
        if (titleEl) titleEl.innerHTML = rubric.titleHtml;
        if (listEl) {
            listEl.innerHTML = (rubric.learnings || []).map(function (point) {
                return '<li class="flex items-start gap-2.5">' +
                    '<i class="fas fa-check-circle text-oppogreen mt-1 shrink-0"></i>' +
                    '<span>' + point + '</span>' +
                '</li>';
            }).join('');
        }
        if (impactEl) impactEl.innerHTML = rubric.impact || '';

        if (confirmTextEl) {
            confirmTextEl.innerHTML = (type === 'web')
                ? '&iexcl;Estoy listo! Explorar C&aacute;psula Interactiva'
                : '&iexcl;Estoy listo! Reproducir Videoc&aacute;psula';
        }

        if (extBtn) {
            if (type === 'web' && item.url) {
                extBtn.href = item.url;
                extBtn.classList.remove('hidden');
                extBtn.classList.add('flex');
            } else {
                extBtn.classList.add('hidden');
                extBtn.classList.remove('flex');
            }
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeRubricModal() {
        const modal = document.getElementById('oppoRubricModal');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    function confirmRubricAndStart() {
        if (!pendingRubricItem) return;
        const target = pendingRubricItem;
        pendingRubricItem = null;
        closeRubricModal();
        trackGA4CourseStart(target.id, target.type);

        if (target.type === 'web') {
            launchWebCapsuleModal(target.id);
            startWebCapsuleCompletionTracker(target.id);
        } else if (typeof rawOpenVideoFn === 'function') {
            rawOpenVideoFn(target.id);
            startVideoCompletionTracker(target.id);
        }
    }

    function markExternalWebStarted() {
        if (!pendingRubricItem) return;
        const target = pendingRubricItem;
        pendingRubricItem = null;
        closeRubricModal();
        trackGA4CourseStart(target.id, 'web');
        launchWebCapsuleModal(target.id);
        startWebCapsuleCompletionTracker(target.id);
    }

    function launchWebCapsuleModal(id) {
        const item = CATALOGO_VIDEOS[id];
        if (!item || !item.url) return;

        const modal = document.getElementById('oppoWebCapsuleModal');
        const iframe = document.getElementById('oppoWebCapsuleIframe');
        const spinner = document.getElementById('oppoWebCapsuleSpinner');
        const titleEl = document.getElementById('oppoWebCapsuleTitle');
        const extLink = document.getElementById('oppoWebCapsuleExtLink');

        if (!modal || !iframe) {
            window.open(item.url, '_blank', 'noopener');
            return;
        }

        const rubric = getRubricForItem(id);
        if (titleEl) titleEl.innerHTML = rubric.titleHtml || escapeHtml(item.title);
        if (extLink) extLink.href = item.url;

        if (spinner) {
            spinner.style.display = 'flex';
            spinner.style.opacity = '1';
        }

        iframe.src = item.url;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    function onWebCapsuleLoad() {
        const iframe = document.getElementById('oppoWebCapsuleIframe');
        const spinner = document.getElementById('oppoWebCapsuleSpinner');
        if (iframe && iframe.src && iframe.src !== 'about:blank') {
            if (spinner) {
                spinner.style.opacity = '0';
                setTimeout(function () { spinner.style.display = 'none'; }, 300);
            }
        }
    }

    function closeWebCapsuleModal() {
        stopWebCapsuleCompletionTracker(true);
        const modal = document.getElementById('oppoWebCapsuleModal');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        const iframe = document.getElementById('oppoWebCapsuleIframe');
        if (iframe) {
            iframe.src = 'about:blank';
        }
        document.body.style.overflow = '';
    }

    function hookOpenVideo() {
        if (typeof window.openVideo === 'function' && !window.openVideo._oppoHooked) {
            rawOpenVideoFn = window.openVideo;
            const wrapped = function (id) {
                openRubricModal(id, 'video');
            };
            wrapped._oppoHooked = true;
            window.openVideo = wrapped;
        }
        if (typeof window.closeModal === 'function' && !window.closeModal._oppoHooked) {
            rawCloseModalFn = window.closeModal;
            const wrappedClose = function () {
                stopVideoCompletionTracker(true);
                rawCloseModalFn();
            };
            wrappedClose._oppoHooked = true;
            window.closeModal = wrappedClose;
        }
        window.openWebCapsule = function (id) {
            openRubricModal(id, 'web');
        };
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeRubricModal();
            const webModal = document.getElementById('oppoWebCapsuleModal');
            if (webModal && !webModal.classList.contains('hidden')) {
                closeWebCapsuleModal();
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        injectProgressUI();
        hookOpenVideo();
        syncGA4UserIdentity(true);
        autoSyncExistingProfileToSheets();
    });

    // Exponer API global para los botones del UI
    window.oppoProgress = {
        openProfileModal: openProfileModal,
        closeProfileModal: closeProfileModal,
        submitProfileForm: submitProfileForm,
        openCertificateModal: openCertificateModal,
        closeCertificateModal: closeCertificateModal,
        togglePrivacyMode: togglePrivacyMode,
        openRubricModal: openRubricModal,
        closeRubricModal: closeRubricModal,
        confirmRubricAndStart: confirmRubricAndStart,
        markExternalWebStarted: markExternalWebStarted,
        closeWebCapsuleModal: closeWebCapsuleModal,
        onWebCapsuleLoad: onWebCapsuleLoad,
        markVideoWatched: markVideoWatched,
        syncGA4UserIdentity: syncGA4UserIdentity,
        setGoogleScriptUrl: function (url) {
            localStorage.setItem('oppo_google_script_url', url);
            showToast('URL de Google Sheets configurada');
        }
    };
})();
