/**
 * Oli - Asistente Inteligente Hibrido del Portal Elite OPPO
 * Combina botones predeterminados de consulta rapida + entrada libre acotada a bases de datos oficiales (0% alucinacion).
 */
(function () {
    'use strict';

    if (window.oliAssistant && window.oliAssistant._initialized) return;

    const ASSET_AVATAR = 'Recursos/ola/oli-avatar.png';
    const DATA_VERSION = '20261121';

    const FOCUS_RATES = {
        RENO_16_5G: { low: 400, high: 550 },
        RENO_16F:   { low: 300, high: 480 },
        A7_PRO:     { low: 250, high: 320 }
    };
    const VOLUME_RATES = {
        FIND:        [300, 500, 800],
        RENO_OTHERS: [100, 200, 300],
        A_HIGH:      [30,  100, 140],
        A_MIDDLE:    [10,   50,  70],
        A_LOW:       [5,    10,  20]
    };
    const FARMER_FOCO_RATES = {
        RENO_16_5G: { base: 80, high: 140 },
        RENO_16F:   { base: 50, high: 120 },
        A7_PRO:     { base: 20, high: 45 }
    };
    const FARMER_FIJAS_RATES = {
        FIND: 180, RENO_OTHERS: 80, A_HIGH: 30, A_MIDDLE: 20, A_LOW: 5
    };
    const HUNTER_RATES = {
        RENO_16_5G:  { low: 100, high: 140 },
        RENO_16F:    { low: 80,  high: 120 },
        A7_PRO:      { low: 25,  high: 45 },
        FIND:        { low: 100, high: 180 },
        RENO_OTHERS: { low: 50,  high: 80 },
        A_HIGH:      { low: 20,  high: 30 },
        A_MIDDLE:    { low: 10,  high: 20 },
        A_LOW:       { low: 5,   high: 5 }
    };

    // Base de Conocimiento Oficial de Modelos (extraida de ctc.html, find-x10.html y curriculum oficial)
    const OLI_MODELS_DB = [
        {
            id: 'find_x10_pro_max',
            aliases: ['find x10 pro max', 'x10 pro max', 'x10promax'],
            name: 'OPPO Find X10 Pro Max',
            serie: 'Serie Find X',
            procesador: 'MediaTek Dimensity 9600 Pro (2 nm)',
            bateria: '8,000 mAh Silicio-Carbono • Carga 80W SUPERVOOC + 50W AIRVOOC inalámbrica',
            camara: 'Triple Cámara Hasselblad de 200 MP (Principal DeepPix 17 EV + Tele 200 MP 3x + Ultra Gran Angular 200 MP 124°) + Sensor True Color de 24 canales + Video 8K Log / HDR',
            resistencia: 'Armour Shield + Certificación IP66 / IP68 / IP69',
            sistema: 'ColorOS 17 con motor LUMO Color & Framing y AI Deepfake Guard',
            pitch: 'Es el tope de gama en fotografía móvil de estudio: 200 MP en sus tres lentes Hasselblad, chip de 2 nm y batería gigante de 8,000 mAh Silicio-Carbono en cuerpo delgado.'
        },
        {
            id: 'find_x10',
            aliases: ['find x10', 'x10'],
            name: 'OPPO Find X10',
            serie: 'Serie Find X',
            procesador: 'MediaTek Dimensity 9600 Pro (2 nm)',
            bateria: '8,000 mAh Silicio-Carbono • Carga 80W SUPERVOOC + 50W AIRVOOC',
            camara: 'Cámara Hasselblad 200 MP + motor LUMO Color & Framing + Pantalla ProXDR',
            resistencia: 'Armour Shield + Certificación IP66 / IP68 / IP69',
            sistema: 'ColorOS 17 con fluidez flagship e inteligencia OPPO AI',
            pitch: 'Combina litografía de 2 nm con batería récord de 8,000 mAh y blindaje IP69 para usuarios que exigen potencia y foto profesional todo el día.'
        },
        {
            id: 'find_x9',
            aliases: ['find x9 ultra', 'find x9 pro', 'find x9', 'x9 ultra', 'x9 pro', 'x9'],
            name: 'OPPO Find X9 Ultra / Pro',
            serie: 'Serie Find X',
            procesador: 'Plataforma Flagship de Gama Alta (consulta etiqueta en tienda para variante)',
            bateria: 'Batería Silicio-Carbono de alta densidad (hasta 7,500 mAh) + 80W/100W SUPERVOOC',
            camara: 'Sistema Hasselblad con Teleobjetivo Periscópico para zoom lejano nítido sin pérdida de detalle',
            resistencia: 'Certificación IP68 / IP69 y materiales premium',
            sistema: 'ColorOS con OPPO AI ilimitada y O+ Connect nativo con iPhone y Mac',
            pitch: 'Duplica la autonomía frente a competidores flagship manteniendo óptica Hasselblad y compatibilidad directa con ecosistemas Apple mediante O+ Connect.'
        },
        {
            id: 'reno16_5g',
            aliases: ['reno 16 5g', 'reno16 5g', 'reno 16 pro', 'reno 16s', 'r16 5g'],
            name: 'OPPO Reno 16 5G',
            serie: 'Serie Reno (Modelo Foco)',
            procesador: 'Qualcomm Snapdragon 7 Series (4 nm) con optimización ColorOS 16',
            bateria: '6,700 mAh + Carga rápida 80W SUPERVOOC (Cargador original INCLUIDO en caja)',
            camara: 'Cuádruple Cámara de 50 MP: Principal OIS + Telefoto 3.5x OIS (2 ejes) + Ultra Gran Angular 50 MP + Selfie 50 MP Ultra Gran Angular (100° FOV)',
            resistencia: 'Chasis Aluminio Aeroespacial + OLED 6.32" 120Hz (PWM 3840Hz) + IP69K (chorros 80°C)',
            sistema: 'ColorOS 16 (6 años de fluidez), 3 años Garantía OPPO Protect + 6 meses Seguro de Pantalla + O+ Connect (iPhone/Mac) + BeaconLink',
            pitch: 'Frente a Honor 600, Xiaomi 17T Pro o Galaxy S26/S26+, ofrece 4 lentes reales de 50 MP con Telefoto 3.5x OIS, 6,700 mAh con cargador 80W incluido y 3 años de garantía oficial.'
        },
        {
            id: 'reno16_f',
            aliases: ['reno 16f', 'reno 16 f', 'reno16f', 'reno16 f', 'reno 16', 'r16f'],
            name: 'OPPO Reno 16 F 5G',
            serie: 'Serie Reno (Modelo Foco)',
            procesador: 'MediaTek Dimensity 7300 (4 nm)',
            bateria: '7,000 mAh Ultra Densidad (hasta 2.88 días) + 80W SUPERVOOC (100% en 62 min, Cargador INCLUIDO)',
            camara: 'Selfie 50 MP Ultra Gran Angular (100° FOV) + Zoom Retrato Pro 3.5x + Collage Remix AI + Pop Cam Retro',
            resistencia: 'Certificación Total IP69K + IP69 + IP68 + IP66 (sumergible y chorros a 80°C) + Splash Touch',
            sistema: '8 GB RAM + 256 GB ROM (expansible MicroSD) • ColorOS 16 con 6 años de fluidez + AI Mind Space + O+ Connect',
            pitch: 'Gana a Galaxy A57, Redmi Note 17 Pro Max, Vivo V80 Lite, Honor 600e/Magic 8 Lite y Moto Edge 70 Swarovski: +2,000 mAh más batería, 80W en caja, Selfie 50 MP 100° y blindaje IP69K real.'
        },
        {
            id: 'reno14',
            aliases: ['reno 14f', 'reno 14 f', 'reno 14 5g', 'reno 14', 'reno14'],
            name: 'OPPO Reno 14 5G / Reno 14 F',
            serie: 'Serie Reno',
            procesador: 'Arquitectura optimizada por Trinity Engine en ColorOS (consulta variante 4G/5G en caja)',
            bateria: 'Carga rápida SUPERVOOC en caja y autonomía extendida en cuerpo ultradelgado',
            camara: 'Experto en Retrato IA, Flash Fiesta para retratos nocturnos tipo estudio y Borrador IA',
            resistencia: 'Diseño ergonómico delgado y ligero con protección avanzada contra agua IP69',
            sistema: 'ColorOS con OPPO Bubble, Barra Inteligente y O+ Connect',
            pitch: 'Ideal para clientes que buscan diseño ultradelgado, retratos nocturnos con Flash Fiesta y funciones creativas listas para redes sociales.'
        },
        {
            id: 'a7_pro',
            aliases: ['a7 pro', 'a7pro', 'a7 pro 5g', 'a7p'],
            name: 'OPPO A7 Pro 5G',
            serie: 'Serie A (Modelo Foco)',
            procesador: 'Procesador 5G + Chip NetworkBoost S1 (+151% señal) + Cámara de Vapor VC de 4,300 mm² (-4.6°C)',
            bateria: '8,000 mAh (hasta 36 días espera y >80% salud tras 6 años) + 45W SUPERVOOC en caja + Carga Reversible para 5 dispositivos',
            camara: 'Selfie 50 MP Ultra Gran Angular (100° FOV: zoom 0.6x, 1x y 2x) + Principal 50 MP Ultra-Luminoso (+70% luz)',
            resistencia: 'Grado Militar MIL-STD-810H (16 pruebas SGS) + IP69K (café/agua a 80°C y 10,000 kPa)',
            sistema: 'Detector Antifraude IA en llamadas/WhatsApp + O+ Connect (iPhone/Mac) + Cargador 45W incluido',
            pitch: 'El tanque todo terreno: 8,000 mAh (+2,800 a +3,000 mAh más que Galaxy A57 o Magic 8 Lite), café a 80°C, caídas grado militar y Selfie de 50 MP 100°.'
        },
        {
            id: 'oppo_a6',
            aliases: ['oppo a6', ' a6', 'a6 normal'],
            name: 'OPPO A6',
            serie: 'Serie A (A High)',
            procesador: 'Qualcomm Snapdragon + Cámara de Vapor VC de 3,900 mm²',
            bateria: '6,550 mAh (hasta 950h en espera) + 45W SUPERVOOC con Cargador y Funda INCLUIDOS + Carga Inversa',
            camara: 'Modo Fotografía Acuática dedicada bajo el agua sin fundas especiales',
            resistencia: 'IP69 (agua caliente a 80°C y alta presión) + IP68 (sumergible) + IP66',
            sistema: 'Pantalla 120 Hz (1,125 nits) + Dual Stereo 300% + 60 meses (5 años) de fluidez certificada',
            pitch: 'Frente a Galaxy A37/A57 y Honor X7e/X7d: trae +1,550 mAh más batería, IP69 sumergible real, Cámara de Vapor VC, cargador de 45W y funda en caja.'
        },
        {
            id: 'oppo_a6k_t',
            aliases: ['a6k', 'a6 k', 'a6t', 'a6 t', 'a6t pro'],
            name: 'OPPO A6K / OPPO A6T',
            serie: 'Serie A (A High / A Middle)',
            procesador: 'Qualcomm Snapdragon 685 optimizado con ColorOS',
            bateria: '6,100 mAh de ultra duración + Carga rápida SUPERVOOC incluida',
            camara: 'Cámara IA optimizada para día a día y redes sociales',
            resistencia: 'Certificación IP64 + Splash Touch y Glove Touch (pantalla funciona con manos mojadas o guantes)',
            sistema: 'ColorOS fluido sin trabas para trabajo diario, apps bancarias y transporte',
            pitch: 'Autonomía de 2 días reales con Snapdragon 685, pantalla usable bajo la lluvia (Splash Touch) y cargador incluido.'
        },
        {
            id: 'oppo_a6c_x',
            aliases: ['a6c', 'a6 c', 'a6x', 'a6 x'],
            name: 'OPPO A6c / OPPO A6x',
            serie: 'Serie A (A Low)',
            procesador: 'Plataforma optimizada para eficiencia energética diaria (consulta variante en caja)',
            bateria: 'Hasta 7,000 mAh en A6c + carga rápida SUPERVOOC y gestión inteligente de energía',
            camara: 'Sistema de cámara versátil para uso cotidiano',
            resistencia: 'Protección IP64 + Splash Touch',
            sistema: 'Fluidez ColorOS garantizada con interfaz limpia y sin anuncios invasivos',
            pitch: 'Máxima autonomía en el rango de entrada: ideal para clientes que priorizan batería duradera y resistencia básica al mejor precio.'
        }
    ];

    const OLI_TOPICS_DB = [
        {
            id: 'mind_space',
            keywords: ['mind space', 'mindspace', 'ai mind', 'mind pilot', 'mindpilot', 'inteligencia artificial', 'oppo ia'],
            title: 'OPPO AI: Mind Space y Mind Pilot',
            body: '<strong>AI Mind Space</strong> funciona como tu segunda memoria inteligente: guarda y organiza automáticamente capturas de pantalla, reservaciones y notas para encontrarlas en segundos.<br><br><strong>Mind Pilot</strong> resume textos largos, asiste según lo que ves en pantalla y organiza pendientes al instante. Además tienes <strong>Traductor IA</strong> de menús/carteles con cámara, <strong>Asistente Financiero AI</strong> y <strong>Borrador IA</strong> para limpiar objetos/personas de tus fotos.'
        },
        {
            id: 'ecosistema',
            keywords: ['o+ connect', 'o+connect', 'oplus', 'airdrop', 'iphone', 'mac', 'beaconlink', 'beacon', 'trinity', 'bubble'],
            title: 'Ecosistema ColorOS: O+ Connect, BeaconLink, Trinity y Bubble',
            body: '• <strong>O+ Connect:</strong> Envía fotos, videos y Livephotos directo entre OPPO y <strong>iPhone/Mac</strong> sin cables ni perder calidad (derrumba la objeción de AirDrop).<br>• <strong>BeaconLink:</strong> Llamadas de voz vía Bluetooth a larga distancia <strong>sin señal celular ni datos</strong> (ideal en sótanos, carreteras o conciertos).<br>• <strong>Trinity Engine:</strong> Optimiza RAM, ROM y CPU para sostener 48 a 72 meses de fluidez.<br>• <strong>OPPO Bubble:</strong> Cápsula dinámica superior para música, grabadora y timer (y además el accesorio físico <em>OPPO Bubble / E-Badge</em> paga <strong>$200 MXN</strong> al promotor en IoT).'
        },
        {
            id: 'reglas_pago',
            keywords: ['regla', 'activacion', 'activación', '10 dias', '10 días', 'datediff', 'corte', 'cuando pagan', 'iot', 'propia'],
            title: 'Reglas de Validación y Pago (Noviembre 2026)',
            body: '• <strong>Ventana de Activación (±10 días):</strong> Una venta cuenta como <strong>Neta Pagada</strong> si tiene <code>Activated Date</code> y su diferencia con la fecha de venta está entre <code>-10</code> y <code>+10</code> días naturales.<br>• <strong>No Activada:</strong> Aparece reportada pero sin fecha de activación aún; si la activas dentro de los 10 días desde su venta, entra automático en el siguiente corte.<br>• <strong>Desfasada (&gt;10 días):</strong> Se activó fuera del rango de ±10 días naturales.<br>• <strong>IoT:</strong> Se paga por tarifa fija adicional (desde $20 Cargador 45W hasta $200 OPPO Bubble / Watch X3) y no altera tu escalón de smartphones.'
        },
        {
            id: 'ventas_cierres',
            keywords: ['objecion', 'objeción', 'caro', 'precio', 'cierre', 'abordaje', 'rapport', 'sondeo', 'consultiva'],
            title: 'Guía Rápida de Abordaje, Objeciones y Cierre',
            body: '• <strong>Primeros 60s (Rapport + Sondeo):</strong> Haz 3 preguntas rápidas antes de cotizar para saber si el cliente valora cámara, batería o resistencia.<br>• <strong>Si dice "Está caro":</strong> Reencuadra en valor diario: incluye cargador 45W/80W y funda en caja, IP69K contra café a 80°C y hasta 6 años de fluidez.<br>• <strong>Cierre Alternativo:</strong> Da 2 opciones positivas (ej. <em>"¿Lo prefiere en Azul o Negro?"</em> / <em>"¿A mensualidades o de contado?"</em>).<br>• <strong>Cierre Presuntivo:</strong> Actúa dando el siguiente paso natural (ej. <em>"¿Le ayudamos a pasar sus fotos con O+ Connect de una vez?"</em>).'
        }
    ];

    let isOpen = false;
    let loadingDepsPromise = null;
    let auditSimId = '';

    function isCurrentUserAuditor() {
        const p = getCurrentProfile();
        if (!p) return false;
        const normId = String(p.idEmpleado || p.id || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const isAllowedAuditorId = (normId === 'R915810' || normId === 'AUDITORELITE');
        if (!isAllowedAuditorId) return false;
        if (window.portalAuth && typeof window.portalAuth.isAuditor === 'function') {
            return window.portalAuth.isAuditor(p);
        }
        return p.role === 'auditor' || p.isAuditor === true;
    }

    function getBaseScript(src) {
        return new Promise(function (resolve) {
            const existing = document.querySelector('script[src*="' + src + '"]');
            if (existing) {
                resolve();
                return;
            }
            const sc = document.createElement('script');
            sc.src = src + '?v=' + DATA_VERSION;
            sc.onload = function () { resolve(); };
            sc.onerror = function () { resolve(); };
            document.head.appendChild(sc);
        });
    }

    function ensureAllOliDataLoaded() {
        const hasCom = !!window.PORTAL_COMISIONES_DATA;
        const hasSup = !!window.PORTAL_SUPERVISORES_DATA;
        const hasImeis = !!window.PORTAL_OLI_IMEIS_BY_PROMOTER;
        if (hasCom && hasSup && hasImeis) return Promise.resolve();
        if (loadingDepsPromise) return loadingDepsPromise;

        const tasks = [];
        if (window.portalAuth && typeof window.portalAuth.ensureComisionesDataLoaded === 'function') {
            tasks.push(window.portalAuth.ensureComisionesDataLoaded());
        } else if (!hasCom) {
            tasks.push(getBaseScript('comisiones-data.js'));
        }
        if (window.portalAuth && typeof window.portalAuth.ensureSupervisoresDataLoaded === 'function') {
            tasks.push(window.portalAuth.ensureSupervisoresDataLoaded());
        } else if (!hasSup) {
            tasks.push(getBaseScript('supervisores-data.js'));
        }
        if (!hasImeis) {
            tasks.push(getBaseScript('oli-imeis-data.js'));
        }
        loadingDepsPromise = Promise.all(tasks).then(function () {
            loadingDepsPromise = null;
        });
        return loadingDepsPromise;
    }

    function esc(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function fmtMXN(n) {
        return '$' + Math.round(Number(n) || 0).toLocaleString('es-MX') + ' MXN';
    }

    function normText(str) {
        return String(str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getCurrentProfile() {
        if (window.portalAuth && typeof window.portalAuth.getProfile === 'function') {
            const p = window.portalAuth.getProfile();
            if (p) return p;
        }
        try {
            return JSON.parse(localStorage.getItem('oppo_promotor_profile_v1') || 'null');
        } catch (e) {
            return null;
        }
    }

    function findPromoterObj(profile) {
        const list = Array.isArray(window.PORTAL_COMISIONES_DATA) ? window.PORTAL_COMISIONES_DATA : [];
        if (!profile || !list.length) return null;
        const pid = String(profile.idEmpleado || profile.id || '').trim().toUpperCase();
        if (window.portalAuth && typeof window.portalAuth.findPromoter === 'function') {
            const found = window.portalAuth.findPromoter(pid, list);
            if (found) return found;
        }
        return list.find(function (p) { return String(p.id).trim().toUpperCase() === pid; }) || null;
    }

    function findSupervisorObj(profile) {
        const supDb = window.PORTAL_SUPERVISORES_DATA;
        if (!profile || !supDb) return null;
        const allSup = [].concat(supDb.farmers || [], supDb.hunters || []);
        const sid = String(profile.idEmpleado || profile.id || '').trim().toUpperCase();
        if (window.portalAuth && typeof window.portalAuth.findSupervisor === 'function') {
            const found = window.portalAuth.findSupervisor(sid, allSup);
            if (found) return found;
        }
        return allSup.find(function (s) { return String(s.id).trim().toUpperCase() === sid; }) || null;
    }

    function getUserContextData() {
        const profile = getCurrentProfile();
        if (!profile) return { role: 'guest', profile: null, imeis: [] };
        if (!isCurrentUserAuditor()) return { role: 'blocked', profile: profile, imeis: [] };

        const byProm = window.PORTAL_OLI_IMEIS_BY_PROMOTER || {};
        const byStore = window.PORTAL_OLI_IMEIS_BY_STORE || {};

        // Si el Auditor eligio simular un ID especifico de promotor o supervisor:
        if (auditSimId) {
            const simProfile = { idEmpleado: auditSimId, id: auditSimId };
            const simSup = findSupervisorObj(simProfile);
            if (simSup) {
                const imeis = [];
                const seen = {};
                (simSup.stores || []).forEach(function (st) {
                    (byStore[String(st.store_id)] || []).forEach(function (rec) {
                        if (!seen[rec.i]) {
                            seen[rec.i] = true;
                            imeis.push(rec);
                        }
                    });
                });
                imeis.sort(function (a, b) { return (b.day - a.day) || (a.i > b.i ? 1 : -1); });
                return { role: simSup.role || 'farmer', profile: profile, supervisor: simSup, imeis: imeis, simulatedName: simSup.nombre, simulatedId: simSup.id };
            }
            const simProm = findPromoterObj(simProfile);
            if (simProm) {
                const normPid = String(simProm.id).trim().toUpperCase();
                return { role: 'elite', profile: profile, promoter: simProm, imeis: byProm[normPid] || [], simulatedName: simProm.nombre, simulatedId: simProm.id };
            }
        }

        const role = profile.role || (profile.isAuditor ? 'auditor' : 'elite');
        if (role === 'farmer' || role === 'hunter') {
            const sup = findSupervisorObj(profile);
            const imeis = [];
            const seen = {};
            if (sup && Array.isArray(sup.stores)) {
                sup.stores.forEach(function (st) {
                    const list = byStore[String(st.store_id)] || [];
                    list.forEach(function (rec) {
                        if (!seen[rec.i]) {
                            seen[rec.i] = true;
                            imeis.push(rec);
                        }
                    });
                });
            }
            imeis.sort(function (a, b) { return (b.day - a.day) || (a.i > b.i ? 1 : -1); });
            return { role: role, profile: profile, supervisor: sup, imeis: imeis };
        }

        if (role === 'auditor') {
            const all = [];
            Object.keys(byProm).forEach(function (k) {
                (byProm[k] || []).forEach(function (r) { all.push(Object.assign({ pid: k }, r)); });
            });
            return { role: 'auditor', profile: profile, imeis: all };
        }

        const prom = findPromoterObj(profile);
        const normPid = prom ? String(prom.id).trim().toUpperCase() : String(profile.idEmpleado || '').trim().toUpperCase();
        const imeis = byProm[normPid] || [];
        return { role: 'elite', profile: profile, promoter: prom, imeis: imeis };
    }

    function computePromoterMoney(prom) {
        if (!prom || !prom.ventas_corte) return null;
        const vc = prom.ventas_corte;
        const focusUnits = (vc.RENO_16_5G || 0) + (vc.RENO_16F || 0) + (vc.A7_PRO || 0);
        const volUnits = (vc.FIND || 0) + (vc.RENO_OTHERS || 0) + (vc.A_HIGH || 0) + (vc.A_MIDDLE || 0) + (vc.A_LOW || 0);
        const totalUnits = focusUnits + volUnits;
        const tierIdx = totalUnits >= 50 ? 2 : (totalUnits >= 31 ? 1 : 0);
        const reachedFocus = (prom.tgt_foco > 0) && (focusUnits >= prom.tgt_foco);
        const reachedGral = (prom.tgt_gral > 0) && (totalUnits >= prom.tgt_gral);

        const r16_5g = (vc.RENO_16_5G || 0) * (reachedFocus ? FOCUS_RATES.RENO_16_5G.high : FOCUS_RATES.RENO_16_5G.low);
        const r16f = (vc.RENO_16F || 0) * (reachedFocus ? FOCUS_RATES.RENO_16F.high : FOCUS_RATES.RENO_16F.low);
        const a7p = (vc.A7_PRO || 0) * (reachedFocus ? FOCUS_RATES.A7_PRO.high : FOCUS_RATES.A7_PRO.low);
        const focusMoney = r16_5g + r16f + a7p;

        const volMoney =
            ((vc.FIND || 0) * VOLUME_RATES.FIND[tierIdx]) +
            ((vc.RENO_OTHERS || 0) * VOLUME_RATES.RENO_OTHERS[tierIdx]) +
            ((vc.A_HIGH || 0) * VOLUME_RATES.A_HIGH[tierIdx]) +
            ((vc.A_MIDDLE || 0) * VOLUME_RATES.A_MIDDLE[tierIdx]) +
            ((vc.A_LOW || 0) * VOLUME_RATES.A_LOW[tierIdx]);

        const bonus = reachedGral ? 2000 : 0;
        const iotMoney = (prom.iot_corte && prom.iot_corte.comision) ? Number(prom.iot_corte.comision) : 0;
        const iotUnits = (prom.iot_corte && prom.iot_corte.unidades) ? Number(prom.iot_corte.unidades) : 0;

        return {
            focusUnits: focusUnits, volUnits: volUnits, totalUnits: totalUnits,
            tierIdx: tierIdx, tierLabel: ['0-30 uds', '31-49 uds', '>=50 uds'][tierIdx],
            reachedFocus: reachedFocus, reachedGral: reachedGral,
            focusMoney: focusMoney, volMoney: volMoney, bonus: bonus,
            iotMoney: iotMoney, iotUnits: iotUnits,
            grandTotal: focusMoney + volMoney + bonus + iotMoney
        };
    }

    function computeSupMoney(sup) {
        if (!sup || !sup.ventas_corte) return null;
        const vc = sup.ventas_corte;
        const focusUnits = (vc.RENO_16_5G || 0) + (vc.RENO_16F || 0) + (vc.A7_PRO || 0);
        const volUnits = (vc.FIND || 0) + (vc.RENO_OTHERS || 0) + (vc.A_HIGH || 0) + (vc.A_MIDDLE || 0) + (vc.A_LOW || 0);
        const totalUnits = focusUnits + volUnits;
        const iotMoney = (sup.iot_corte && sup.iot_corte.comision) ? Number(sup.iot_corte.comision) : 0;
        const iotUnits = (sup.iot_corte && sup.iot_corte.unidades) ? Number(sup.iot_corte.unidades) : 0;

        if (sup.role === 'farmer') {
            const pct = sup.tgt_foco > 0 ? (focusUnits / sup.tgt_foco) * 100 : 0;
            const high = pct >= 95;
            const focusMoney =
                ((vc.RENO_16_5G || 0) * (high ? FARMER_FOCO_RATES.RENO_16_5G.high : FARMER_FOCO_RATES.RENO_16_5G.base)) +
                ((vc.RENO_16F || 0) * (high ? FARMER_FOCO_RATES.RENO_16F.high : FARMER_FOCO_RATES.RENO_16F.base)) +
                ((vc.A7_PRO || 0) * (high ? FARMER_FOCO_RATES.A7_PRO.high : FARMER_FOCO_RATES.A7_PRO.base));
            const otrasMoney =
                ((vc.FIND || 0) * FARMER_FIJAS_RATES.FIND) +
                ((vc.RENO_OTHERS || 0) * FARMER_FIJAS_RATES.RENO_OTHERS) +
                ((vc.A_HIGH || 0) * FARMER_FIJAS_RATES.A_HIGH) +
                ((vc.A_MIDDLE || 0) * FARMER_FIJAS_RATES.A_MIDDLE) +
                ((vc.A_LOW || 0) * FARMER_FIJAS_RATES.A_LOW);
            return {
                role: 'farmer', totalUnits: totalUnits, focusUnits: focusUnits, pct: pct,
                tierLabel: high ? 'Tarifa >=95% Foco' : 'Tarifa Base (<95% Foco)',
                focusMoney: focusMoney, otrasMoney: otrasMoney, iotMoney: iotMoney, iotUnits: iotUnits,
                grandTotal: focusMoney + otrasMoney + iotMoney
            };
        } else {
            const pct = sup.tgt_gral > 0 ? (totalUnits / sup.tgt_gral) * 100 : 0;
            const high = pct >= 100;
            const focusMoney =
                ((vc.RENO_16_5G || 0) * (high ? HUNTER_RATES.RENO_16_5G.high : HUNTER_RATES.RENO_16_5G.low)) +
                ((vc.RENO_16F || 0) * (high ? HUNTER_RATES.RENO_16F.high : HUNTER_RATES.RENO_16F.low)) +
                ((vc.A7_PRO || 0) * (high ? HUNTER_RATES.A7_PRO.high : HUNTER_RATES.A7_PRO.low));
            const otrasMoney =
                ((vc.FIND || 0) * (high ? HUNTER_RATES.FIND.high : HUNTER_RATES.FIND.low)) +
                ((vc.RENO_OTHERS || 0) * (high ? HUNTER_RATES.RENO_OTHERS.high : HUNTER_RATES.RENO_OTHERS.low)) +
                ((vc.A_HIGH || 0) * (high ? HUNTER_RATES.A_HIGH.high : HUNTER_RATES.A_HIGH.low)) +
                ((vc.A_MIDDLE || 0) * (high ? HUNTER_RATES.A_MIDDLE.high : HUNTER_RATES.A_MIDDLE.low)) +
                ((vc.A_LOW || 0) * (high ? HUNTER_RATES.A_LOW.high : HUNTER_RATES.A_LOW.low));
            return {
                role: 'hunter', totalUnits: totalUnits, focusUnits: focusUnits, pct: pct,
                tierLabel: high ? 'Tarifa >=100% Gral' : 'Tarifa Base (<100% Gral)',
                focusMoney: focusMoney, otrasMoney: otrasMoney, iotMoney: iotMoney, iotUnits: iotUnits,
                grandTotal: focusMoney + otrasMoney + iotMoney
            };
        }
    }

    function renderImeiListHtml(list, emptyMsg, statusBadge) {
        if (!list.length) {
            return '<div class="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold">' + esc(emptyMsg) + '</div>';
        }
        const meta = window.PORTAL_OLI_IMEIS_META || { cutoffDay: 19 };
        const maxShow = 25;
        const slice = list.slice(0, maxShow);
        const rows = slice.map(function (r) {
            const daysSince = Math.max(0, (meta.cutoffDay || 19) - (r.day || 0));
            let detailLine = 'Venta: <strong>' + esc(r.f) + '</strong>';
            if (r.st === 'P') {
                const rem = Math.max(0, 10 - daysSince);
                detailLine += ' &bull; <span class="text-amber-700 font-bold">' + (rem > 0 ? 'Quedan ' + rem + 'd p/activar' : 'Urgente activar') + '</span>';
            } else if (r.st === 'N') {
                detailLine += ' &bull; Act: <strong>' + esc(r.a) + '</strong> (' + (r.d >= 0 ? '+' + r.d : r.d) + 'd)';
            } else {
                detailLine += ' &bull; Act: <strong>' + esc(r.a) + '</strong> (<span class="text-rose-600 font-bold">Desfase ' + (r.d >= 0 ? '+' + r.d : r.d) + 'd</span>)';
            }
            const who = r.pn ? ('<div class="text-[10px] text-indigo-700 font-bold truncate"><i class="fas fa-user mr-1"></i>' + esc(r.pn) + ' (' + esc(r.pid) + ')</div>') : '';
            return '<div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1">' +
                '<div class="flex items-center justify-between gap-2">' +
                    '<span class="font-black text-xs text-gray-900 truncate">' + esc(r.m) + '</span>' +
                    statusBadge +
                '</div>' +
                '<div class="flex items-center justify-between gap-2 text-[11px] font-mono text-gray-700 bg-white px-2 py-1 rounded-lg border border-gray-200">' +
                    '<span>IMEI: <strong>' + esc(r.i) + '</strong></span>' +
                    '<button type="button" onclick="window.oliAssistant.copyText(\'' + esc(r.i) + '\')" class="text-[10px] font-sans font-bold text-emerald-600 hover:underline shrink-0">Copiar</button>' +
                '</div>' +
                who +
                '<div class="text-[10px] text-gray-500 flex flex-wrap justify-between gap-1">' +
                    '<span>' + detailLine + '</span>' +
                    '<span class="truncate max-w-[160px]" title="' + esc(r.t) + '">' + esc(r.t) + '</span>' +
                '</div>' +
            '</div>';
        }).join('');

        const extra = list.length > maxShow
            ? '<p class="text-[11px] text-gray-500 text-center pt-1 font-semibold">Mostrando los ' + maxShow + ' m&aacute;s recientes de <strong>' + list.length + '</strong> totales.</p>'
            : '';
        return '<div class="space-y-1.5 max-h-64 overflow-y-auto pr-1">' + rows + '</div>' + extra;
    }

    function buildAnswerForAction(actionId) {
        const ctx = getUserContextData();
        const meta = window.PORTAL_OLI_IMEIS_META || { cutoffDay: 19, cutoffDate: '2026-11-19' };

        if (ctx.role === 'guest') {
            return 'Primero inicia sesi&oacute;n con tu <strong>ID de Empleado</strong> en el portal para consultar tus IMEIs, ventas y comisiones exactas.';
        }

        if (actionId === 'no_activos') {
            if (ctx.role === 'auditor') {
                const pending = ctx.imeis.filter(function (x) { return x.st === 'P'; });
                return '<strong>Modo Auditor (Corte D&iacute;a ' + meta.cutoffDay + '):</strong> Hay <strong>' + pending.length + '</strong> IMEIs pendientes por activar en toda la regi&oacute;n. Pega un IMEI espec&iacute;fico o revisa un promotor.<br><br>' +
                    renderImeiListHtml(pending.slice(0, 15), 'Sin IMEIs pendientes.', '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">No Activado</span>');
            }
            const pending = ctx.imeis.filter(function (x) { return x.st === 'P'; });
            const scope = (ctx.role === 'farmer' || ctx.role === 'hunter') ? 'de tus tiendas' : 'tuyos';
            return '<strong>IMEIs No Activados al Corte (D&iacute;a ' + meta.cutoffDay + '):</strong> Tienes <strong>' + pending.length + '</strong> equipo(s) ' + scope + ' reportados sin fecha de activaci&oacute;n.<br>' +
                '<span class="text-[11px] text-gray-500 block mb-2">Recuerda que deben activarse dentro de los 10 d&iacute;as naturales desde su venta para que comisionen.</span>' +
                renderImeiListHtml(pending, '¡Excelente! Tienes 0 IMEIs pendientes; todas tus ventas reportadas ya tienen activación.', '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">Pendiente</span>');
        }

        if (actionId === 'pagadas') {
            if (ctx.role === 'elite') {
                const money = computePromoterMoney(ctx.promoter);
                const netList = ctx.imeis.filter(function (x) { return x.st === 'N'; });
                if (!money) return 'No encontr&eacute; datos de ventas para tu ID en la base actual.';
                const vc = ctx.promoter.ventas_corte;
                return '<div class="space-y-2">' +
                    '<div class="rounded-2xl bg-gradient-to-r from-gray-900 to-emerald-950 text-white p-3.5">' +
                        '<div class="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">Liquidaci&oacute;n Validada al D&iacute;a ' + meta.cutoffDay + '</div>' +
                        '<div class="text-2xl font-black mt-0.5">' + fmtMXN(money.grandTotal) + '</div>' +
                        '<div class="text-[11px] text-gray-300 mt-1"><strong>' + money.totalUnits + '</strong> smartphones pagados (' + money.tierLabel + ')' + (money.iotUnits ? ' + <strong>' + money.iotUnits + ' IoT</strong> (' + fmtMXN(money.iotMoney) + ')' : '') + '</div>' +
                    '</div>' +
                    '<div class="grid grid-cols-2 gap-1.5 text-[11px]">' +
                        '<div class="bg-gray-50 p-2 rounded-xl border border-gray-200">Foco (R16+A7P): <strong>' + money.focusUnits + ' uds</strong> (' + fmtMXN(money.focusMoney) + ')</div>' +
                        '<div class="bg-gray-50 p-2 rounded-xl border border-gray-200">Volumen: <strong>' + money.volUnits + ' uds</strong> (' + fmtMXN(money.volMoney) + ')</div>' +
                        '<div class="bg-gray-50 p-2 rounded-xl border border-gray-200">Reno 16F/5G: <strong>' + (vc.RENO_16F || 0) + ' / ' + (vc.RENO_16_5G || 0) + '</strong></div>' +
                        '<div class="bg-gray-50 p-2 rounded-xl border border-gray-200">A7 Pro / Bono: <strong>' + (vc.A7_PRO || 0) + ' / ' + (money.bonus ? '+$2,000' : '$0') + '</strong></div>' +
                    '</div>' +
                    '<div class="text-xs font-black text-gray-800 pt-1">Detalle de IMEIs que s&iacute; est&aacute;n pagando (' + netList.length + '):</div>' +
                    renderImeiListHtml(netList, 'Aún no registras ventas netas activadas en este corte.', '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Pagada</span>') +
                '</div>';
            }
            if (ctx.role === 'farmer' || ctx.role === 'hunter') {
                const sm = computeSupMoney(ctx.supervisor);
                const netList = ctx.imeis.filter(function (x) { return x.st === 'N'; });
                if (!sm) return 'No encontr&eacute; datos para tu supervisi&oacute;n.';
                return '<div class="space-y-2">' +
                    '<div class="rounded-2xl bg-gradient-to-r from-gray-900 to-emerald-950 text-white p-3.5">' +
                        '<div class="text-[10px] uppercase tracking-wider text-emerald-300 font-bold">Liquidaci&oacute;n Supervisi&oacute;n al D&iacute;a ' + meta.cutoffDay + '</div>' +
                        '<div class="text-2xl font-black mt-0.5">' + fmtMXN(sm.grandTotal) + '</div>' +
                        '<div class="text-[11px] text-gray-300 mt-1"><strong>' + sm.totalUnits + '</strong> netas (' + sm.tierLabel + ')' + (sm.iotUnits ? ' + <strong>' + sm.iotUnits + ' IoT</strong> (' + fmtMXN(sm.iotMoney) + ')' : '') + '</div>' +
                    '</div>' +
                    '<div class="text-xs font-black text-gray-800 pt-1">IMEIs netos pagados de tu equipo (' + netList.length + '):</div>' +
                    renderImeiListHtml(netList, 'Sin ventas netas activadas aún.', '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">Pagada</span>') +
                '</div>';
            }
            return 'Modo Auditor activo: hay <strong>' + (meta.netas || 0) + '</strong> ventas netas pagadas en todo el corte del D&iacute;a ' + meta.cutoffDay + '.';
        }

        if (actionId === 'desfasadas') {
            const desf = ctx.imeis.filter(function (x) { return x.st === 'D'; });
            return '<strong>IMEIs Desfasados (&gt;&plusmn;10 d&iacute;as naturales):</strong> Se registraron <strong>' + desf.length + '</strong> equipo(s) activados fuera de la ventana de tolerancia de &plusmn;10 d&iacute;as.<br><br>' +
                renderImeiListHtml(desf, '¡Excelente! Tienes 0 IMEIs desfasados; ninguna venta se activó fuera del rango de ±10 días.', '<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">Desfasada</span>');
        }

        if (actionId === 'cuota') {
            if (ctx.role === 'elite' && ctx.promoter) {
                const p = ctx.promoter;
                const money = computePromoterMoney(p);
                const faltanGral = Math.max(0, (p.tgt_gral || 0) - money.totalUnits);
                const faltanFoco = Math.max(0, (p.tgt_foco || 0) - money.focusUnits);
                const pctGral = p.tgt_gral > 0 ? Math.round((money.totalUnits / p.tgt_gral) * 100) : 0;
                const pctFoco = p.tgt_foco > 0 ? Math.round((money.focusUnits / p.tgt_foco) * 100) : 0;
                return '<div class="space-y-2 text-xs">' +
                    '<div class="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">' +
                        '<div class="font-black text-gray-900">Avance vs Metas de Noviembre</div>' +
                        '<div>• <strong>Cuota General:</strong> ' + money.totalUnits + ' / ' + p.tgt_gral + ' uds (<strong>' + pctGral + '%</strong>) — ' + (faltanGral === 0 ? '<span class="text-emerald-700 font-black">¡Meta cumplida (+$2,000 bono)!</span>' : 'Faltan <strong>' + faltanGral + ' uds</strong> para el bono de +$2,000') + '</div>' +
                        '<div>• <strong>Meta Foco (R16 + A7P):</strong> ' + money.focusUnits + ' / ' + p.tgt_foco + ' uds (<strong>' + pctFoco + '%</strong>) — ' + (faltanFoco === 0 ? '<span class="text-emerald-700 font-black">¡Tarifa Acelerada activa!</span>' : 'Faltan <strong>' + faltanFoco + ' uds</strong> para tarifa acelerada ($550/$480/$320)') + '</div>' +
                        '<div>• <strong>Desglose Foco asignado:</strong> Reno 16 (' + p.tgt_reno16 + ') + A7 Pro (' + p.tgt_a7pro + ')</div>' +
                    '</div>' +
                    '<a href="comisiones-noviembre.html" class="inline-flex items-center gap-1.5 text-emerald-600 font-black hover:underline"><i class="fas fa-calculator"></i> Abrir Simulador y Plan de Acci&oacute;n &rarr;</a>' +
                '</div>';
            }
            if ((ctx.role === 'farmer' || ctx.role === 'hunter') && ctx.supervisor) {
                const s = ctx.supervisor;
                const sm = computeSupMoney(s);
                return '<div class="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs">' +
                    '<div class="font-black text-gray-900">Metas de Supervisi&oacute;n (' + esc(s.region) + ')</div>' +
                    '<div>• <strong>Netas General:</strong> ' + sm.totalUnits + ' / ' + s.tgt_gral + ' uds</div>' +
                    '<div>• <strong>Netas Foco (R16 + A7P):</strong> ' + sm.focusUnits + ' / ' + s.tgt_foco + ' uds</div>' +
                    '<div>• <strong>Esquema activo:</strong> ' + esc(sm.tierLabel) + '</div>' +
                '</div>';
            }
            return 'Consulta el <a href="comisiones-noviembre.html" class="text-emerald-600 font-black underline">Tabulador de Comisiones</a> para ver metas detalladas.';
        }

        if (actionId === 'iot') {
            const owner = ctx.role === 'elite' ? ctx.promoter : ctx.supervisor;
            const ic = owner && owner.iot_corte ? owner.iot_corte : { unidades: 0, comision: 0, detalle: [] };
            let detHtml = '';
            if (ic.detalle && ic.detalle.length) {
                detHtml = '<div class="space-y-1 mt-2">' + ic.detalle.map(function (d) {
                    return '<div class="flex justify-between items-center p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-xs">' +
                        '<span class="font-bold text-gray-800">' + esc(d.modelo) + ' x' + d.qty + '</span>' +
                        '<span class="font-black text-indigo-800">' + fmtMXN(d.subtotal) + '</span>' +
                    '</div>';
                }).join('') + '</div>';
            } else {
                detHtml = '<div class="text-xs text-gray-500 mt-1">A&uacute;n no registras ventas IoT en el reporte IoT actual (corte D&iacute;a 17).</div>';
            }
            return '<div class="space-y-2 text-xs">' +
                '<div class="p-3 rounded-2xl bg-indigo-950 text-white">' +
                    '<div class="text-[10px] uppercase text-indigo-300 font-bold">Comisi&oacute;n IoT Registrada</div>' +
                    '<div class="text-xl font-black">' + fmtMXN(ic.comision || 0) + ' <span class="text-xs font-normal text-indigo-200">(' + (ic.unidades || 0) + ' pzas)</span></div>' +
                '</div>' +
                detHtml +
                '<div class="text-[11px] text-gray-500 pt-1">Recuerda: <strong>OPPO Bubble</strong> aparece en el reporte como <code>OPPO E-BADGE VBG06</code> y paga <strong>$200 MXN</strong> al promotor (<strong>$20</strong> Farmer / <strong>$200</strong> Hunter).</div>' +
            '</div>';
        }

        if (actionId === 'modelos_menu') {
            const btns = OLI_MODELS_DB.map(function (m) {
                return '<button type="button" onclick="window.oliAssistant.askModel(\'' + m.id + '\')" class="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-100 text-gray-800 hover:text-emerald-900 text-[11px] font-bold border border-gray-200 transition">' + esc(m.name.replace('OPPO ', '')) + '</button>';
            }).join('');
            return '<div class="text-xs font-bold text-gray-800 mb-2">Elige un modelo para ver su procesador, bater&iacute;a, c&aacute;mara y argumento de venta:</div>' +
                '<div class="flex flex-wrap gap-1.5">' + btns + '</div>';
        }

        if (actionId === 'ctc') {
            return '<div class="space-y-2 text-xs">' +
                '<div class="font-black text-gray-900">Argumentos Ganadores vs Competencia (CTC)</div>' +
                '<div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200"><strong>Reno 16F vs Galaxy A57 / Redmi 17 Pro Max / Honor 600e:</strong> 7,000 mAh (+2,000 mAh más), 80W con cargador en caja, Selfie 50 MP 100° y certificación IP69K (café a 80°C).</div>' +
                '<div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200"><strong>A7 Pro 5G vs Magic 8 Lite / Galaxy A57:</strong> 8,000 mAh (6 años vida útil), Grado Militar MIL-STD-810H (16 pruebas) + IP69K + Chip NetworkBoost S1 (+151% señal).</div>' +
                '<div class="p-2.5 rounded-xl bg-gray-50 border border-gray-200"><strong>OPPO A6 vs Galaxy A37 / Honor X7e:</strong> 6,550 mAh, IP69 sumergible + Foto Acuática, Cámara de Vapor VC 3,900 mm², cargador 45W y funda incluidos.</div>' +
                '<a href="ctc.html" class="inline-flex items-center gap-1.5 text-emerald-600 font-black hover:underline pt-1"><i class="fas fa-bolt"></i> Abrir Comparador CTC Completo &rarr;</a>' +
            '</div>';
        }

        return null;
    }

    function formatModelCard(m, focusAspect) {
        let highlight = '';
        if (focusAspect === 'procesador') {
            highlight = '<div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-bold mb-2"><i class="fas fa-microchip text-emerald-600 mr-1"></i> Procesador: ' + esc(m.procesador) + '</div>';
        } else if (focusAspect === 'bateria') {
            highlight = '<div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-bold mb-2"><i class="fas fa-battery-full text-emerald-600 mr-1"></i> Bater&iacute;a y Carga: ' + esc(m.bateria) + '</div>';
        } else if (focusAspect === 'camara') {
            highlight = '<div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-bold mb-2"><i class="fas fa-camera text-emerald-600 mr-1"></i> C&aacute;mara: ' + esc(m.camara) + '</div>';
        } else if (focusAspect === 'resistencia') {
            highlight = '<div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 font-bold mb-2"><i class="fas fa-shield-alt text-emerald-600 mr-1"></i> Resistencia: ' + esc(m.resistencia) + '</div>';
        }
        return '<div class="space-y-1.5 text-xs">' +
            '<div class="flex items-center justify-between gap-2 pb-1 border-b border-gray-200">' +
                '<strong class="text-sm text-gray-900">' + esc(m.name) + '</strong>' +
                '<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">' + esc(m.serie) + '</span>' +
            '</div>' +
            highlight +
            '<div><strong><i class="fas fa-microchip text-gray-400 mr-1"></i>Procesador:</strong> ' + esc(m.procesador) + '</div>' +
            '<div><strong><i class="fas fa-battery-three-quarters text-gray-400 mr-1"></i>Bater&iacute;a:</strong> ' + esc(m.bateria) + '</div>' +
            '<div><strong><i class="fas fa-camera text-gray-400 mr-1"></i>C&aacute;maras:</strong> ' + esc(m.camara) + '</div>' +
            '<div><strong><i class="fas fa-tint text-gray-400 mr-1"></i>Blindaje:</strong> ' + esc(m.resistencia) + '</div>' +
            '<div><strong><i class="fas fa-cog text-gray-400 mr-1"></i>Sistema:</strong> ' + esc(m.sistema) + '</div>' +
            '<div class="p-2.5 rounded-xl bg-gray-900 text-white text-[11px] mt-1.5"><span class="text-emerald-300 font-black">Argumento de Venta:</span> ' + esc(m.pitch) + '</div>' +
        '</div>';
    }

    function answerFreeQuery(rawText) {
        const q = normText(rawText);
        if (!q) return null;

        // 1. Busqueda por IMEI (4+ digitos consecutivos)
        const digitsMatch = q.match(/\d{4,16}/);
        if (digitsMatch && (q.indexOf('imei') !== -1 || q.indexOf('email') !== -1 || digitsMatch[0].length >= 6)) {
            const needle = digitsMatch[0];
            const ctx = getUserContextData();
            let pool = ctx.imeis || [];
            let scopeMsg = '';
            if (pool.length === 0 && (ctx.role === 'auditor' || ctx.role === 'farmer' || ctx.role === 'hunter')) {
                const byProm = window.PORTAL_OLI_IMEIS_BY_PROMOTER || {};
                pool = [];
                Object.keys(byProm).forEach(function (k) {
                    (byProm[k] || []).forEach(function (r) { pool.push(Object.assign({ pid: k }, r)); });
                });
                scopeMsg = ' en el padrón';
            }
            const hits = pool.filter(function (r) { return String(r.i).indexOf(needle) !== -1; });
            if (hits.length > 0) {
                return 'Encontré <strong>' + hits.length + '</strong> coincidencia(s) para <code>' + esc(needle) + '</code>' + scopeMsg + ':<br><br>' +
                    renderImeiListHtml(hits, '', '<span class="px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 text-[10px] font-black">Resultado</span>');
            }
            return 'No encontr&eacute; ningún IMEI que contenga <code>' + esc(needle) + '</code> en tus ventas al corte del D&iacute;a ' + ((window.PORTAL_OLI_IMEIS_META && window.PORTAL_OLI_IMEIS_META.cutoffDay) || 19) + '.';
        }

        // 2. Consultas sobre IMEIs / Ventas / Pagos / Cuotas (Nota: usuarios de voz a veces dicen "email" por "IMEI")
        const mentionsImeiWord = q.indexOf('imei') !== -1 || q.indexOf('email') !== -1 || q.indexOf('serie') !== -1;
        if ((mentionsImeiWord || q.indexOf('venta') !== -1 || q.indexOf('equipo') !== -1) &&
            (q.indexOf('no activ') !== -1 || q.indexOf('pendiente') !== -1 || q.indexOf('sin activar') !== -1 || q.indexOf('falt') !== -1)) {
            return buildAnswerForAction('no_activos');
        }
        if (q.indexOf('desfasad') !== -1 || q.indexOf('fuera de rango') !== -1) {
            return buildAnswerForAction('desfasadas');
        }
        if ((q.indexOf('pagan') !== -1 || q.indexOf('pagando') !== -1 || q.indexOf('pagada') !== -1 || q.indexOf('comision') !== -1 || q.indexOf('cuanto llevo') !== -1 || q.indexOf('ganando') !== -1 || q.indexOf('neta') !== -1) && q.indexOf('iot') === -1 && q.indexOf('bubble') === -1) {
            return buildAnswerForAction('pagadas');
        }
        if (q.indexOf('cuota') !== -1 || q.indexOf('meta') !== -1 || q.indexOf('target') !== -1 || q.indexOf('bono') !== -1) {
            return buildAnswerForAction('cuota');
        }
        if (q.indexOf('iot') !== -1 || q.indexOf('bubble') !== -1 || q.indexOf('e-badge') !== -1 || q.indexOf('watch') !== -1 || q.indexOf('enco') !== -1 || q.indexOf('pad ') !== -1) {
            return buildAnswerForAction('iot');
        }
        if (mentionsImeiWord) {
            return buildAnswerForAction('no_activos');
        }

        // 3. Especificaciones tecnicas de modelos
        let aspect = null;
        if (q.indexOf('procesador') !== -1 || q.indexOf('chip') !== -1 || q.indexOf('snapdragon') !== -1 || q.indexOf('dimensity') !== -1 || q.indexOf('mediatek') !== -1) aspect = 'procesador';
        else if (q.indexOf('bateria') !== -1 || q.indexOf('mah') !== -1 || q.indexOf('carga') !== -1 || q.indexOf('supervooc') !== -1) aspect = 'bateria';
        else if (q.indexOf('camara') !== -1 || q.indexOf('mp') !== -1 || q.indexOf('selfie') !== -1 || q.indexOf('zoom') !== -1 || q.indexOf('telefoto') !== -1) aspect = 'camara';
        else if (q.indexOf('agua') !== -1 || q.indexOf('cafe') !== -1 || q.indexOf('ip69') !== -1 || q.indexOf('militar') !== -1 || q.indexOf('resiste') !== -1) aspect = 'resistencia';

        for (let i = 0; i < OLI_MODELS_DB.length; i++) {
            const m = OLI_MODELS_DB[i];
            for (let j = 0; j < m.aliases.length; j++) {
                if (q.indexOf(m.aliases[j]) !== -1) {
                    return formatModelCard(m, aspect);
                }
            }
        }
        if (q.indexOf('procesador') !== -1 || q.indexOf('ficha') !== -1 || q.indexOf('ram') !== -1 || q.indexOf('especificacion') !== -1) {
            return buildAnswerForAction('modelos_menu');
        }

        // 4. Competencia / CTC
        if (q.indexOf('competencia') !== -1 || q.indexOf('ctc') !== -1 || q.indexOf('samsung') !== -1 || q.indexOf('honor') !== -1 || q.indexOf('xiaomi') !== -1 || q.indexOf('redmi') !== -1 || q.indexOf('motorola') !== -1 || q.indexOf('vivo') !== -1) {
            return buildAnswerForAction('ctc');
        }

        // 5. Temas de capacitacion y reglas
        for (let k = 0; k < OLI_TOPICS_DB.length; k++) {
            const tp = OLI_TOPICS_DB[k];
            for (let w = 0; w < tp.keywords.length; w++) {
                if (q.indexOf(tp.keywords[w]) !== -1) {
                    return '<div class="space-y-1.5 text-xs"><div class="font-black text-gray-900">' + tp.title + '</div><div class="leading-relaxed text-gray-700">' + tp.body + '</div></div>';
                }
            }
        }

        // 6. Guardrail estrictamente acotado (0% alucinacion)
        return '<div class="space-y-2 text-xs">' +
            '<div>Para evitar inventar datos, solo respondo con informaci&oacute;n verificada de las bases del <strong>Portal Elite</strong> (reportes de Mariana, tabulador, CTC y fichas oficiales).</div>' +
            '<div class="font-bold text-gray-700">Prueba tocar uno de los botones r&aacute;pidos o escr&iacute;beme algo como:</div>' +
            '<ul class="list-disc pl-4 text-gray-600 space-y-0.5">' +
                '<li>&laquo;&iquest;Qu&eacute; IMEIs no tengo activos?&raquo;</li>' +
                '<li>&laquo;&iquest;Qu&eacute; ventas s&iacute; me est&aacute;n pagando?&raquo;</li>' +
                '<li>&laquo;&iquest;Qu&eacute; procesador tiene el Reno 16F?&raquo;</li>' +
                '<li>O pega los &uacute;ltimos d&iacute;gitos de un <strong>IMEI</strong>.</li>' +
            '</ul>' +
        '</div>';
    }

    function appendMessage(sender, htmlContent) {
        const feed = document.getElementById('oliChatMessages');
        if (!feed) return;
        const wrap = document.createElement('div');
        if (sender === 'user') {
            wrap.className = 'flex justify-end';
            wrap.innerHTML = '<div class="max-w-[85%] rounded-2xl rounded-br-sm bg-gray-900 text-white px-3.5 py-2 text-xs sm:text-sm font-semibold shadow-sm">' + esc(htmlContent) + '</div>';
        } else {
            wrap.className = 'flex items-start gap-2';
            wrap.innerHTML =
                '<img src="' + ASSET_AVATAR + '" alt="Oli" class="w-8 h-8 rounded-full object-contain bg-emerald-50 border border-emerald-600/40 shrink-0 mt-0.5">' +
                '<div class="flex-1 min-w-0 rounded-2xl rounded-tl-sm bg-white border border-gray-200 px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 shadow-sm leading-relaxed">' + htmlContent + '</div>';
        }
        feed.appendChild(wrap);
        feed.scrollTop = feed.scrollHeight;
    }

    function renderWelcome() {
        const feed = document.getElementById('oliChatMessages');
        if (!feed) return;
        feed.innerHTML = '';
        const ctx = getUserContextData();
        const meta = window.PORTAL_OLI_IMEIS_META || { cutoffDay: 19 };
        let greet = '&iexcl;Hola! Soy <strong>Oli</strong> (Modo Prueba Auditor).';
        if (ctx.simulatedName) {
            greet = '<strong>Simulando vista de:</strong> ' + esc(ctx.simulatedName) + ' (<code>' + esc(ctx.simulatedId) + '</code> &bull; ' + esc(ctx.role.toUpperCase()) + ').';
            if (ctx.role === 'elite') {
                const pendingCount = (ctx.imeis || []).filter(function (x) { return x.st === 'P'; }).length;
                const netCount = (ctx.imeis || []).filter(function (x) { return x.st === 'N'; }).length;
                greet += ' Al D&iacute;a ' + meta.cutoffDay + ': <strong>' + netCount + ' ventas netas</strong> y <strong>' + pendingCount + ' IMEI(s) sin activar</strong>.';
            }
        } else if (ctx.profile && ctx.profile.nombre) {
            greet = '&iexcl;Hola, <strong>' + esc(ctx.profile.nombre) + '</strong>! Est&aacute;s en <strong>Modo Prueba Auditor</strong> (exclusivo para tu usuario; oculto a promotores y supervisores).';
            greet += '<br><span class="text-[11px] text-emerald-800 font-semibold">Arriba puedes escribir cualquier ID (ej. <code>MR914460</code> o un Elite) para probar exactamente qu&eacute; ve ese usuario, o consultar todo el padr&oacute;n (' + (meta.totalImeis || 0) + ' IMEIs).</span>';
        }
        appendMessage('oli', greet + '<br><span class="text-[11px] text-gray-500">Toca un bot&oacute;n r&aacute;pido o escr&iacute;beme tu duda:</span>');
    }

    function runQuickAction(actionId, labelText) {
        if (labelText) appendMessage('user', labelText);
        ensureAllOliDataLoaded().then(function () {
            const ans = buildAnswerForAction(actionId);
            appendMessage('oli', ans || 'No hay datos disponibles para esta consulta.');
        });
    }

    function askModel(modelId) {
        const m = OLI_MODELS_DB.find(function (x) { return x.id === modelId; });
        if (!m) return;
        appendMessage('user', 'Ficha y procesador de ' + m.name);
        appendMessage('oli', formatModelCard(m, 'procesador'));
    }

    function handleUserSubmit(e) {
        if (e) e.preventDefault();
        const inp = document.getElementById('oliChatInput');
        if (!inp) return;
        const txt = String(inp.value || '').trim();
        if (!txt) return;
        inp.value = '';
        appendMessage('user', txt);
        ensureAllOliDataLoaded().then(function () {
            const ans = answerFreeQuery(txt);
            appendMessage('oli', ans);
        });
    }

    function populateAuditRoster() {
        const dl = document.getElementById('oliAuditorRosterList');
        if (!dl || dl.children.length > 0) return;
        const supDb = window.PORTAL_SUPERVISORES_DATA;
        const sups = supDb ? [].concat(supDb.farmers || [], supDb.hunters || []) : [];
        const proms = Array.isArray(window.PORTAL_COMISIONES_DATA) ? window.PORTAL_COMISIONES_DATA : [];
        let html = '';
        sups.forEach(function (s) {
            html += '<option value="' + esc(s.id) + '">' + esc(s.nombre) + ' (' + esc((s.role || '').toUpperCase()) + ')</option>';
        });
        proms.forEach(function (p) {
            html += '<option value="' + esc(p.id) + '">' + esc(p.nombre) + ' (' + esc(p.cadena) + ')</option>';
        });
        dl.innerHTML = html;
    }

    function applyAuditSim(e) {
        if (e) e.preventDefault();
        const inp = document.getElementById('oliAuditorSimInput');
        if (!inp) return;
        const val = String(inp.value || '').trim().toUpperCase();
        auditSimId = val;
        refreshUserSubtitle();
        ensureAllOliDataLoaded().then(function () {
            populateAuditRoster();
            renderWelcome();
        });
    }

    function clearAuditSim() {
        auditSimId = '';
        const inp = document.getElementById('oliAuditorSimInput');
        if (inp) inp.value = '';
        refreshUserSubtitle();
        ensureAllOliDataLoaded().then(renderWelcome);
    }

    function openChat() {
        if (!isCurrentUserAuditor()) return;
        const panel = document.getElementById('oliChatPanel');
        if (!panel) return;
        isOpen = true;
        panel.classList.remove('hidden');
        panel.classList.add('flex');
        ensureAllOliDataLoaded().then(function () {
            populateAuditRoster();
            const feed = document.getElementById('oliChatMessages');
            if (feed && feed.children.length === 0) renderWelcome();
        });
        setTimeout(function () {
            const inp = document.getElementById('oliChatInput');
            if (inp) inp.focus();
        }, 80);
    }

    function closeChat() {
        const panel = document.getElementById('oliChatPanel');
        if (!panel) return;
        isOpen = false;
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    }

    function toggleChat() {
        if (!isCurrentUserAuditor()) return;
        if (isOpen) closeChat();
        else openChat();
    }

    function resetChat() {
        ensureAllOliDataLoaded().then(renderWelcome);
    }

    function copyText(val) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(val);
        }
    }

    function injectOliUI() {
        const existing = document.getElementById('oliFloatingWidget');
        if (!isCurrentUserAuditor()) {
            if (existing) existing.style.display = 'none';
            closeChat();
            return;
        }
        if (existing) {
            existing.style.display = '';
            refreshUserSubtitle();
            return;
        }
        const wrap = document.createElement('div');
        wrap.id = 'oliFloatingWidget';
        wrap.innerHTML =
            '<!-- BOTON FLOTANTE DE OLI (SOLO AUDITOR) -->' +
            '<button id="oliLauncherBtn" type="button" onclick="window.oliAssistant.toggleChat()" title="Preg&uacute;ntale a Oli (Modo Prueba Auditor)" class="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[130] group flex items-center gap-2.5 bg-gray-900 hover:bg-black text-white pl-2 pr-4 py-2 rounded-full shadow-2xl border-2 border-emerald-500/70 transition-all hover:scale-105">' +
                '<div class="relative w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-0.5 shrink-0">' +
                    '<img src="' + ASSET_AVATAR + '" alt="Oli" class="w-full h-full rounded-full object-contain bg-white">' +
                    '<span class="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-amber-400 border-2 border-gray-900 animate-pulse"></span>' +
                '</div>' +
                '<div class="text-left leading-tight">' +
                    '<div class="text-xs font-black text-emerald-300">Oli (Auditor)</div>' +
                    '<div class="text-[10px] text-amber-300 font-semibold">Modo Prueba Quir&uacute;rgica</div>' +
                '</div>' +
            '</button>' +

            '<!-- VENTANA DE CHAT HIBRIDO DE OLI -->' +
            '<div id="oliChatPanel" class="fixed bottom-20 right-3 left-3 sm:left-auto sm:right-6 sm:w-[420px] h-[75vh] max-h-[650px] z-[131] hidden flex-col bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">' +
                '<!-- Header -->' +
                '<div class="bg-gradient-to-r from-gray-900 via-emerald-950 to-black text-white px-4 py-3 flex items-center justify-between gap-2 shrink-0">' +
                    '<div class="flex items-center gap-2.5 min-w-0">' +
                        '<img src="' + ASSET_AVATAR + '" alt="Oli" class="w-9 h-9 rounded-full object-contain bg-white p-0.5 border border-emerald-400 shrink-0">' +
                        '<div class="min-w-0">' +
                            '<div class="text-sm font-black leading-tight flex items-center gap-1.5"><span>Oli</span> <span class="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">Solo Auditor</span></div>' +
                            '<div id="oliUserSubtitle" class="text-[10px] text-gray-300 truncate">Modo Prueba Auditor</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center gap-1 shrink-0">' +
                        '<button type="button" onclick="window.oliAssistant.resetChat()" title="Reiniciar chat" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs flex items-center justify-center transition"><i class="fas fa-redo"></i></button>' +
                        '<button type="button" onclick="window.oliAssistant.closeChat()" title="Cerrar" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm flex items-center justify-center transition"><i class="fas fa-times"></i></button>' +
                    '</div>' +
                '</div>' +

                '<!-- Selector de Prueba por ID (Exclusivo Auditor) -->' +
                '<form onsubmit="window.oliAssistant.applyAuditSim(event)" class="bg-amber-50 border-b border-amber-200 px-3 py-1.5 flex items-center gap-1.5 shrink-0">' +
                    '<i class="fas fa-user-secret text-amber-700 text-xs shrink-0"></i>' +
                    '<input id="oliAuditorSimInput" list="oliAuditorRosterList" type="text" autocomplete="off" placeholder="Simular ID (ej. MR918773 o MR914460)" class="flex-1 min-w-0 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-[11px] font-bold text-gray-800 outline-none uppercase">' +
                    '<datalist id="oliAuditorRosterList"></datalist>' +
                    '<button type="submit" class="px-2 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black shrink-0">Probar</button>' +
                    '<button type="button" onclick="window.oliAssistant.clearAuditSim()" class="px-2 py-1 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">Global</button>' +
                '</form>' +

                '<!-- Chips Predeterminados -->' +
                '<div class="bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto shrink-0">' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'no_activos\', \'¿Qué IMEIs no tengo activos?\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-black transition"><i class="fas fa-exclamation-circle mr-1"></i>IMEIs no activos</button>' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'pagadas\', \'¿Qué ventas sí me están pagando?\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-black transition"><i class="fas fa-money-bill-wave mr-1"></i>Ventas pagadas</button>' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'desfasadas\', \'¿Tengo IMEIs desfasados?\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 text-[11px] font-black transition"><i class="fas fa-clock mr-1"></i>Desfasados</button>' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'cuota\', \'¿Cuánto me falta para mi cuota y bono?\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-900 text-[11px] font-black transition"><i class="fas fa-bullseye mr-1"></i>Cuota y bono</button>' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'modelos_menu\', \'Procesadores y fichas de modelos\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-900 text-[11px] font-black transition"><i class="fas fa-mobile-alt mr-1"></i>Modelos/CPU</button>' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'ctc\', \'Argumentos contra competencia\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-[11px] font-black transition"><i class="fas fa-shield-alt mr-1"></i>vs Competencia</button>' +
                    '<button type="button" onclick="window.oliAssistant.runQuickAction(\'iot\', \'Mi comisión IoT / OPPO Bubble\')" class="shrink-0 px-2.5 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 text-[11px] font-black transition"><i class="fas fa-headphones mr-1"></i>IoT / Bubble</button>' +
                '</div>' +

                '<!-- Mensajes -->' +
                '<div id="oliChatMessages" class="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-100/70"></div>' +

                '<!-- Entrada Libre Acotada -->' +
                '<form onsubmit="window.oliAssistant.handleUserSubmit(event)" class="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0">' +
                    '<input id="oliChatInput" type="text" autocomplete="off" placeholder="Pregunta o pega tu IMEI (ej. procesador Reno 16F)..." class="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-gray-100 border border-gray-200 focus:border-emerald-600 focus:bg-white outline-none text-xs sm:text-sm text-gray-900 font-medium">' +
                    '<button type="submit" class="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow transition shrink-0"><i class="fas fa-paper-plane text-sm"></i></button>' +
                '</form>' +
            '</div>';

        document.body.appendChild(wrap);
        refreshUserSubtitle();
    }

    function refreshUserSubtitle() {
        const sub = document.getElementById('oliUserSubtitle');
        if (!sub) return;
        const p = getCurrentProfile();
        if (auditSimId) {
            sub.textContent = 'Auditor simulando: ' + auditSimId;
        } else if (p && p.nombre) {
            sub.textContent = p.nombre + ' (' + (p.idEmpleado || p.id || '') + ')';
        } else {
            sub.textContent = 'Modo Prueba Auditor';
        }
    }

    function refreshUser() {
        injectOliUI();
        refreshUserSubtitle();
        const feed = document.getElementById('oliChatMessages');
        if (feed && feed.children.length > 0 && isOpen && isCurrentUserAuditor()) {
            renderWelcome();
        }
    }

    function init() {
        injectOliUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('portal-auth-ready', function () {
        refreshUser();
    });

    window.oliAssistant = {
        _initialized: true,
        openChat: openChat,
        closeChat: closeChat,
        toggleChat: toggleChat,
        resetChat: resetChat,
        runQuickAction: runQuickAction,
        askModel: askModel,
        handleUserSubmit: handleUserSubmit,
        applyAuditSim: applyAuditSim,
        clearAuditSim: clearAuditSim,
        refreshUser: refreshUser,
        copyText: copyText
    };
})();
