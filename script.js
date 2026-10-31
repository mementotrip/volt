(() => {
    'use strict';

    /* ======================================================================
       HELPERS
       ====================================================================== */
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const money = n => '$' + n.toLocaleString('en-US');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FREE_SHIP = 500;
    let uid = 0;

    const plural = n => {
        const a = n % 10, b = n % 100;
        if (a === 1 && b !== 11) return 'ТОВАР';
        if (a >= 2 && a <= 4 && (b < 10 || b >= 20)) return 'ТОВАРА';
        return 'ТОВАРОВ';
    };

    const store = {
        get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
    };

    /* ======================================================================
       SVG ILLUSTRATIONS (вместо фото — векторные 3D-подобные рендеры)
       ====================================================================== */
    const svg = (inner, defs = '') =>
        `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>${defs}</defs>${inner}</svg>`;

    const lg = (id, a, b, ao = 1, bo = 1) =>
        `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity="${ao}"/><stop offset="1" stop-color="${b}" stop-opacity="${bo}"/></linearGradient>`;

    const fan = (cx, cy, r, c, spin = true) => {
        let blades = '';
        for (let i = 0; i < 7; i++) {
            blades += `<path d="M0 0 C${r * .28} ${-r * .2} ${r * .5} ${-r * .65} ${r * .18} ${-r * .92} C${-r * .1} ${-r * .65} ${-r * .12} ${-r * .3} 0 0Z" fill="${c}" fill-opacity=".85" transform="rotate(${(i * 360 / 7).toFixed(2)})"/>`;
        }
        return `<g transform="translate(${cx} ${cy})"><circle r="${r}" fill="#0b0d11" stroke="${c}" stroke-opacity=".55" stroke-width="1.5"/><g class="${spin ? 'spin' : ''}">${blades}</g><circle r="${(r * .2).toFixed(1)}" fill="#191D26" stroke="${c}" stroke-width="1.5"/></g>`;
    };

    const GOLD = '#d9b25f';

    const ART = {
        gpu: c => {
            const g = 'a' + uid++;
            return svg(`
                <rect x="10" y="40" width="180" height="62" rx="9" fill="url(#${g})" stroke="#3a4256"/>
                <rect x="10" y="40" width="180" height="4" rx="2" fill="${c}"/>
                <rect x="4" y="42" width="9" height="62" rx="2" fill="#8C95A8"/>
                ${fan(62, 73, 22, c)}${fan(138, 73, 22, c)}
                <text x="100" y="76" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="7" letter-spacing="2" fill="#969EAF">VOLT</text>
                <rect x="28" y="102" width="96" height="8" rx="1.5" fill="${GOLD}"/>
                <path d="M30 106H122" stroke="#12151C" stroke-width="2" stroke-dasharray="1.5 2.5"/>
                <rect x="158" y="32" width="26" height="9" rx="2" fill="#0e1116" stroke="${c}"/>
                <circle cx="46" cy="50" r="1.6" fill="${c}"/><circle cx="154" cy="50" r="1.6" fill="${c}"/>`,
                lg(g, '#2e3546', '#12151C'));
        },

        cpu: c => {
            const g = 'a' + uid++;
            let pins = '';
            for (let i = 0; i < 10; i++) {
                const p = 56 + i * 10, q = 26 + i * 10;
                pins += `<rect x="${p}" y="10" width="3" height="8" fill="${GOLD}"/><rect x="${p}" y="122" width="3" height="8" fill="${GOLD}"/>` +
                        `<rect x="40" y="${q}" width="8" height="3" fill="${GOLD}"/><rect x="152" y="${q}" width="8" height="3" fill="${GOLD}"/>`;
            }
            return svg(`
                ${pins}
                <rect x="48" y="18" width="104" height="104" rx="10" fill="#1b2030" stroke="#3a4256"/>
                <rect x="60" y="30" width="80" height="80" rx="6" fill="url(#${g})" stroke="#aab2c5" stroke-opacity=".5"/>
                <rect x="72" y="42" width="56" height="56" rx="3" fill="#0e1116" fill-opacity=".4" stroke="${c}" stroke-opacity=".4"/>
                <text x="100" y="72" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="15" fill="${c}">VOLT</text>
                <text x="100" y="86" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="7" fill="#969EAF">16C / 32T</text>
                <path d="M48 18 L64 18 L48 34Z" fill="${c}"/>`,
                lg(g, '#c9cfdd', '#6b7488'));
        },

        mobo: c => {
            const g = 'a' + uid++;
            let slots = '', fins = '';
            for (let i = 0; i < 4; i++) slots += `<rect x="${114 + i * 10}" y="18" width="6" height="62" rx="1.5" fill="#2a3144"/><rect x="${114 + i * 10}" y="18" width="6" height="5" fill="${c}"/>`;
            for (let i = 0; i < 8; i++) fins += `<line x1="${36 + i * 8}" y1="20" x2="${36 + i * 8}" y2="32" stroke="#0e1116" stroke-width="1.5"/>`;
            return svg(`
                <rect x="22" y="8" width="156" height="124" rx="8" fill="url(#${g})" stroke="#3a4256"/>
                <rect x="30" y="16" width="74" height="18" rx="3" fill="#2a3144"/>${fins}
                <rect x="30" y="40" width="48" height="48" rx="4" fill="#0e1116" stroke="${c}"/>
                <rect x="37" y="47" width="34" height="34" fill="#232a3b"/>
                <circle cx="54" cy="64" r="6" fill="none" stroke="${c}" stroke-opacity=".7"/>
                ${slots}
                <rect x="30" y="98" width="100" height="6" rx="2" fill="#0e1116" stroke="${c}" stroke-opacity=".7"/>
                <rect x="30" y="112" width="100" height="6" rx="2" fill="#0e1116" stroke="#3a4256"/>
                <rect x="138" y="92" width="32" height="30" rx="3" fill="#2a3144" stroke="${c}" stroke-opacity=".5"/>
                <path d="M82 52H108V90H132" fill="none" stroke="${c}" stroke-opacity=".45" stroke-width="1.2"/>
                <path d="M78 76H100V96" fill="none" stroke="${c}" stroke-opacity=".3" stroke-width="1.2"/>`,
                lg(g, '#1c2232', '#10131b'));
        },

        ram: c => {
            const g = 'a' + uid++;
            const stick = y => {
                let chips = '';
                for (let i = 0; i < 6; i++) chips += `<rect x="${30 + i * 23}" y="${y + 9}" width="17" height="12" rx="1.5" fill="#0e1116" stroke="#2f364a"/>`;
                return `<rect x="16" y="${y}" width="168" height="36" rx="3" fill="#1b2030" stroke="#3a4256"/>
                        <rect x="16" y="${y}" width="168" height="25" rx="3" fill="url(#${g})"/>
                        <rect x="20" y="${y + 2}" width="160" height="3" rx="1.5" fill="${c}"/>
                        ${chips}
                        <line x1="20" x2="180" y1="${y + 40}" y2="${y + 40}" stroke="${GOLD}" stroke-width="4" stroke-dasharray="3 1.5"/>`;
            };
            return svg(stick(26) + stick(80), lg(g, '#38405a', '#1b2030'));
        },

        ssd: c => {
            const g = 'a' + uid++;
            return svg(`
                <rect x="12" y="52" width="14" height="36" rx="1" fill="${GOLD}"/>
                <path d="M15 54V86M19 54V86M23 54V86" stroke="#12151C" stroke-width="1.5"/>
                <rect x="24" y="44" width="152" height="52" rx="5" fill="url(#${g})" stroke="#3a4256"/>
                <rect x="34" y="52" width="34" height="36" rx="3" fill="#0e1116" stroke="#2f364a"/>
                <rect x="76" y="52" width="34" height="36" rx="3" fill="#0e1116" stroke="#2f364a"/>
                <rect x="118" y="52" width="34" height="36" rx="3" fill="#0e1116" stroke="#2f364a"/>
                <text x="51" y="74" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="6" fill="#969EAF">NAND</text>
                <text x="93" y="74" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="6" fill="${c}">CTRL</text>
                <text x="135" y="74" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="6" fill="#969EAF">DRAM</text>
                <rect x="24" y="90" width="152" height="3" fill="${c}" fill-opacity=".85"/>
                <circle cx="166" cy="70" r="5" fill="#0e1116" stroke="#8C95A8"/>
                <text x="100" y="116" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="10" letter-spacing="2" fill="${c}">NVMe · M.2</text>`,
                lg(g, '#2a3144', '#171b27'));
        },

        psu: c => {
            const g = 'a' + uid++;
            let grille = '';
            for (let r = 12; r <= 36; r += 6) grille += `<circle cx="78" cy="70" r="${r}" fill="none" stroke="#2f364a"/>`;
            return svg(`
                <rect x="24" y="24" width="152" height="92" rx="9" fill="url(#${g})" stroke="#3a4256"/>
                <circle cx="78" cy="70" r="38" fill="#0b0d11" stroke="#3a4256"/>
                ${grille}
                ${fan(78, 70, 28, c)}
                <text x="140" y="62" text-anchor="middle" font-family="Space Grotesk,sans-serif" font-weight="700" font-size="20" fill="${c}">850W</text>
                <text x="140" y="76" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="6.5" fill="#969EAF">80+ GOLD</text>
                <rect x="124" y="86" width="32" height="3" rx="1.5" fill="${c}" fill-opacity=".7"/>
                <rect x="170" y="40" width="14" height="10" rx="2" fill="#0e1116" stroke="${c}"/>
                <rect x="170" y="56" width="14" height="10" rx="2" fill="#0e1116" stroke="${c}"/>
                <rect x="170" y="72" width="14" height="10" rx="2" fill="#0e1116" stroke="#3a4256"/>
                <rect x="170" y="88" width="14" height="10" rx="2" fill="#0e1116" stroke="#3a4256"/>`,
                lg(g, '#2a3144', '#151925'));
        },

        case: c => {
            const g = 'a' + uid++, h = 'a' + uid++;
            return svg(`
                <rect x="54" y="6" width="92" height="124" rx="10" fill="#161b27" stroke="#3a4256"/>
                <rect x="62" y="14" width="76" height="92" rx="6" fill="url(#${g})" stroke="${c}" stroke-opacity=".6"/>
                ${fan(100, 34, 13, c)}${fan(100, 64, 13, c)}${fan(100, 94, 9, c)}
                <rect x="62" y="108" width="76" height="14" rx="3" fill="#0e1116" stroke="#2f364a"/>
                <rect x="142" y="14" width="3" height="92" rx="1.5" fill="url(#${h})"/>
                <rect x="62" y="124" width="14" height="6" rx="1" fill="#2a3144"/><rect x="124" y="124" width="14" height="6" rx="1" fill="#2a3144"/>`,
                lg(g, c, '#0b0d11', .28, .6) + lg(h, c, '#A084FF'));
        },

        cooling: c => {
            const g = 'a' + uid++;
            return svg(`
                <rect x="40" y="10" width="120" height="120" rx="16" fill="url(#${g})" stroke="#3a4256"/>
                <circle cx="52" cy="22" r="3" fill="#0e1116"/><circle cx="148" cy="22" r="3" fill="#0e1116"/>
                <circle cx="52" cy="118" r="3" fill="#0e1116"/><circle cx="148" cy="118" r="3" fill="#0e1116"/>
                <circle cx="100" cy="70" r="50" fill="none" stroke="${c}" stroke-opacity=".6" stroke-dasharray="4 5"/>
                ${fan(100, 70, 44, c)}`,
                lg(g, '#242b3d', '#12151C'));
        }
    };

    /* ======================================================================
       DATA
       ====================================================================== */
    const CATS = [
        { id: 'cpu',     name: 'Процессоры',          count: 124, color: '#A084FF' },
        { id: 'gpu',     name: 'Видеокарты',          count: 86,  color: '#527BFF' },
        { id: 'mobo',    name: 'Материнские платы',   count: 142, color: '#4FC3F7' },
        { id: 'ram',     name: 'Оперативная память',  count: 95,  color: '#E06CFF' },
        { id: 'ssd',     name: 'Накопители SSD',      count: 110, color: '#FF6B81' },
        { id: 'psu',     name: 'Блоки питания',       count: 64,  color: '#FFB547' },
        { id: 'case',    name: 'Корпуса',             count: 78,  color: '#5DD6E8' },
        { id: 'cooling', name: 'Охлаждение',          count: 102, color: '#73D8AC' }
    ];
    const catById = Object.fromEntries(CATS.map(c => [c.id, c]));

    const PRODUCTS = [
        { id: 1,  cat: 'gpu',     name: 'NVIDIA GeForce RTX 5080 16GB',   spec: '16 ГБ GDDR7 · 256-bit · DLSS 4',          price: 999, old: null, badge: 'new',  rating: 4.9, reviews: 312, specs: [['Память', '16 ГБ GDDR7'], ['Шина', '256 бит'], ['Питание', '360 Вт'], ['Выходы', '3× DP 2.1, HDMI 2.1']] },
        { id: 2,  cat: 'gpu',     name: 'AMD Radeon RX 9070 XT 16GB',     spec: '16 ГБ GDDR6 · 256-bit · FSR 4',           price: 599, old: 649,  badge: 'sale', rating: 4.7, reviews: 204, specs: [['Память', '16 ГБ GDDR6'], ['Шина', '256 бит'], ['Питание', '304 Вт'], ['Выходы', '3× DP 2.1, HDMI 2.1']] },
        { id: 15, cat: 'gpu',     name: 'NVIDIA GeForce RTX 5090 32GB',   spec: '32 ГБ GDDR7 · 512-bit · DLSS 4',          price: 1999, old: null, badge: 'new',  rating: 4.8, reviews: 118, specs: [['Память', '32 ГБ GDDR7'], ['Шина', '512 бит'], ['Питание', '575 Вт'], ['Выходы', '3× DP 2.1b, HDMI 2.1b']] },
        { id: 16, cat: 'gpu',     name: 'NVIDIA GeForce RTX 5070 Ti 16GB', spec: '16 ГБ GDDR7 · 256-bit · DLSS 4',         price: 749, old: null, badge: 'hit',  rating: 4.8, reviews: 276, specs: [['Память', '16 ГБ GDDR7'], ['Шина', '256 бит'], ['Питание', '300 Вт'], ['Выходы', '3× DP 2.1b, HDMI 2.1b']] },
        { id: 17, cat: 'gpu',     name: 'NVIDIA GeForce RTX 5070 12GB',   spec: '12 ГБ GDDR7 · 192-bit · DLSS 4',          price: 549, old: null, badge: null,   rating: 4.6, reviews: 341, specs: [['Память', '12 ГБ GDDR7'], ['Шина', '192 бит'], ['Питание', '250 Вт'], ['Выходы', '3× DP 2.1b, HDMI 2.1b']] },
        { id: 18, cat: 'gpu',     name: 'NVIDIA GeForce RTX 5060 Ti 16GB', spec: '16 ГБ GDDR7 · 128-bit · DLSS 4',         price: 429, old: null, badge: null,   rating: 4.5, reviews: 389, specs: [['Память', '16 ГБ GDDR7'], ['Шина', '128 бит'], ['Питание', '180 Вт'], ['Выходы', '3× DP 2.1b, HDMI 2.1b']] },
        { id: 19, cat: 'gpu',     name: 'AMD Radeon RX 9070 16GB',        spec: '16 ГБ GDDR6 · 256-bit · FSR 4',           price: 549, old: null, badge: null,   rating: 4.6, reviews: 162, specs: [['Память', '16 ГБ GDDR6'], ['Шина', '256 бит'], ['Питание', '220 Вт'], ['Выходы', '3× DP 2.1, HDMI 2.1']] },
        { id: 20, cat: 'gpu',     name: 'AMD Radeon RX 9060 XT 16GB',     spec: '16 ГБ GDDR6 · 128-bit · FSR 4',           price: 349, old: null, badge: null,   rating: 4.5, reviews: 214, specs: [['Память', '16 ГБ GDDR6'], ['Шина', '128 бит'], ['Питание', '160 Вт'], ['Выходы', '2× DP 2.1, HDMI 2.1']] },
        { id: 3,  cat: 'cpu',     name: 'AMD Ryzen 9 9950X',            spec: '16 ядер / 32 потока · до 5.7 ГГц',        price: 549, old: 599,  badge: 'hit',  rating: 4.9, reviews: 421, specs: [['Ядра / потоки', '16 / 32'], ['Частота', 'до 5.7 ГГц'], ['Сокет', 'AM5'], ['TDP', '170 Вт']] },
        { id: 4,  cat: 'cpu',     name: 'Intel Core Ultra 7 265K',        spec: '20 ядер · до 5.5 ГГц · LGA1851',          price: 399, old: null, badge: null,   rating: 4.6, reviews: 158, specs: [['Ядра', '20 (8P + 12E)'], ['Частота', 'до 5.5 ГГц'], ['Сокет', 'LGA1851'], ['TDP', '125 Вт']] },
        { id: 21, cat: 'cpu',     name: 'AMD Ryzen 7 9800X3D',            spec: '8 ядер / 16 потоков · 3D V-Cache · до 5.2 ГГц', price: 479, old: null, badge: 'hit',  rating: 4.9, reviews: 612, specs: [['Ядра / потоки', '8 / 16'], ['Частота', 'до 5.2 ГГц'], ['Сокет', 'AM5'], ['TDP', '120 Вт']] },
        { id: 22, cat: 'cpu',     name: 'AMD Ryzen 9 9950X3D',            spec: '16 ядер / 32 потока · 3D V-Cache · до 5.7 ГГц', price: 699, old: null, badge: 'new',  rating: 4.8, reviews: 187, specs: [['Ядра / потоки', '16 / 32'], ['Частота', 'до 5.7 ГГц'], ['Сокет', 'AM5'], ['TDP', '170 Вт']] },
        { id: 23, cat: 'cpu',     name: 'AMD Ryzen 7 7800X3D',            spec: '8 ядер / 16 потоков · 3D V-Cache · до 5.0 ГГц', price: 449, old: null, badge: null,   rating: 4.9, reviews: 734, specs: [['Ядра / потоки', '8 / 16'], ['Частота', 'до 5.0 ГГц'], ['Сокет', 'AM5'], ['TDP', '120 Вт']] },
        { id: 24, cat: 'cpu',     name: 'AMD Ryzen 5 9600X',              spec: '6 ядер / 12 потоков · до 5.4 ГГц · AM5',  price: 279, old: null, badge: null,   rating: 4.6, reviews: 298, specs: [['Ядра / потоки', '6 / 12'], ['Частота', 'до 5.4 ГГц'], ['Сокет', 'AM5'], ['TDP', '65 Вт']] },
        { id: 25, cat: 'cpu',     name: 'Intel Core Ultra 9 285K',        spec: '24 ядра (8P + 16E) · до 5.7 ГГц · LGA1851', price: 589, old: null, badge: null,   rating: 4.5, reviews: 121, specs: [['Ядра', '24 (8P + 16E)'], ['Частота', 'до 5.7 ГГц'], ['Сокет', 'LGA1851'], ['TDP', '125 Вт']] },
        { id: 26, cat: 'cpu',     name: 'Intel Core Ultra 5 245K',        spec: '14 ядер (6P + 8E) · до 5.2 ГГц · LGA1851', price: 309, old: null, badge: null,   rating: 4.4, reviews: 143, specs: [['Ядра', '14 (6P + 8E)'], ['Частота', 'до 5.2 ГГц'], ['Сокет', 'LGA1851'], ['TDP', '125 Вт']] },
        { id: 5,  cat: 'mobo',    name: 'ASUS ROG STRIX X870E-E',        spec: 'AM5 · DDR5 · PCIe 5.0 · Wi-Fi 7',         price: 499, old: null, badge: 'new',  rating: 4.8, reviews: 97,  specs: [['Сокет', 'AM5'], ['Чипсет', 'AMD X870E'], ['Память', 'DDR5, до 8000 МГц'], ['Сеть', 'Wi-Fi 7, 2.5G LAN']] },
        { id: 6,  cat: 'mobo',    name: 'MSI MAG B850 TOMAHAWK',          spec: 'AM5 · DDR5 · PCIe 5.0 · ATX',             price: 229, old: null, badge: null,   rating: 4.6, reviews: 183, specs: [['Сокет', 'AM5'], ['Чипсет', 'AMD B850'], ['Формат', 'ATX'], ['Сеть', 'Wi-Fi 7, 2.5G LAN']] },
        { id: 7,  cat: 'ram',     name: 'Corsair Vengeance DDR5 32GB',    spec: '2×16 ГБ · 6000 МГц · CL30',               price: 109, old: 129,  badge: 'sale', rating: 4.8, reviews: 530, specs: [['Объём', '32 ГБ (2×16)'], ['Частота', '6000 МГц'], ['Тайминги', 'CL30'], ['Профиль', 'XMP / EXPO']] },
        { id: 8,  cat: 'ram',     name: 'G.Skill Trident Z5 RGB 64GB',    spec: '2×32 ГБ · 6400 МГц · CL32 · RGB',         price: 219, old: null, badge: 'new',  rating: 4.9, reviews: 76,  specs: [['Объём', '64 ГБ (2×32)'], ['Частота', '6400 МГц'], ['Тайминги', 'CL32'], ['Подсветка', 'RGB']] },
        { id: 9,  cat: 'ssd',     name: 'Samsung 990 PRO 2TB',            spec: 'NVMe M.2 · PCIe 4.0 · до 7450 МБ/с',      price: 169, old: 209,  badge: 'sale', rating: 4.9, reviews: 689, specs: [['Объём', '2 ТБ'], ['Интерфейс', 'PCIe 4.0 x4'], ['Чтение', 'до 7450 МБ/с'], ['Запись', 'до 6900 МБ/с']] },
        { id: 10, cat: 'ssd',     name: 'WD Black SN850X 1TB',            spec: 'NVMe M.2 · PCIe 4.0 · до 7300 МБ/с',      price: 89,  old: null, badge: null,   rating: 4.7, reviews: 402, specs: [['Объём', '1 ТБ'], ['Интерфейс', 'PCIe 4.0 x4'], ['Чтение', 'до 7300 МБ/с'], ['Запись', 'до 6300 МБ/с']] },
        { id: 11, cat: 'psu',     name: 'Corsair RM850x 850W 80+ Gold',   spec: 'Модульный · ATX 3.1 · PCIe 5.1',          price: 149, old: null, badge: 'hit',  rating: 4.8, reviews: 355, specs: [['Мощность', '850 Вт'], ['Сертификат', '80+ Gold'], ['Кабели', 'Модульные'], ['Стандарт', 'ATX 3.1']] },
        { id: 12, cat: 'case',    name: 'Lian Li O11 Dynamic EVO',        spec: 'Mid-Tower · закалённое стекло · E-ATX',   price: 169, old: null, badge: null,   rating: 4.8, reviews: 266, specs: [['Формат', 'Mid-Tower'], ['Материнка', 'до E-ATX'], ['Панели', 'Закалённое стекло'], ['Вентиляторы', 'до 10 шт.']] },
        { id: 13, cat: 'cooling', name: 'Noctua NH-D15 G2',               spec: 'Двухбашенный · 2 вентилятора · 165 мм',   price: 149, old: null, badge: 'new',  rating: 4.9, reviews: 143, specs: [['Тип', 'Башенный'], ['Вентиляторы', '2× NF-A14x25r'], ['Высота', '168 мм'], ['TDP', 'до 300 Вт']] },
        { id: 14, cat: 'cooling', name: 'Arctic Liquid Freezer III 360',  spec: 'СЖО 360 мм · 3 вентилятора · AM5/LGA1851', price: 129, old: 149,  badge: 'sale', rating: 4.8, reviews: 318, specs: [['Тип', 'СЖО 360 мм'], ['Вентиляторы', '3× P12 Pro'], ['Сокеты', 'AM5, LGA1851'], ['Гарантия', '6 лет']] }
    ];
    const prodById = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

    /* Фото видеокарт: положите файлы в папку img/ с именем <id>.png (например img/1.png).
       Если файла нет — автоматически показывается SVG-иллюстрация. */
    const IMG_DIR = 'img/', IMG_EXT = '.png', PHOTO_CATS = ['gpu'];
    const pic = p => PHOTO_CATS.includes(p.cat)
        ? `<img class="photo" src="${IMG_DIR}${p.id}${IMG_EXT}" alt="${p.name}" data-pid="${p.id}" loading="lazy" decoding="async">`
        : ART[p.cat](catById[p.cat].color);

    document.addEventListener('error', e => {
        const t = e.target;
        if (t.tagName === 'IMG' && t.dataset.pid) {
            const p = prodById[t.dataset.pid];
            t.outerHTML = ART[p.cat](catById[p.cat].color);
        }
    }, true);

    const SLIDES = [
        { eyebrow: 'МИРОВАЯ ПРЕМЬЕРА', title: 'NVIDIA GeForce RTX 5080', text: 'Архитектура нового поколения. Невероятная производительность в трассировке лучей и алгоритмах ИИ для бескомпромиссного 4K-гейминга.', pid: 1, model: 'RTX 5080 FE', price: 'Старт продаж от $999', buy: 'Купить сейчас' },
        { eyebrow: 'ХИТ ПРОДАЖ', title: 'AMD Ryzen 9 9950X', text: 'Шестнадцать ядер Zen 5 для стриминга, рендеринга и топового гейминга — без компромиссов и без лишних ожиданий.', pid: 3, model: 'Ryzen 9 9950X', price: 'Сейчас от $549', buy: 'Купить сейчас' },
        { eyebrow: 'СКИДКА −19%', title: 'Samsung 990 PRO 2TB', text: 'Скорость чтения до 7450 МБ/с. Игры и рабочие проекты загружаются за секунды, а не за минуты.', pid: 9, model: '990 PRO 2TB', price: 'Сейчас $169 вместо $209', buy: 'Купить сейчас' }
    ];

    const BRANDS = ['NVIDIA', 'AMD', 'INTEL', 'ASUS', 'MSI', 'CORSAIR', 'SAMSUNG', 'NOCTUA', 'G.SKILL', 'LIAN LI', 'ARCTIC', 'WD'];

    const tagLabel = { new: 'NEW', sale: 'SALE', hit: 'ХИТ' };

    /* ======================================================================
       STATE
       ====================================================================== */
    let cart = store.get('volt.cart', {});          // { id: qty }
    const favs = new Set(store.get('volt.favs', []));
    const st = { cat: 'all', sort: 'pop', q: '', fav: false };

    /* ======================================================================
       TOAST
       ====================================================================== */
    const toast = msg => {
        const box = $('#toasts');
        const el = document.createElement('div');
        el.className = 'toast';
        el.textContent = msg;
        box.appendChild(el);
        while (box.children.length > 3) box.firstChild.remove();
        setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2600);
    };

    /* ======================================================================
       SCROLL REVEAL
       ====================================================================== */
    const io = 'IntersectionObserver' in window
        ? new IntersectionObserver(entries => entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        }), { threshold: .12 })
        : null;

    const observeReveals = () => $$('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in'));

    /* ======================================================================
       HERO SLIDER
       ====================================================================== */
    const heroEl = $('#hero');
    let slideIdx = 0;

    const renderHero = () => {
        $('#heroSlides').innerHTML = SLIDES.map((s, i) => {
            const p = prodById[s.pid];
            const color = catById[p.cat].color;
            return `
            <article class="slide${i === 0 ? ' active' : ''}" style="--accent:${color}" aria-roledescription="slide" aria-label="${i + 1} из ${SLIDES.length}">
                <div class="hero-content">
                    <div class="launch-label"><span class="launch-indicator"></span><span class="eyebrow">${s.eyebrow}</span></div>
                    <${i === 0 ? 'h1' : 'h2'} class="headline">${s.title}</${i === 0 ? 'h1' : 'h2'}>
                    <p class="supporting-copy">${s.text}</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary" data-buy="${p.id}">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                            <span>${s.buy}</span>
                        </button>
                        <button class="btn btn-secondary" data-open="${p.id}"><span>Характеристики</span></button>
                    </div>
                </div>
                <div class="hero-art">
                    <div class="art-float">${pic(p)}</div>
                    <div class="featured-callout"><span class="model">${s.model}</span><span class="starting-price">${s.price}</span></div>
                </div>
            </article>`;
        }).join('');

        $('#heroDots').innerHTML = SLIDES.map((s, i) =>
            `<button class="dot${i === 0 ? ' active' : ''}" data-slide="${i}" aria-label="Слайд ${i + 1}"></button>`).join('');
    };

    const goSlide = i => {
        slideIdx = (i + SLIDES.length) % SLIDES.length;
        $$('.slide').forEach((el, n) => el.classList.toggle('active', n === slideIdx));
        $$('.dot').forEach((el, n) => el.classList.toggle('active', n === slideIdx));
    };

    const initHero = () => {
        renderHero();
        $('#heroPrev').addEventListener('click', () => goSlide(slideIdx - 1));
        $('#heroNext').addEventListener('click', () => goSlide(slideIdx + 1));
        $('#heroDots').addEventListener('click', e => {
            const d = e.target.closest('[data-slide]');
            if (d) goSlide(+d.dataset.slide);
        });

        // автопереключение по окончанию анимации прогресса активной точки
        if (!reduceMotion) {
            $('#heroDots').addEventListener('animationend', e => {
                if (e.animationName === 'fill') goSlide(slideIdx + 1);
            });
            // пауза, когда вкладка скрыта
            document.addEventListener('visibilitychange', () => {
                const dot = $('.dot.active');
                if (dot) dot.style.animationPlayState = document.hidden ? 'paused' : '';
            });
        }

        // параллакс от мыши
        if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
            heroEl.addEventListener('mousemove', e => {
                const r = heroEl.getBoundingClientRect();
                heroEl.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
                heroEl.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
            });
            heroEl.addEventListener('mouseleave', () => {
                heroEl.style.setProperty('--px', 0);
                heroEl.style.setProperty('--py', 0);
            });
        }

        // свайп на мобильных
        let x0 = null;
        heroEl.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
        heroEl.addEventListener('touchend', e => {
            if (x0 === null) return;
            const dx = e.changedTouches[0].clientX - x0;
            if (Math.abs(dx) > 50) goSlide(slideIdx + (dx < 0 ? 1 : -1));
            x0 = null;
        });
    };

    /* ======================================================================
       BRANDS, CATEGORIES, MEGA MENU, CHIPS
       ====================================================================== */
    const renderBrands = () => {
        const html = BRANDS.map(b => `<span>${b}</span>`).join('');
        $('#brandTrack').innerHTML = html + html;
    };

    const renderCategories = () => {
        $('#categoryGrid').innerHTML = CATS.map((c, i) => `
            <a href="#catalog" class="category-card reveal" data-cat="${c.id}" style="--accent:${c.color};transition-delay:${i * 50}ms">
                <div class="card-image">${ART[c.id](c.color)}</div>
                <span class="category-name">${c.name}</span>
                <span class="product-count">${c.count} ${plural(c.count)}</span>
            </a>`).join('');

        $('#mega').innerHTML = CATS.map(c => `
            <button class="mega-item" data-cat="${c.id}" style="--accent:${c.color}">
                <span class="mega-thumb">${ART[c.id](c.color)}</span>
                <span><b>${c.name}</b><small>${c.count} ${plural(c.count)}</small></span>
            </button>`).join('');
    };

    const CHIPS = [{ id: 'all', name: 'Все' }, { id: 'new', name: 'Новинки' }, { id: 'sale', name: 'Скидки' }, ...CATS];

    const renderChips = () => {
        $('#chips').innerHTML = CHIPS.map(c =>
            `<button class="chip${st.cat === c.id ? ' active' : ''}" data-chip="${c.id}" role="tab" aria-selected="${st.cat === c.id}">${c.name}</button>`).join('');
    };

    /* ======================================================================
       CATALOG
       ====================================================================== */
    const getVisible = () => {
        const q = st.q.trim().toLowerCase();
        let list = PRODUCTS.filter(p => {
            if (st.cat === 'new' && p.badge !== 'new') return false;
            if (st.cat === 'sale' && !p.old) return false;
            if (!['all', 'new', 'sale'].includes(st.cat) && p.cat !== st.cat) return false;
            if (st.fav && !favs.has(p.id)) return false;
            if (q && !(`${p.name} ${p.spec} ${catById[p.cat].name}`.toLowerCase().includes(q))) return false;
            return true;
        });
        if (st.sort === 'asc') list.sort((a, b) => a.price - b.price);
        if (st.sort === 'desc') list.sort((a, b) => b.price - a.price);
        if (st.sort === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
        return list;
    };

    const heart = '<svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';

    const cardHTML = (p, i) => {
        const c = catById[p.cat];
        return `
        <article class="product-card" data-open="${p.id}" style="--accent:${c.color};--d:${i}" tabindex="0" aria-label="${p.name}">
            <div class="product-media">
                ${p.badge ? `<span class="tag ${p.badge}">${tagLabel[p.badge]}${p.badge === 'sale' && p.old ? ' −' + Math.round((1 - p.price / p.old) * 100) + '%' : ''}</span>` : ''}
                <button class="fav-btn${favs.has(p.id) ? ' on' : ''}" data-fav="${p.id}" aria-label="В избранное" aria-pressed="${favs.has(p.id)}">${heart}</button>
                ${pic(p)}
            </div>
            <div class="product-body">
                <span class="product-cat">${c.name.toUpperCase()}</span>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-spec">${p.spec}</p>
                <div class="rating"><span class="star">★</span><b>${p.rating}</b><span>(${p.reviews})</span></div>
                <div class="product-foot">
                    <div class="price"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
                    <button class="add-btn" data-add="${p.id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        В корзину
                    </button>
                </div>
            </div>
        </article>`;
    };

    const renderCatalog = () => {
        const list = getVisible();
        renderChips();
        $('#productGrid').innerHTML = list.length
            ? list.map(cardHTML).join('')
            : `<div class="empty"><b>Ничего не найдено</b>Попробуйте изменить запрос или сбросить фильтры.</div>`;

        const filtered = st.q || st.cat !== 'all' || st.fav;
        $('#resultMeta').innerHTML = `Найдено: ${list.length} из ${PRODUCTS.length}` +
            (st.q ? ` · запрос «${st.q.replace(/[<>&]/g, '')}»` : '') +
            (st.fav ? ' · только избранное' : '') +
            (filtered ? '<button id="resetFilters">Сбросить</button>' : '');

        $('#favBtn').classList.toggle('on', st.fav);
    };

    const scrollToCatalog = () => $('#catalog').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });

    const applyFilter = (cat, scroll = true) => {
        st.cat = cat;
        st.fav = false;
        renderCatalog();
        if (scroll) scrollToCatalog();
        $$('.category-card').forEach(el => el.classList.toggle('active', el.dataset.cat === cat));
    };

    /* ======================================================================
       CART
       ====================================================================== */
    const bump = el => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };

    const cartTotals = () => {
        let count = 0, sum = 0;
        for (const [id, q] of Object.entries(cart)) { count += q; sum += prodById[id].price * q; }
        return { count, sum };
    };

    const saveCart = () => store.set('volt.cart', cart);

    const renderCart = () => {
        const { count, sum } = cartTotals();
        const ids = Object.keys(cart);
        $('#cartCount').textContent = count;

        const left = Math.max(0, FREE_SHIP - sum);
        const pct = Math.min(100, sum / FREE_SHIP * 100);
        $('#shipProgress').innerHTML = left > 0
            ? `Добавьте ещё <b>${money(left)}</b> до бесплатной экспресс-доставки<div class="bar"><i style="width:${pct}%"></i></div>`
            : `🎉 <b>Бесплатная экспресс-доставка</b> для вашего заказа!<div class="bar done"><i style="width:100%"></i></div>`;

        $('#drawerBody').innerHTML = ids.length ? ids.map(id => {
            const p = prodById[id], q = cart[id], c = catById[p.cat];
            return `
            <div class="cart-item">
                <div class="cart-thumb">${pic(p)}</div>
                <div class="cart-info">
                    <span class="name">${p.name}</span>
                    <div class="cart-row">
                        <div class="qty"><button data-dec="${id}" aria-label="Меньше">−</button><span>${q}</span><button data-inc="${id}" aria-label="Больше">+</button></div>
                        <span class="cart-price">${money(p.price * q)}</span>
                    </div>
                    <button class="remove" data-remove="${id}">Удалить</button>
                </div>
            </div>`;
        }).join('') : `
            <div class="cart-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Корзина пока пуста</span>
                <button class="btn btn-secondary" data-close-drawer>Перейти к покупкам</button>
            </div>`;

        $('#drawerFoot').innerHTML = ids.length ? `
            <div class="sum-row"><span>Товары (${count})</span><span>${money(sum)}</span></div>
            <div class="sum-row"><span>Доставка</span><span>${left > 0 ? 'от $15' : 'Бесплатно'}</span></div>
            <div class="sum-row total"><span>Итого</span><b>${money(sum)}</b></div>
            <button class="btn btn-primary" id="checkout">Оформить заказ</button>
            <button class="link-btn" id="clearCart">Очистить корзину</button>` : '';
    };

    const addToCart = (id, qty = 1) => {
        cart[id] = (cart[id] || 0) + qty;
        saveCart(); renderCart(); bump($('#cartCount'));
        toast(`Добавлено: ${prodById[id].name}`);
    };

    const setQty = (id, q) => {
        if (q <= 0) delete cart[id]; else cart[id] = q;
        saveCart(); renderCart();
    };

    /* ======================================================================
       FAVORITES
       ====================================================================== */
    const updateFavBadge = () => {
        const b = $('#favCount');
        b.hidden = favs.size === 0;
        b.textContent = favs.size;
        if (favs.size) bump(b);
    };

    const toggleFav = id => {
        if (favs.has(id)) { favs.delete(id); toast('Удалено из избранного'); }
        else { favs.add(id); toast('Добавлено в избранное'); }
        store.set('volt.favs', [...favs]);
        updateFavBadge();
        $$(`[data-fav="${id}"]`).forEach(b => { b.classList.toggle('on', favs.has(id)); b.setAttribute('aria-pressed', favs.has(id)); });
        if (st.fav) renderCatalog();
    };

    /* ======================================================================
       DRAWER & MODAL
       ====================================================================== */
    const scrim = $('#scrim'), drawer = $('#drawer'), modal = $('#modal');

    const syncLock = () => {
        const open = drawer.classList.contains('open') || modal.classList.contains('open');
        scrim.classList.toggle('show', open);
        document.body.classList.toggle('lock', open);
    };

    const openDrawer = () => { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); syncLock(); };
    const closeDrawer = () => { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); syncLock(); };

    const openModal = id => {
        const p = prodById[id]; if (!p) return;
        const c = catById[p.cat];
        $('#modalCard').style.setProperty('--accent', c.color);
        $('#modalCard').innerHTML = `
            <button class="modal-close" data-close-modal aria-label="Закрыть">✕</button>
            <div class="modal-media">${pic(p)}</div>
            <div class="modal-info">
                <span class="product-cat">${c.name.toUpperCase()}</span>
                <h3>${p.name}</h3>
                <div class="rating"><span class="star">★</span><b>${p.rating}</b><span>· ${p.reviews} отзывов</span></div>
                <div class="spec-list">${p.specs.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>
                <div class="modal-buy">
                    <div class="price"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
                    <div style="display:flex;gap:8px">
                        <button class="fav-btn${favs.has(p.id) ? ' on' : ''}" style="position:static" data-fav="${p.id}" aria-label="В избранное">${heart}</button>
                        <button class="btn btn-primary" data-add-close="${p.id}">В корзину</button>
                    </div>
                </div>
            </div>`;
        modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); syncLock();
    };
    const closeModal = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); syncLock(); };

    /* ======================================================================
       SEARCH
       ====================================================================== */
    const searchInput = $('#searchInput'), results = $('#searchResults'), searchBar = $('#searchBar');
    let srIndex = -1;

    const renderSearch = () => {
        const q = searchInput.value.trim().toLowerCase();
        srIndex = -1;
        if (!q) { results.classList.remove('show'); return; }
        const found = PRODUCTS.filter(p => `${p.name} ${p.spec} ${catById[p.cat].name}`.toLowerCase().includes(q));
        results.innerHTML = found.length
            ? found.slice(0, 5).map(p => `
                <button class="sr-item" data-open="${p.id}" data-sr>
                    <span class="sr-thumb">${pic(p)}</span>
                    <span class="sr-text"><span class="sr-name">${p.name}</span><span class="sr-cat">${catById[p.cat].name.toUpperCase()}</span></span>
                    <span class="sr-price">${money(p.price)}</span>
                </button>`).join('') +
              `<button class="sr-all" data-sr-all>Показать все результаты (${found.length})</button>`
            : `<div class="sr-empty">По запросу «${q.replace(/[<>&]/g, '')}» ничего не найдено</div>`;
        results.classList.add('show');
    };

    const commitSearch = () => {
        st.q = searchInput.value; st.cat = 'all'; st.fav = false;
        results.classList.remove('show');
        renderCatalog(); scrollToCatalog();
        $$('.category-card').forEach(el => el.classList.remove('active'));
    };

    /* ======================================================================
       COUNTDOWN
       ====================================================================== */
    const initCountdown = () => {
        const target = new Date('2026-11-27T00:00:00').getTime();
        const pad = n => String(n).padStart(2, '0');
        const tick = () => {
            let d = Math.max(0, target - Date.now());
            const days = Math.floor(d / 864e5); d %= 864e5;
            const h = Math.floor(d / 36e5); d %= 36e5;
            const m = Math.floor(d / 6e4); d %= 6e4;
            const s = Math.floor(d / 1e3);
            $('#cdD').textContent = pad(days); $('#cdH').textContent = pad(h);
            $('#cdM').textContent = pad(m); $('#cdS').textContent = pad(s);
        };
        tick(); setInterval(tick, 1000);

        $('#dealArt').innerHTML = `<div class="stack">
            <div class="art-a">${ART.gpu('#527BFF')}</div>
            <div class="art-b">${ART.ram('#A084FF')}</div>
        </div>`;
    };

    /* ======================================================================
       GLOBAL EVENTS (делегирование)
       ====================================================================== */
    document.addEventListener('click', e => {
        const t = e.target;
        const q = sel => t.closest(sel);

        let el;
        if ((el = q('[data-fav]'))) { e.stopPropagation(); toggleFav(+el.dataset.fav); return; }
        if ((el = q('[data-add]'))) {
            e.stopPropagation();
            addToCart(+el.dataset.add);
            if (!el.classList.contains('added')) {
                const old = el.innerHTML;
                el.classList.add('added'); el.textContent = '✓ Добавлено';
                setTimeout(() => { el.classList.remove('added'); el.innerHTML = old; }, 1200);
            }
            return;
        }
        if ((el = q('[data-add-close]'))) { addToCart(+el.dataset.addClose); closeModal(); openDrawer(); return; }
        if ((el = q('[data-buy]'))) { addToCart(+el.dataset.buy); openDrawer(); return; }
        if (q('[data-close-modal]')) { closeModal(); return; }
        if (q('[data-close-drawer]')) { closeDrawer(); scrollToCatalog(); return; }
        if ((el = q('[data-open]'))) {
            results.classList.remove('show');
            openModal(+el.dataset.open);
            return;
        }
        if ((el = q('[data-inc]'))) { setQty(el.dataset.inc, cart[el.dataset.inc] + 1); return; }
        if ((el = q('[data-dec]'))) { setQty(el.dataset.dec, cart[el.dataset.dec] - 1); return; }
        if ((el = q('[data-remove]'))) { setQty(el.dataset.remove, 0); return; }
        if (q('#clearCart')) { cart = {}; saveCart(); renderCart(); toast('Корзина очищена'); return; }
        if (q('#checkout')) { toast('Демо-версия: оформление заказа недоступно'); return; }
        if (q('[data-sr-all]')) { commitSearch(); return; }
        if (q('#resetFilters')) { st.q = ''; searchInput.value = ''; applyFilter('all', false); return; }

        if ((el = q('[data-chip]'))) { st.q = ''; searchInput.value = ''; applyFilter(el.dataset.chip, false); return; }
        if ((el = q('[data-cat]'))) {
            e.preventDefault();
            closeMega(); closeMobileMenu();
            st.q = ''; searchInput.value = '';
            applyFilter(el.dataset.cat);
            return;
        }
        if ((el = q('[data-nav]'))) {
            e.preventDefault(); closeMobileMenu();
            st.q = ''; searchInput.value = '';
            applyFilter(el.dataset.nav);
            return;
        }
        if ((el = q('[data-toast]'))) { e.preventDefault(); toast(el.dataset.toast); return; }

        // закрытие выпадающих элементов по клику вне
        if (!q('#searchBar')) results.classList.remove('show');
        if (!q('.category-menu-wrap')) closeMega();
    });

    // клавиатура на карточке товара
    document.addEventListener('keydown', e => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.product-card')) {
            e.preventDefault(); openModal(+e.target.dataset.open);
        }
    });

    $('#scrim').addEventListener('click', () => { closeDrawer(); closeModal(); });
    $('#modal').addEventListener('click', e => { if (e.target === modal) closeModal(); });
    $('#drawerClose').addEventListener('click', closeDrawer);
    $('#cartBtn').addEventListener('click', openDrawer);
    $('#profileBtn').addEventListener('click', () => toast('Вход в аккаунт — в демо-версии недоступен'));
    $('#favBtn').addEventListener('click', () => {
        if (!favs.size && !st.fav) { toast('В избранном пока пусто — нажмите ♥ на любом товаре'); return; }
        st.fav = !st.fav; st.cat = 'all'; st.q = ''; searchInput.value = '';
        renderCatalog(); if (st.fav) scrollToCatalog();
    });
    $('#filterBtn').addEventListener('click', () => { scrollToCatalog(); $('#sortSelect').focus({ preventScroll: true }); });
    $('#sortSelect').addEventListener('change', e => { st.sort = e.target.value; renderCatalog(); });

    // меню "Каталог"
    const menuBtn = $('#menuBtn'), mega = $('#mega');
    const closeMega = () => { mega.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); };
    menuBtn.addEventListener('click', e => {
        e.stopPropagation();
        const open = mega.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', open);
    });

    // бургер
    const header = $('#top');
    const closeMobileMenu = () => { header.classList.remove('menu-open'); $('#burger').setAttribute('aria-expanded', 'false'); };
    $('#burger').addEventListener('click', () => {
        const open = header.classList.toggle('menu-open');
        $('#burger').setAttribute('aria-expanded', open);
    });

    // поиск
    searchInput.addEventListener('input', renderSearch);
    searchInput.addEventListener('focus', renderSearch);
    searchInput.addEventListener('keydown', e => {
        const items = $$('.sr-item', results);
        if (e.key === 'ArrowDown' && items.length) { e.preventDefault(); srIndex = (srIndex + 1) % items.length; }
        else if (e.key === 'ArrowUp' && items.length) { e.preventDefault(); srIndex = (srIndex - 1 + items.length) % items.length; }
        else if (e.key === 'Enter') {
            e.preventDefault();
            if (srIndex >= 0 && items[srIndex]) { items[srIndex].click(); } else commitSearch();
            return;
        } else return;
        items.forEach((it, i) => it.classList.toggle('active', i === srIndex));
    });

    const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
    $('#shortcut').textContent = isMac ? '⌘K' : 'Ctrl K';

    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); searchInput.focus(); searchInput.select(); }
        else if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); searchInput.focus(); }
        else if (e.key === 'Escape') {
            if (modal.classList.contains('open')) closeModal();
            else if (drawer.classList.contains('open')) closeDrawer();
            results.classList.remove('show'); closeMega(); searchInput.blur();
        }
    });

    // рассылка
    $('#newsForm').addEventListener('submit', e => {
        e.preventDefault();
        const input = $('#newsEmail'), err = $('#newsError');
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value.trim());
        input.classList.toggle('invalid', !ok); err.hidden = ok;
        if (ok) { toast('Спасибо! Вы подписаны на рассылку 🎉'); input.value = ''; }
    });
    $('#newsEmail').addEventListener('input', () => { $('#newsEmail').classList.remove('invalid'); $('#newsError').hidden = true; });

    // скролл: шапка + кнопка «наверх»
    const toTop = $('#toTop');
    const onScroll = () => {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 80);
        toTop.classList.toggle('show', y > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    // подсветка карточек за курсором
    document.addEventListener('pointermove', e => {
        const card = e.target.closest && e.target.closest('.category-card, .product-card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });

    /* ======================================================================
       INIT
       ====================================================================== */
    // чистим корзину от несуществующих товаров
    Object.keys(cart).forEach(id => { if (!prodById[id]) delete cart[id]; });

    initHero();
    renderBrands();
    renderCategories();
    renderCatalog();
    renderCart();
    updateFavBadge();
    initCountdown();
    observeReveals();
    onScroll();
})();
