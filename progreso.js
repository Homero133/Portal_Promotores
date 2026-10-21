/**
 * Sistema de Registro de Usuarios, Barra de Progreso, Gamificacion y Sincronizacion con Google Sheets
 * Portal de Promotores OPPO
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
    // 2. CATALOGO OFICIAL DE RECURSOS DE CAPACITACION (41 VIDEOS + 12 FICHAS)
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
        // Tecnologia y Ecosistema (2)
        'B7oOMGf5IVI': { page: 'tecnologia.html', module: 'Ecosistema', title: 'Vende OPPO Bubble' },
        'X8rAR_8X9Gs': { page: 'tecnologia.html', module: 'Ecosistema', title: 'Llamadas BeaconLink' },
        // Ventas (10)
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
        // Capsulas (2)
        'wuge6mbhoqA': { page: 'capsulas.html', module: 'Capsulas', title: 'Domina el Efecto WOW' },
        '4J_a1p5ZGNY': { page: 'capsulas.html', module: 'Capsulas', title: 'Capacitacion OPPO Bubble' },
        // Lanzamiento A7 Pro 5G (5)
        'eMzoj1D8BuE': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Resistencia Grado Militar' },
        'yIsJYE4ISNk': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Carga Reversible (5 Dispositivos)' },
        'cImwExhU0E8': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Certificacion IP69K (Cafe a 80 grados)' },
        'dtBWua0FQYI': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Prueba de Caida Extrema' },
        'ppXGDoyd6io': { page: 'a7-pro-5g.html', module: 'A7 Pro 5G', title: 'Rompiendo Dulces (Resistencia)' }
    };

    const TOTAL_VIDEOS = Object.keys(CATALOGO_VIDEOS).length; // 41
    const TOTAL_DOWNLOADS = 12;

    const STORAGE_USER_KEY = 'oppo_promotor_profile_v1';
    const STORAGE_PROGRESS_KEY = 'oppo_promotor_progress_v1';

    // =========================================================================
    // 3. GESTION DE ESTADO LOCAL (LOCALSTORAGE)
    // =========================================================================
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
        const moduleIds = Object.keys(CATALOGO_VIDEOS).filter(id => CATALOGO_VIDEOS[id].page === pageName);
        if (moduleIds.length === 0) return null;
        const watchedInModule = moduleIds.filter(id => progress.videos[id]).length;
        const pct = Math.round((watchedInModule / moduleIds.length) * 100);
        return {
            watched: watchedInModule,
            total: moduleIds.length,
            percentage: pct,
            moduleName: CATALOGO_VIDEOS[moduleIds[0]].module
        };
    }

    // =========================================================================
    // 4.ENVIO A GOOGLE SHEETS Y GOOGLE ANALYTICS (OPCION 2)
    // =========================================================================
    function syncToGoogleSheets(tipoEvento, modulo, detalleRecurso) {
        const user = getUserProfile() || {
            nombre: 'Sin Registrar',
            idEmpleado: '-',
            cadena: '-',
            ciudad: '-'
        };
        const stats = getStats();

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

        // Enviar tambien a Google Analytics 4 si esta activo
        if (typeof window.gtag === 'function') {
            try {
                window.gtag('event', 'progreso_capacitacion', {
                    event_category: modulo,
                    event_label: tipoEvento + ': ' + detalleRecurso,
                    value: stats.percentage,
                    promotor_cadena: user.cadena
                });
            } catch (e) {}
        }

        const scriptUrl = getGoogleScriptUrl();
        if (!scriptUrl) {
            return;
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
                syncToGoogleSheets('Capacitacion 100% Completada', 'Academia OPPO', 'Certificado Desbloqueado (' + stats.TOTAL_VIDEOS + ' videos)');
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

    function injectProgressUI() {
        const page = getCurrentPageName();
        if (page === 'index.html') {
            injectHomeDashboard();
            updateHomeModuleBadges();
        } else {
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
                '<div class="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-6 text-white shadow-xl border border-oppogreen/30 relative overflow-hidden">' +
                    '<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">' +
                        '<div class="flex items-center gap-4">' +
                            '<div class="w-14 h-14 rounded-2xl bg-oppogreen/20 border border-oppogreen/40 flex items-center justify-center text-oppogreen text-2xl shrink-0">' +
                                '<i class="fas fa-user-check"></i>' +
                            '</div>' +
                            '<div>' +
                                '<span class="inline-block text-[11px] font-bold uppercase tracking-wider bg-oppogreen text-white px-2.5 py-0.5 rounded-full mb-1">Academia OPPO Pro</span>' +
                                '<h3 class="text-xl font-black">Reg&iacute;strate para guardar tu progreso</h3>' +
                                '<p class="text-gray-300 text-xs sm:text-sm">Lleva el control de tus videos vistos y desbloquea tu Certificado Digital.</p>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="window.oppoProgress.openProfileModal()" class="w-full sm:w-auto bg-oppogreen hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm shrink-0">' +
                            '<i class="fas fa-id-badge mr-2"></i> Comenzar Registro' +
                        '</button>' +
                    '</div>' +
                    '<div class="mt-5 pt-4 border-t border-white/10">' +
                        '<div class="flex justify-between text-xs text-gray-300 mb-1.5">' +
                            '<span>Tu avance actual en este dispositivo</span>' +
                            '<span class="font-bold text-oppogreen">' + stats.watchedCount + ' de ' + stats.TOTAL_VIDEOS + ' videos (' + stats.percentage + '%)</span>' +
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
                                '<span class="text-xs font-bold text-white bg-oppogreen/30 border border-oppogreen/50 px-2.5 py-0.5 rounded-full">' +
                                    '<i class="fas fa-id-card mr-1 text-oppogreen"></i> ID: ' + escapeHtml(user.idEmpleado) +
                                '</span>' +
                                '<span class="text-xs text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-full">' +
                                    '<i class="fas fa-store mr-1 text-oppogreen"></i> ' + escapeHtml(user.cadena) +
                                '</span>' +
                            '</div>' +
                            '<h3 class="text-xl font-black leading-tight">' + escapeHtml(user.nombre) + '</h3>' +
                            '<p class="text-xs text-gray-400">' + escapeHtml(user.ciudad) + (user.telefono ? ' &bull; Tel: ' + escapeHtml(user.telefono) : '') + '</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center gap-2 self-start md:self-center">' +
                        '<button onclick="window.oppoProgress.openCertificateModal()" class="bg-oppogreen hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow transition flex items-center gap-1.5">' +
                            '<i class="fas fa-award"></i> <span>Mi Avance / Certificado</span>' +
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
                            '<span class="text-gray-300"><strong class="text-white">' + stats.watchedCount + '</strong>/' + stats.TOTAL_VIDEOS + ' videos</span>' +
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
            if (!href || href === 'index.html' || href === 'ola.html') return;

            const modStats = getModuleStats(href);
            if (!modStats) return;

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
                badge.innerHTML = '<i class="fas fa-play-circle mr-1"></i> En curso (' + modStats.watched + '/' + modStats.total + ' videos)';
            } else {
                badge.className = 'oppo-mod-badge mt-2 inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-200/70 text-gray-600';
                badge.innerHTML = '<i class="far fa-circle mr-1"></i> ' + modStats.total + ' videos';
            }
        });
    }

    function injectInternalPageBar(pageName) {
        if (pageName === 'ola.html') return;
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
        const userLabel = user ? (escapeHtml(user.nombre.split(' ')[0]) + ' (ID: ' + escapeHtml(user.idEmpleado) + ')') : 'Registrarme';

        bar.innerHTML =
            '<div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">' +
                '<div class="flex-1">' +
                    '<div class="flex items-center justify-between text-xs font-bold mb-1.5">' +
                        '<span class="text-gray-700 flex items-center">' +
                            '<i class="fas fa-check-double text-oppogreen mr-1.5"></i> Avance en ' + modStats.moduleName + ': ' +
                            '<span class="text-oppogreen ml-1">' + modStats.watched + ' de ' + modStats.total + ' videos (' + modStats.percentage + '%)</span>' +
                        '</span>' +
                        '<span class="text-gray-400">Total Global: ' + globalStats.percentage + '%</span>' +
                    '</div>' +
                    '<div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">' +
                        '<div class="h-full bg-gradient-to-r from-oppogreen to-teal-400 rounded-full transition-all duration-500" style="width: ' + modStats.percentage + '%"></div>' +
                    '</div>' +
                '</div>' +
                '<button onclick="window.oppoProgress.openProfileModal()" class="self-end sm:self-center text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0">' +
                    '<i class="fas fa-user-circle text-oppogreen text-sm"></i> <span>' + userLabel + '</span>' +
                '</button>' +
            '</div>';
    }

    function updateVideoCardBadges() {
        const progress = getProgressData();
        const cards = document.querySelectorAll('[onclick*="openVideo"]');
        cards.forEach(function (card) {
            const onclickAttr = card.getAttribute('onclick') || '';
            const match = onclickAttr.match(/openVideo\(['"]([^'"]+)['"]\)/);
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
                badge.innerHTML = '<i class="fas fa-check-circle"></i> Visto';
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

            '<!-- TOAST DE NOTIFICACION -->' +
            '<div id="oppoProgressToast" class="fixed bottom-6 right-6 z-[120] hidden items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-oppogreen/40 text-xs sm:text-sm font-semibold">' +
                '<i class="fas fa-check-circle text-oppogreen text-lg"></i>' +
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

        const shareText = encodeURIComponent(
            'Hola! Soy ' + user.nombre + ' (ID: ' + user.idEmpleado + ' | ' + user.cadena + ' - ' + user.ciudad + '). ' +
            'Llevo un ' + stats.percentage + '% de avance (' + stats.watchedCount + '/' + stats.TOTAL_VIDEOS + ' videos) ' +
            'en el Portal de Capacitacion OPPO Pro. Rango actual: ' + stats.rank.title + '.'
        );

        content.innerHTML =
            '<div class="text-center border-2 border-oppogreen/30 rounded-2xl p-5 bg-gradient-to-b from-emerald-50/40 to-white">' +
                '<div class="w-16 h-16 rounded-full bg-oppogreen text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">' +
                    '<i class="fas ' + stats.rank.icon + '"></i>' +
                '</div>' +
                '<span class="text-[11px] font-extrabold uppercase tracking-widest text-oppogreen">Constancia de Progreso OPPO</span>' +
                '<h3 class="text-2xl font-black text-gray-800 mt-1">' + escapeHtml(user.nombre) + '</h3>' +
                '<p class="text-xs text-gray-500 mt-0.5">' + escapeHtml(user.cadena) + ' &bull; ' + escapeHtml(user.ciudad) + ' &bull; ID: ' + escapeHtml(user.idEmpleado) + '</p>' +
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
                    '<div class="text-[11px] font-bold uppercase text-gray-400 mb-1">Desglose por M&oacute;dulo (' + stats.watchedCount + '/' + stats.TOTAL_VIDEOS + ' videos)</div>' +
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
    function showToast(message) {
        const toast = document.getElementById('oppoProgressToast');
        const text = document.getElementById('oppoProgressToastText');
        if (!toast || !text) return;
        text.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('flex');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toast.classList.add('hidden');
            toast.classList.remove('flex');
        }, 3200);
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // =========================================================================
    // 8. HOOK AUTOMATICO A openVideo() Y EVENTOS DEL DOM
    // =========================================================================
    function hookOpenVideo() {
        if (typeof window.openVideo === 'function' && !window.openVideo._oppoHooked) {
            const originalOpenVideo = window.openVideo;
            const wrapped = function (id) {
                originalOpenVideo(id);
                markVideoWatched(id);
            };
            wrapped._oppoHooked = true;
            window.openVideo = wrapped;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        injectProgressUI();
        hookOpenVideo();
    });

    // Exponer API global para los botones del UI
    window.oppoProgress = {
        openProfileModal: openProfileModal,
        closeProfileModal: closeProfileModal,
        submitProfileForm: submitProfileForm,
        openCertificateModal: openCertificateModal,
        closeCertificateModal: closeCertificateModal,
        markVideoWatched: markVideoWatched,
        setGoogleScriptUrl: function (url) {
            localStorage.setItem('oppo_google_script_url', url);
            showToast('URL de Google Sheets configurada');
        }
    };
})();
