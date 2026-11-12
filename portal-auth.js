/**
 * Sistema Unificado de Identidad, Roles (Elite vs Auditor) y Aislamiento por Cadena
 * Portal Elite OPPO - Noviembre 2026
 */
(function () {
    const PORTAL_REG_VERSION = 'v20261111_roles';
    const STORAGE_PROMO_KEY = 'oppo_promotor_profile_v1';
    const STORAGE_USER_KEY = 'oppo_user_profile';
    const STORAGE_REG_VER_KEY = 'oppo_reg_version';

    const AUDITOR_PIN = '7532';
    const AUDITOR_DIRECTORY = {
        'R915810': { id: 'R915810', nombre: 'ALEJANDRO DAVID SAULES ESPINOZA' },
        'AUDITORELITE': { id: 'AUDITOR-ELITE', nombre: 'AUDITOR ELITE OPPO' }
    };

    const SUPERVISOR_ALIASES = {
        // Farmer: ALBA BOGOTA ANDRES DANIEL
        'R916909': 'R916909', 'MR916909': 'R916909', '916909': 'R916909', '16909': 'R916909',
        // Farmer: BELLO VAZQUEZ ALMA JANET
        'MR914460': 'MR914460', 'R914460': 'MR914460', '914460': 'MR914460', '14460': 'MR914460',
        // Farmer: GARCIA GUILLEN TRINIDAD
        '6068': '6068', 'R96068': '6068', 'MR96068': '6068', 'R6068': '6068', 'MR6068': '6068', 'R906068': '6068', 'MR906068': '6068', '006068': '6068',
        // Farmer: HERNANDEZ SALAS ERICK GONZALO
        'R916667': 'R916667', 'MR916667': 'R916667', '916667': 'R916667', '16667': 'R916667',
        // Farmer: LOPEZ ESQUIVEL JUAN PABLO
        'R921932': 'R921932', 'MR921932': 'R921932', '921932': 'R921932', '21932': 'R921932',
        // Farmer: MONTECILLO PARRA ERIK EMMANUEL
        'MR919047': 'MR919047', 'R919047': 'MR919047', '919047': 'MR919047', '19047': 'MR919047',
        // Farmer: MORENO ORDOÑEZ CARLOS ANTONIO
        'MR916841': 'MR916841', 'R916841': 'MR916841', '916841': 'MR916841', '16841': 'MR916841',
        // Farmer: ROMERO VARA CARLOS EDUARDO
        'MR919227': 'MR919227', 'R919227': 'MR919227', '919227': 'MR919227', '19227': 'MR919227',
        // Farmer: ZAMORA MIRANDA CHRISTIAN
        'R96412': 'R96412', 'MR96412': 'R96412', '96412': 'R96412', '6412': 'R96412', 'R906412': 'R96412', 'MR906412': 'R96412',
        // Hunter: APOLINAR DUARTE EMMANUEL
        'MR919858': 'MR919858', 'R919858': 'MR919858', '919858': 'MR919858', '19858': 'MR919858',
        // Hunter: CHAVEZ HERNANDEZ JESUS
        'MR911612': 'MR911612', 'R911612': 'MR911612', '911612': 'MR911612', '11612': 'MR911612',
        // Hunter: ENRIQUEZ ARCHUNDIA MARICELA
        'R96731': 'R96731', 'MR96731': 'R96731', '96731': 'R96731', '6731': 'R96731', 'R906731': 'R96731', 'MR906731': 'R96731',
        // Hunter: ESQUIVEL DIAZ JORGE ALBERTO
        'R915349': 'R915349', 'MR915349': 'R915349', '915349': 'R915349', '15349': 'R915349',
        // Hunter: HERNANDEZ FLORES BRAYAN EDUARDO
        'MR918399': 'MR918399', 'R918399': 'MR918399', '918399': 'MR918399', '18399': 'MR918399',
        // Hunter: SANCHEZ BARAJAS JOSE DE JESUS
        'MR914803': 'MR914803', 'R914803': 'MR914803', '914803': 'MR914803', '14803': 'MR914803',
        // Hunter: VASQUEZ VASQUEZ LAZARO IVAN
        'MR913580': 'MR913580', 'R913580': 'MR913580', '913580': 'MR913580', '13580': 'MR913580'
    };

    let dataLoadPromise = null;
    let supLoadPromise = null;
    let readyCallbacks = [];

    function normalizeId(raw) {
        return String(raw || '').trim().toUpperCase().replace(/[\s\-]+/g, '');
    }

    function isAuditorId(normId) {
        return Object.prototype.hasOwnProperty.call(AUDITOR_DIRECTORY, normId);
    }

    function getPromoterList() {
        if (!window.PORTAL_COMISIONES_DATA) return [];
        return Array.isArray(window.PORTAL_COMISIONES_DATA)
            ? window.PORTAL_COMISIONES_DATA
            : (window.PORTAL_COMISIONES_DATA.promotores || []);
    }

    function getSupervisorsList() {
        const d = window.PORTAL_SUPERVISORES_DATA;
        if (!d) return [];
        return [].concat(d.farmers || [], d.hunters || []);
    }

    function findSupervisor(rawInput, supList) {
        if (!rawInput || !supList || supList.length === 0) return null;
        const norm = normalizeId(rawInput);
        if (!norm) return null;

        // 1. Alias map directo
        if (SUPERVISOR_ALIASES[norm]) {
            const canon = SUPERVISOR_ALIASES[norm];
            const found = supList.find(function (s) { return normalizeId(s.id) === canon; });
            if (found) return found;
        }

        // 2. Exact match con s.id
        let found = supList.find(function (s) { return normalizeId(s.id) === norm; });
        if (found) return found;

        // 3. Match numérico por dígitos (ej: '916909' -> 'R916909', '6068' -> '6068')
        const inputDigits = norm.replace(/\D/g, '');
        if (inputDigits.length >= 4) {
            found = supList.find(function (s) {
                const sDigits = normalizeId(s.id).replace(/\D/g, '');
                return sDigits === inputDigits || sDigits.endsWith(inputDigits) || inputDigits.endsWith(sDigits);
            });
            if (found) return found;
        }

        // 4. Match por nombre (si el usuario escribió nombre o apellido)
        const cleanInput = norm.replace(/[^A-Z0-9]/g, '');
        if (cleanInput.length >= 4) {
            found = supList.find(function (s) {
                const cleanName = normalizeId(s.nombre).replace(/[^A-Z0-9]/g, '');
                return cleanName.indexOf(cleanInput) !== -1;
            });
            if (found) return found;
        }

        return null;
    }

    function findPromoter(rawInput, promList) {
        if (!rawInput || !promList || promList.length === 0) return null;
        const norm = normalizeId(rawInput);
        if (!norm) return null;

        // 1. Exact match con p.id
        let found = promList.find(function (p) { return normalizeId(p.id) === norm; });
        if (found) return found;

        // 2. Match por dígitos puros (ej: 'R918750' <-> 'MR918750' o '918750')
        const inputDigits = norm.replace(/\D/g, '');
        if (inputDigits.length >= 5) {
            found = promList.find(function (p) {
                const pDigits = normalizeId(p.id).replace(/\D/g, '');
                return pDigits === inputDigits;
            });
            if (found) return found;
        }

        // 3. Match por nombre si tiene al menos 6 caracteres
        const cleanInput = norm.replace(/[^A-Z0-9]/g, '');
        if (cleanInput.length >= 6) {
            found = promList.find(function (p) {
                const cleanName = normalizeId(p.nombre).replace(/[^A-Z0-9]/g, '');
                return cleanName.indexOf(cleanInput) !== -1;
            });
            if (found) return found;
        }

        return null;
    }

    function ensureSupervisoresDataLoaded() {
        if (getSupervisorsList().length > 0) {
            return Promise.resolve(getSupervisorsList());
        }
        if (supLoadPromise) return supLoadPromise;

        supLoadPromise = new Promise(function (resolve) {
            const existing = document.querySelector('script[src*="supervisores-data.js"]');
            if (existing) {
                const check = setInterval(function () {
                    if (getSupervisorsList().length > 0) {
                        clearInterval(check);
                        resolve(getSupervisorsList());
                    }
                }, 50);
                setTimeout(function () {
                    clearInterval(check);
                    resolve(getSupervisorsList());
                }, 8000);
                return;
            }
            const sc = document.createElement('script');
            sc.src = 'supervisores-data.js?v=20261112b';
            sc.onload = function () { resolve(getSupervisorsList()); };
            sc.onerror = function () { resolve([]); };
            document.head.appendChild(sc);
        });
        return supLoadPromise;
    }

    function ensureComisionesDataLoaded() {
        if (getPromoterList().length > 0) {
            return Promise.resolve(getPromoterList());
        }
        if (dataLoadPromise) return dataLoadPromise;

        dataLoadPromise = new Promise(function (resolve, reject) {
            const existing = document.querySelector('script[src*="comisiones-data.js"]');
            if (existing) {
                const check = setInterval(function () {
                    if (getPromoterList().length > 0) {
                        clearInterval(check);
                        resolve(getPromoterList());
                    }
                }, 50);
                setTimeout(function () {
                    clearInterval(check);
                    resolve(getPromoterList());
                }, 8000);
                return;
            }
            const sc = document.createElement('script');
            sc.src = 'comisiones-data.js?v=20261112b';
            sc.onload = function () { resolve(getPromoterList()); };
            sc.onerror = function () { reject(new Error('No se pudo cargar el padrón de promotores.')); };
            document.head.appendChild(sc);
        });
        return dataLoadPromise;
    }

    function getStoredProfile() {
        try {
            const ver = localStorage.getItem(STORAGE_REG_VER_KEY);
            if (ver !== PORTAL_REG_VERSION) return null;
            const raw = localStorage.getItem(STORAGE_PROMO_KEY);
            if (!raw) return null;
            const prof = JSON.parse(raw);
            if (!prof || !prof.idEmpleado || !prof.role) return null;
            return prof;
        } catch (e) {
            return null;
        }
    }

    function saveUnifiedProfile(profile) {
        let prevUser = {};
        try {
            prevUser = JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || '{}') || {};
        } catch (e) {}

        const sameId = normalizeId(prevUser.id) === normalizeId(profile.idEmpleado);
        const userCompat = {
            id: profile.idEmpleado,
            nombre: profile.nombre,
            role: profile.role,
            isAuditor: profile.isAuditor,
            cadena: profile.cadena_oficial || profile.cadena,
            cadenas_slugs: profile.cadenas_slugs,
            registeredAt: profile.registeredAt,
            insigniaDorada: sameId ? !!prevUser.insigniaDorada : false,
            scoreEvaluaciones: sameId ? (prevUser.scoreEvaluaciones || 0) : 0
        };

        localStorage.setItem(STORAGE_PROMO_KEY, JSON.stringify(profile));
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userCompat));
        localStorage.setItem(STORAGE_REG_VER_KEY, PORTAL_REG_VERSION);
    }

    function isAuditor() {
        const prof = getStoredProfile();
        return !!(prof && (prof.role === 'auditor' || prof.isAuditor));
    }

    function isSupervisor() {
        const prof = getStoredProfile();
        return !!(prof && (prof.role === 'farmer' || prof.role === 'hunter' || prof.isSupervisor));
    }

    function getAllowedChainSlugs() {
        const prof = getStoredProfile();
        if (!prof) return [];
        if (prof.role === 'auditor' || prof.isAuditor || prof.role === 'farmer' || prof.role === 'hunter' || prof.isSupervisor) return ['*'];
        return Array.isArray(prof.cadenas_slugs) ? prof.cadenas_slugs : [];
    }

    function canAccessChain(slug) {
        const allowed = getAllowedChainSlugs();
        if (allowed.indexOf('*') !== -1) return true;
        return allowed.indexOf(slug) !== -1;
    }

    function logout(shouldReload) {
        try {
            localStorage.removeItem(STORAGE_REG_VER_KEY);
            localStorage.removeItem(STORAGE_PROMO_KEY);
            localStorage.removeItem(STORAGE_USER_KEY);
            localStorage.removeItem('oppo_sheets_autosync_v1');
            sessionStorage.removeItem('oppo_f2f_chain_override');
        } catch (e) {}
        if (shouldReload !== false) {
            window.location.reload();
        } else {
            showAuthModal('');
        }
    }

    function buildModalHtml() {
        return '' +
            '<div style="background:linear-gradient(145deg,#0f172a,#0b1324);border:1px solid rgba(16,185,129,0.35);border-radius:24px;max-width:440px;width:100%;padding:28px 26px;box-shadow:0 25px 60px rgba(0,0,0,0.75);font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;color:#f8fafc;">' +
                '<div style="text-align:center;margin-bottom:20px;">' +
                    '<div style="width:56px;height:56px;margin:0 auto 10px;border-radius:16px;background:rgba(5,182,112,0.15);border:1px solid rgba(5,182,112,0.4);display:flex;align-items:center;justify-content:center;">' +
                        '<img src="Recursos/Logo/favicon.png" alt="Portal Elite" style="width:38px;height:38px;border-radius:10px;object-fit:cover;">' +
                    '</div>' +
                    '<div style="font-size:10px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#34d399;margin-bottom:4px;">Acceso Oficial OPPO</div>' +
                    '<h2 style="font-size:1.3rem;font-weight:900;margin:0 0 6px;color:#ffffff;">Portal Elite</h2>' +
                    '<p style="color:#94a3b8;font-size:0.83rem;margin:0;line-height:1.4;">Ingresa tu ID para cargar tus promociones, simulador y avance personalizado.</p>' +
                '</div>' +

                '<div style="margin-bottom:14px;">' +
                    '<label style="display:block;color:#cbd5e1;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">ID de Promotor, Supervisor o Auditor</label>' +
                    '<input id="portalAuthIdInput" type="text" autocomplete="off" placeholder="Ej: MR918750, R916909 o AUDITOR-ELITE" ' +
                        'style="width:100%;box-sizing:border-box;background:#1e293b;border:1.5px solid rgba(100,116,139,0.5);border-radius:12px;padding:12px 14px;color:#ffffff;font-size:1rem;font-weight:800;outline:none;letter-spacing:0.04em;text-transform:uppercase;" />' +
                '</div>' +

                '<div id="portalAuthPinBox" style="display:none;margin-bottom:14px;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.35);border-radius:12px;padding:12px;">' +
                    '<label style="display:block;color:#fcd34d;font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;">PIN de Auditor (4 d&iacute;gitos)</label>' +
                    '<input id="portalAuthPinInput" type="password" inputmode="numeric" maxlength="4" placeholder="••••" ' +
                        'style="width:100%;box-sizing:border-box;background:#0f172a;border:1.5px solid rgba(245,158,11,0.5);border-radius:10px;padding:10px 14px;color:#ffffff;font-size:1.1rem;font-weight:900;outline:none;letter-spacing:0.35em;text-align:center;" />' +
                    '<div style="color:#fde68a;font-size:0.7rem;margin-top:6px;">ID autorizado como Auditor: acceso completo al 100% del portal.</div>' +
                '</div>' +

                '<div id="portalAuthFeedback" style="display:none;padding:10px 12px;border-radius:10px;font-size:0.8rem;font-weight:700;margin-bottom:14px;"></div>' +

                '<button id="portalAuthSubmitBtn" type="button" ' +
                    'style="width:100%;background:linear-gradient(135deg,#05B670,#059669);color:#ffffff;border:none;border-radius:12px;padding:13px 16px;font-size:0.95rem;font-weight:900;cursor:pointer;box-shadow:0 8px 20px rgba(5,182,112,0.3);">' +
                    'Ingresar al Portal &rarr;' +
                '</button>' +

                '<p style="color:#64748b;font-size:0.72rem;text-align:center;margin:14px 0 0;">&iquest;Tu ID no aparece? Consulta a tu supervisor o capacitador.</p>' +
            '</div>';
    }

    function showFeedback(msg, isOk) {
        const fb = document.getElementById('portalAuthFeedback');
        if (!fb) return;
        fb.style.display = 'block';
        if (isOk) {
            fb.style.background = 'rgba(16,185,129,0.16)';
            fb.style.border = '1px solid rgba(16,185,129,0.4)';
            fb.style.color = '#6ee7b7';
        } else {
            fb.style.background = 'rgba(239,68,68,0.16)';
            fb.style.border = '1px solid rgba(239,68,68,0.4)';
            fb.style.color = '#fca5a5';
        }
        fb.textContent = msg;
    }

    function togglePinVisibility() {
        const idInp = document.getElementById('portalAuthIdInput');
        const pinBox = document.getElementById('portalAuthPinBox');
        if (!idInp || !pinBox) return;
        const norm = normalizeId(idInp.value);
        if (isAuditorId(norm)) {
            pinBox.style.display = 'block';
        } else {
            pinBox.style.display = 'none';
        }
    }

    function handleAuthSubmit() {
        const idInp = document.getElementById('portalAuthIdInput');
        const pinInp = document.getElementById('portalAuthPinInput');
        const btn = document.getElementById('portalAuthSubmitBtn');
        if (!idInp) return;

        const normId = normalizeId(idInp.value);
        if (!normId || normId.length < 3) {
            showFeedback('Ingresa un ID válido (mínimo 3 caracteres).', false);
            return;
        }

        // 1. Flujo Auditor (R915810 o AUDITOR-ELITE)
        if (isAuditorId(normId)) {
            const pinBox = document.getElementById('portalAuthPinBox');
            if (pinBox && pinBox.style.display === 'none') {
                pinBox.style.display = 'block';
                if (pinInp) pinInp.focus();
                showFeedback('Ingresa el PIN de Auditor de 4 dígitos para continuar.', false);
                return;
            }
            const pinVal = (pinInp ? pinInp.value : '').trim();
            if (pinVal !== AUDITOR_PIN) {
                showFeedback('PIN de Auditor incorrecto. Verifica e intenta de nuevo.', false);
                if (pinInp) {
                    pinInp.value = '';
                    pinInp.focus();
                }
                return;
            }

            const aud = AUDITOR_DIRECTORY[normId];
            const profile = {
                idEmpleado: aud.id,
                id: aud.id,
                nombre: aud.nombre,
                role: 'auditor',
                isAuditor: true,
                cadena: 'AUDITOR',
                cadena_oficial: 'Modo Auditor (Acceso 100%)',
                cadenas_slugs: ['*'],
                tienda: 'Acceso Nacional / Todas las Cadenas',
                region: 'AUDITORIA',
                ciudad: 'AUDITORIA',
                telefono: '',
                registeredAt: Date.now(),
                fechaRegistro: new Date().toISOString()
            };
            finalizeLogin(profile, btn, 'Acceso Auditor validado. Cargando vista completa...');
            return;
        }

        // 2. Flujo Supervisor (Farmer / Hunter) o Promotor Elite
        btn.disabled = true;
        btn.textContent = 'Validando ID...';
        Promise.all([ensureSupervisoresDataLoaded(), ensureComisionesDataLoaded()]).then(function (results) {
            const supList = results[0] || [];
            const list = results[1] || [];

            const foundSup = findSupervisor(normId, supList);

            if (foundSup) {
                const roleLabel = foundSup.role === 'hunter' ? 'Supervisor Hunter' : 'Supervisor Farmer';
                const profile = {
                    idEmpleado: foundSup.id,
                    id: foundSup.id,
                    nombre: foundSup.nombre,
                    role: foundSup.role,
                    isSupervisor: true,
                    isAuditor: false,
                    cadena: roleLabel,
                    cadena_oficial: roleLabel + ' (' + foundSup.region + ')',
                    cadenas_slugs: ['*'],
                    tienda: 'Supervisión ' + foundSup.region + ' (' + foundSup.stores_count + ' tiendas)',
                    region: foundSup.region || 'R9-E',
                    ciudad: foundSup.region || 'R9-E',
                    telefono: '',
                    registeredAt: Date.now(),
                    fechaRegistro: new Date().toISOString()
                };
                finalizeLogin(profile, btn, '¡Bienvenido, ' + foundSup.nombre.split(' ')[0] + '! (' + roleLabel + ')');
                return;
            }

            const found = findPromoter(normId, list);

            if (!found) {
                btn.disabled = false;
                btn.innerHTML = 'Ingresar al Portal &rarr;';
                showFeedback('ID no encontrado en el padrón oficial. Verifica con tu supervisor.', false);
                return;
            }

            const chainName = found.cadena_oficial || found.cadena || 'OPPO Elite';
            const slugs = Array.isArray(found.cadenas_slugs) && found.cadenas_slugs.length > 0
                ? found.cadenas_slugs
                : [];
            const profile = {
                idEmpleado: found.id,
                id: found.id,
                nombre: found.nombre,
                role: 'elite',
                isAuditor: false,
                cadena: chainName,
                cadena_oficial: chainName,
                cadenas_slugs: slugs,
                tienda: found.tienda || chainName,
                region: found.region || '',
                ciudad: found.ciudad || found.region || '-',
                telefono: '',
                registeredAt: Date.now(),
                fechaRegistro: new Date().toISOString()
            };
            finalizeLogin(profile, btn, '¡Bienvenido, ' + found.nombre.split(' ')[0] + '! (' + chainName + ')');
        }).catch(function () {
            btn.disabled = false;
            btn.innerHTML = 'Ingresar al Portal &rarr;';
            showFeedback('Error de conexión al validar el padrón. Recarga la página.', false);
        });
    }

    function finalizeLogin(profile, btn, okMsg) {
        saveUnifiedProfile(profile);
        showFeedback(okMsg, true);
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.7';
        }
        setTimeout(function () {
            const overlay = document.getElementById('portalAuthOverlay');
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = '';

            if (window.oppoProgress && typeof window.oppoProgress.syncGA4UserIdentity === 'function') {
                window.oppoProgress.syncGA4UserIdentity(true);
            }
            const cbs = readyCallbacks.slice();
            readyCallbacks = [];
            cbs.forEach(function (fn) {
                try { fn(profile); } catch (e) {}
            });
            document.dispatchEvent(new CustomEvent('portal-auth-ready', { detail: profile }));
        }, 550);
    }

    function showAuthModal(prefilledId) {
        ensureComisionesDataLoaded().catch(function () {});
        ensureSupervisoresDataLoaded().catch(function () {});

        let overlay = document.getElementById('portalAuthOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'portalAuthOverlay';
            overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(4,9,18,0.88);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:16px;';
            overlay.innerHTML = buildModalHtml();
            document.body.appendChild(overlay);

            const idInp = document.getElementById('portalAuthIdInput');
            const pinInp = document.getElementById('portalAuthPinInput');
            const submitBtn = document.getElementById('portalAuthSubmitBtn');

            idInp.addEventListener('input', function () {
                this.value = this.value.toUpperCase();
                togglePinVisibility();
            });
            idInp.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') handleAuthSubmit();
            });
            if (pinInp) {
                pinInp.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') handleAuthSubmit();
                });
            }
            submitBtn.addEventListener('click', handleAuthSubmit);
        }

        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        const inp = document.getElementById('portalAuthIdInput');
        if (inp) {
            if (prefilledId) inp.value = prefilledId;
            togglePinVisibility();
            setTimeout(function () { inp.focus(); }, 100);
        }
    }

    function requireAuth(onReady) {
        const prof = getStoredProfile();
        if (prof) {
            if (typeof onReady === 'function') onReady(prof);
            return prof;
        }
        if (typeof onReady === 'function') {
            readyCallbacks.push(onReady);
        }
        let prefill = '';
        try {
            const old = JSON.parse(localStorage.getItem(STORAGE_USER_KEY) || 'null');
            if (old && (old.id || old.idEmpleado)) prefill = old.id || old.idEmpleado;
        } catch (e) {}
        showAuthModal(prefill);
        return null;
    }

    document.addEventListener('DOMContentLoaded', function () {
        requireAuth();
    });

    window.portalAuth = {
        VERSION: PORTAL_REG_VERSION,
        normalizeId: normalizeId,
        findSupervisor: findSupervisor,
        findPromoter: findPromoter,
        SUPERVISOR_ALIASES: SUPERVISOR_ALIASES,
        getProfile: getStoredProfile,
        isAuditor: isAuditor,
        isSupervisor: isSupervisor,
        getAllowedChainSlugs: getAllowedChainSlugs,
        canAccessChain: canAccessChain,
        requireAuth: requireAuth,
        showAuthModal: showAuthModal,
        logout: logout,
        ensureComisionesDataLoaded: ensureComisionesDataLoaded,
        ensureSupervisoresDataLoaded: ensureSupervisoresDataLoaded
    };
})();
