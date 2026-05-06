// script.js

function init() {
    buildTimeline();
    buildArchives();
    buildUpdates();
    buildPantheon();
    buildHistoricalZones();
    buildCredits();
    setupFilters();
    setupSearch();
    setupModals();
}

function buildTimeline() {
    document.querySelectorAll('.track').forEach(t => t.innerHTML = '');

    catsData.forEach(cat => {
        const container = document.getElementById(`${cat.clan}-${cat.role}`);
        if (!container) return;

        const endTime = cat.status === 'active' ? 0 : cat.end;
        const duration = Math.abs(endTime - cat.start);

        const cardWrapper = document.createElement('div');
        cardWrapper.className = `card-wrapper cat-card-item ${cat.status}`;
        cardWrapper.setAttribute('data-name', cat.name.toLowerCase());
        cardWrapper.style.setProperty('--start', cat.start);
        cardWrapper.style.setProperty('--duration', duration);

        const activeClass = cat.status === 'active' ? 'is-active' : '';
        const typeLabel = cat.type === 'OC' ? '⭐ OC' : '🐾 PNJ';

        cardWrapper.innerHTML = `
            <div class="char-card ${activeClass}">
                <div class="card-avatar">
                    <img src="${cat.img || 'photos/default.png'}" onerror="this.src='photos/default.png'">
                </div>
                <div class="card-content">
                    <div class="card-name">${cat.name} <small style="opacity:0.6; font-size:0.6rem;">${typeLabel}</small></div>
                    <div class="card-dates">${cat.start} / ${endTime === 0 ? 'Présent' : endTime}</div>
                </div>
            </div>
        `;

        // Gestion du clic sans erreur de guillemets
        cardWrapper.querySelector('.char-card').addEventListener('click', () => {
            openCharModal(cat, endTime);
        });

        container.appendChild(cardWrapper);
    });
}

function openCharModal(cat, endTime) {
    const modal = document.getElementById('char-modal');
    const content = document.getElementById('char-content');
    const color = `var(--c-${cat.clan})`;
    const playerInfo = cat.playedBy ? `Joué par : <strong>${cat.playedBy}</strong>` : "Personnage Non-Joué (PNJ)";

    content.innerHTML = `
        <div class="modal-header">
            <img src="${cat.img}" class="modal-img" style="border-color: ${color}" onerror="this.src='photos/default.png'">
            <div>
                <h2 style="font-family: 'Cinzel'; color: ${color};">${cat.name}</h2>
                <p style="font-size:0.8rem; opacity:0.7;">${cat.start} à ${endTime === 0 ? 'Présent' : endTime}</p>
                <p style="font-size:0.9rem; margin-top:5px;">${playerInfo}</p>
            </div>
        </div>
        <div style="margin-top:20px; line-height:1.6;">${cat.bio || "Pas de biographie."}</div>
    `;
    modal.className = 'modal-visible';
}

function buildArchives() {
    const archiveContainer = document.getElementById('archive-list');
    archiveContainer.innerHTML = '';
    eventsData.forEach(ev => {
        const entry = document.createElement('div');
        entry.className = `log-entry event-type-${ev.type}`;
        entry.innerHTML = `
            <div class="log-date">${ev.dates} <span class="type-pill">${ev.type}</span></div>
            <div class="log-info"><strong>${ev.icon} ${ev.title}</strong> : ${ev.desc}</div>
        `;
        archiveContainer.appendChild(entry);
    });
}

// --- CALCUL DU PANTHÉON ---
function buildPantheon() {
    const list = document.getElementById('pantheon-list');
    if (!list) return;

    // Record de longévité
    let longestReign = { name: "Aucun", moons: 0 };
    let clanCounts = { vent: 0, tonnerre: 0, ombre: 0, riviere: 0 };

    catsData.forEach(cat => {
        const end = cat.status === 'active' ? 0 : cat.end;
        const duration = Math.abs(end - cat.start);
        
        if (duration > longestReign.moons) {
            longestReign = { name: cat.name, moons: duration };
        }
        clanCounts[cat.clan]++;
    });

    list.innerHTML = `
        <div class="record-item">
            <h4>🏆 Règne le plus long</h4>
            <p>${longestReign.name} (${longestReign.moons} lunes)</p>
        </div>
        <div class="record-item">
            <h4>📊 Dynasties les plus denses</h4>
            <p>Tonnerre: ${clanCounts.tonnerre} | Vent: ${clanCounts.vent}<br>
               Ombre: ${clanCounts.ombre} | Rivière: ${clanCounts.riviere}</p>
        </div>
    `;
}

// --- MISES À JOUR ---
function buildUpdates() {
    const list = document.getElementById('updates-list');
    if (!list) return;
    updatesData.forEach(upd => {
        list.innerHTML += `<div class="upd-item"><strong>${upd.date}</strong> : ${upd.text}</div>`;
    });
}

function buildCredits() {
    const list = document.getElementById('credits-list');
    if (!list) return;
    creditsData.forEach(c => {
        list.innerHTML += `
            <div class="credit-item">
                <span class="credit-role">${c.role}</span>
                <span class="credit-names">${c.names}</span>
            </div>
        `;
    });
}

function setupSearch() {
    const searchInput = document.getElementById('cat-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.cat-card-item').forEach(card => {
            const name = card.getAttribute('data-name');
            card.style.display = name.includes(term) ? "block" : "none";
        });
    });
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            const target = btn.getAttribute('data-target');
            document.querySelectorAll('.clan-col').forEach(col => {
                col.style.display = (target === 'all' || col.id === `col-${target}`) ? "block" : "none";
            });
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });
}

function setupModals() {
    const modals = {
        'char-modal': 'char-modal',
        'events-modal': 'events-modal',
        'legend-modal': 'legend-modal',
        'updates-modal': 'updates-modal',
        'pantheon-modal': 'pantheon-modal'
    };

    document.getElementById('btn-events').onclick = () => document.getElementById('events-modal').className = 'modal-visible';
    document.getElementById('btn-legend').onclick = () => document.getElementById('legend-modal').className = 'modal-visible';
    document.getElementById('btn-updates').onclick = () => document.getElementById('updates-modal').className = 'modal-visible';
    document.getElementById('btn-pantheon').onclick = () => document.getElementById('pantheon-modal').className = 'modal-visible';
    document.getElementById('btn-credits').onclick = () => document.getElementById('credits-modal').className = 'modal-visible';

    document.querySelectorAll('.det-close').forEach(btn => {
        btn.onclick = () => btn.closest('.modal-visible').className = 'modal-hidden';
    });

    window.onclick = (e) => {
        if (e.target.classList.contains('modal-visible')) e.target.className = 'modal-hidden';
    };
}

function buildHistoricalZones() {
    const globalLayer = document.querySelector('.global-layer');
    if (!globalLayer) return;

    const historicalZones = [
    { 
        id: "torrent", 
        name: "Domination du Torrent", 
        start: -145, 
        end: -105, 
        desc: "Ère où Étoile de Pluie et Pierre Froide ont unifié les quatre clans par la force.",
        color: "rgba(201, 64, 64, 0.15)" // Rouge sombre transparent
    }
    ];

    const catsData = [
    // CLAN DE LA RIVIÈRE
    { 
        clan: "riviere", role: "leaders", name: "Étoile de Pluie", 
        start: -175, end: -105, status: "deceased", type: "PNJ", 
        img: "photos/etoile_pluie.png", 
        bio: "Instigatrice de la Pluie Rouge et fondatrice du Clan du Torrent. Elle a régné d'une patte de fer sur l'ensemble des territoires." 
    },
    // CLAN DU VENT (Guérisseur mais figure du Torrent)
    { 
        clan: "vent", role: "healers", name: "Pierre Froide", 
        start: -150, end: -105, status: "deceased", type: "PNJ", 
        img: "photos/pierre_froide.png", 
        bio: "Bras droit d'Étoile de Pluie. Son intelligence a permis de maintenir la cohésion du Torrent pendant 40 lunes." 
    },
    ];

    historicalZones.forEach(zone => {
        const zoneDiv = document.createElement('div');
        zoneDiv.className = 'global-zone';
        const duration = Math.abs(zone.end - zone.start);
        
        zoneDiv.style.setProperty('--start', zone.start);
        zoneDiv.style.setProperty('--duration', duration);
        zoneDiv.style.backgroundColor = zone.color;
        
        zoneDiv.innerHTML = `<span class="zone-label">${zone.name}</span>`;
        // Tooltip simple au survol
        zoneDiv.title = zone.desc;
        
        globalLayer.appendChild(zoneDiv);
    });

}

window.onload = init;