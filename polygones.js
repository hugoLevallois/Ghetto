/* =========================================
   1. CONFIGURATION & CONSTANTES
   ========================================= */
const CONFIG = {
    center: [52.0889, 23.6979],
    zoom: 14,
    paths: {
        icons: 'leaflet/images/'
    },
    colors: {
        ghetto: '#b8bfc9ff',
        horsGhetto: '#AFAFAF',
        eau: '#64AFEF',
        vert: '#439627',
        citadelle: '#AFAFAF',
        cimetiere: '#111',
        hopital: '#E55757',
        equipement: '#0080ff',
        rue: '#111',
        association: '#20B2AA',
        abri:'#ca7dca',
       
        pont:'#95a5a6',
      village:'transparent'
        
       //village:'#3238d6ff'
    
    },
    styles: {
       
        lineDefault: {
            weight: 3,
            opacity: 0.8
        },
      
        rueInvisible: {
            weight: 12,
            opacity: 0,
            color: 'transparent'
        },
        
        
        point: {
            radius: 6,
            fillOpacity: 0.9
        },
        batiment: {
            weight: 1,
            fillOpacity: 0.3, //interieur
            opacity: 0.8 //bordure
        },
        equipement: {
            weight: 1,
            fillOpacity: 0.6, 
            opacity: 0.8      
        }
    }

};
// point distribution du pain
const COULEURS_TYPES = {
    1: "#663cd1ff", 
    2: "#ff87f1ff", 
    3: "#6cda31ff", 
    4: "#799fffff",
    5: "#eba732ff", 
    6: "#cfff3fff", 
    7: "#4a8d3dff", 
    8: "#df2e40ff",  
    9: "#ab2eabff", 
    10: "#7b4019ff", 
    11: "#4a8d3dff" ,
    "defaut": "#000000"
    
};
const getCouleurSpeciale = (item) => {
    return COULEURS_TYPES[item.Type] || COULEURS_TYPES["defaut"];
};
const COULEURSInfra = {
    "Administration": "#8E44AD",   // violet
    "Energie": "#F39C12", // Orange
    "Santé": "#E74C3C",   // Rouge
    "Ferroviaire": "#2C3E50",   // Bleu nuit/Acier
    "Logistique/Equipement": "#795548",   // brun
    "Médico-social": "#D35400", // Ocre / Terre cuite
    "Scolaire": "#F1C40F", // Jaune tournesol
    "Sportive": "#D81B60", // magenta
    "Sécurité": "#2980B9", // Bleu gendarmerie
    "Réseau/fluide": "#1ABC9C",   // Cyan
    "defaut": "#000000"
 };   
const getCOULEURSInfra = (item) => {
    return COULEURSInfra[item.Nature] || COULEURSInfra["defaut"];
};

const COULEURS_ENTREPRISES = {
    "Commerçant/artisan": "#FFD700",
    "Construction/matériaux": "#E67E22",
    "Entreprise Production alimentaire": "#27AE60",
    "Production biens manufacturés": "#34495E",
    "Imprimerie/reliure": "#16A085",
    "Travail du bois": "#A0522D",
    "defaut": "#000000"
};

// Fonction pour récupérer la couleur du statut
const getCouleurStatut = (item) => {
    return COULEURS_ENTREPRISES[item.statut] || COULEURS_ENTREPRISES["defaut"];
};




// Initialisation de la carte
const map = L.map('map').setView(CONFIG.center, CONFIG.zoom);

L.tileLayer('', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
    maxZoom: 25
}).addTo(map);

L.control.scale({ metric: true, imperial: false }).addTo(map);

/* =========================================
   2. ASSETS (ICONES & PATTERNS)
   ========================================= */

// Générateur d'icônes
const createIcon = (filename, size = 20) => L.icon({
    iconUrl: `${CONFIG.paths.icons}${filename}.svg`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2] 
});

const ICONS = {
    juif: createIcon('Synagogue'),
    catholique: createIcon('Catholique'),
    orthodoxe: createIcon('Orthodox'),
    administration: createIcon('administration'),
    administration_militaire: createIcon('administration_militaire'),
    logistic: createIcon('logistic'),
    camion: createIcon('camion'),
    militaire: createIcon('militaire'),
    ordre: createIcon('ordre'),
    TODT: createIcon('TODT'),
    plane:createIcon('plane'),
    camera:createIcon('camera7',70),
    default: createIcon('Synagogue') // Fallback
};

// Pattern Cimetière
const cemeteryPattern = new L.Pattern({ width: 7, height: 7, patternUnits: "userSpaceOnUse" });
const dot = new L.PatternCircle({ x: 4, y: 4, radius: 1.3, fill: true, fillColor: "#000", fillOpacity: 0.6, stroke: false });
cemeteryPattern.addShape(dot);
cemeteryPattern.addTo(map);

/* =========================================
   3. GROUPES DE CALQUES (LAYERS)
   ========================================= */
   
const GROUPS = {
    ghetto: L.layerGroup().addTo(map),
    eau: L.layerGroup().addTo(map),
    espacesverts: L.layerGroup().addTo(map),
    citadelle: L.layerGroup().addTo(map),
    cimetiere: L.layerGroup().addTo(map),
    pont: L.layerGroup().addTo(map),
    hopital: L.layerGroup().addTo(map), 
    equipement: L.layerGroup(),
    village: L.layerGroup().addTo(map),
    rues: L.layerGroup().addTo(map),
    association: L.layerGroup(),
    ruePain : L.layerGroup(),
    pointPain : L.layerGroup(),
    entreprise:L.layerGroup(),
    planHistorique: L.layerGroup(),
    abri:L.layerGroup(),
    allemand:L.layerGroup(),
    eauLigne:L.layerGroup().addTo(map),
    parcLigne:L.layerGroup().addTo(map),
    photos:L.layerGroup(),
  
    
    voieferree: L.layerGroup().addTo(map),
    
    
    //Sous-groupes allemand
    allemandAdministration:L.layerGroup(),
    allemandAdministrationMilitaire:L.layerGroup(),
    allemandLogistic:L.layerGroup(),
    allemandTODT:L.layerGroup(),
    allemandTransport:L.layerGroup(),
    allemandMilitaire:L.layerGroup(),
    allemandOrdre:L.layerGroup(),
    allemandPlane:L.layerGroup(),

    //Sous-groupes equipement
    infra_before: L.layerGroup(),
    infra_during: L.layerGroup(),
    
    //  sous-groupes entreprises
    entCommercant: L.layerGroup(),
    entConstruction: L.layerGroup(),
    entAlimentaire: L.layerGroup(),
    entManufacture: L.layerGroup(),
    entImprimerie: L.layerGroup(),
    entBois: L.layerGroup(),
    
    //sous-groupe pain
    secteur1: L.layerGroup(),
    secteur2: L.layerGroup(),
    secteur3: L.layerGroup(),
    secteur4: L.layerGroup(),
    secteur5: L.layerGroup(),
    secteur6: L.layerGroup(),
    secteur7: L.layerGroup(),
    secteur8: L.layerGroup(),
    secteur9: L.layerGroup(),
    secteur10: L.layerGroup(),
    secteur11: L.layerGroup(),
    
    
    // Sous-groupes cultes
    culteJuif: L.layerGroup().addTo(map),
    culteCatholique: L.layerGroup().addTo(map),
    culteOrthodoxe: L.layerGroup().addTo(map)
    
};

/* =========================================
   4. LOGIQUE METIER & STYLE
   ========================================= */

// Sélection de l'icône selon la religion
function getIcon(item) {
    const religion = (item.religion || '').toString().trim();
    if (religion === 'Juive') return ICONS.juif;
    if (religion === 'Catholique') return ICONS.catholique;
    if (religion === 'Orthodoxe') return ICONS.orthodoxe;
    
    const type = (item.type || '').toString().trim();
    if (type === 'Administration') return ICONS.administration;
    if (type === 'Administration militaire') return ICONS.administration_militaire;
    if (type.includes('logistique')) return ICONS.logistic;
    if (type === 'Organisation Todt') return ICONS.TODT;
    if (type === 'Maintien de l’ordre') return ICONS.ordre;
    if (type === 'Armement/défense') return ICONS.militaire;
    if (type === 'Infrastructure transport') return ICONS.camion;
    if (type === 'Aéroport') return ICONS.plane;
    
    
    return null;
}



let sud = 52.078731657, ouest = 23.669219546;
let nord = 52.111795023, est = 23.713871139;


const imageBounds = [[sud, ouest], [nord, est]];

const planOleg = L.imageOverlay('leaflet/images/carte_Oleg3.png', imageBounds, {
    opacity: 0.7,
    interactive: false,
    zIndex: 1
}).addTo(GROUPS.planHistorique);


function applyRailStyle(layer) {
    // 1. On définit le style de la ligne principale (le "fond" des rails)
    layer.setStyle({
        color: "#555",       // Gris foncé
        weight: 4,           // Largeur totale du rail
        opacity: 0.9,
        lineCap: 'butt'
    });

    // 2. On ajoute les traverses 

    const dashLine = L.polyline(layer.getLatLngs(), {
        color: "#fff",       // Couleur des traverses
        weight: 3,           // Un peu plus fin que le fond
        opacity: 1,
        dashArray: '2, 6',   // 2px de trait, 6px de vide (crée l'effet de traverses)
        interactive: false   // Pour ne pas gêner le clic sur la ligne principale
    }).addTo(GROUPS.voieferree);
}
//Legende
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
    this._div = L.DomUtil.create('div', 'dynamic-legend');
    return this._div;
};
legend.addTo(map);

L.DomEvent.disableScrollPropagation(legend.getContainer());
L.DomEvent.disableClickPropagation(legend.getContainer());

function updateLegend() {
    let html = "<strong>Légende</strong><br>";
    let hasContent = false;

    // 1. ENTREPRISES (Carrés)
    const mappingEntreprises = [
    { label: "Commerçant/artisan", legendLabel: "Commerçant & Artisan", group: GROUPS.entCommercant },
    { label: "Construction/matériaux", legendLabel: "Construction / matériaux", group: GROUPS.entConstruction },
    { label: "Entreprise Production alimentaire", group: GROUPS.entAlimentaire },
    { label: "Production biens manufacturés", group: GROUPS.entManufacture },
    { label: "Imprimerie/reliure", legendLabel: "Imprimerie & Reliure", group: GROUPS.entImprimerie },
    { label: "Travail du bois", group: GROUPS.entBois }
];

// On filtre pour ne garder que ceux dont le groupe est actif sur la carte
const entreprisesActives = mappingEntreprises.filter(item => map.hasLayer(item.group));

if (entreprisesActives.length > 0) {
    html += "<br><em>Entreprises </em><br>";
    entreprisesActives.forEach(item => {
        const color = COULEURS_ENTREPRISES[item.label] || "#000";
        const textToShow = item.legendLabel || item.label; 
            html += `<div class="legend-item">
                        <div class="legend-color legend-square" style="background:${color}"></div>
                        ${textToShow}
                     </div>`;
        });
    hasContent = true;
}

    // --- 2. INFRASTRUCTURES (Filtrage par Nature visible) ---
const infraGroups = [GROUPS.infra_before, GROUPS.infra_during];
const isInfraVisible = infraGroups.some(g => map.hasLayer(g));

if (isInfraVisible) {
    let infraHtml = "";
    // On parcourt chaque type défini dans COULEURSInfra
    for (let [nature, color] of Object.entries(COULEURSInfra)) {
        if (nature === "defaut") continue;

        // On vérifie si un bâtiment de cette 'nature' existe dans les calques affichés
        let natureVisible = false;
        infraGroups.forEach(group => {
            if (map.hasLayer(group)) {
                group.eachLayer(layer => {
                    // On vérifie si l'objet dans le groupe correspond à la nature
                    if (layer.options.fillColor === color || layer.options.color === color) {
                        natureVisible = true;
                    }
                });
            }
        });

        if (natureVisible) {
            infraHtml += `<div class="legend-item"><div class="legend-color legend-circle" style="background:${color}"></div>${nature}</div>`;
        }
    }

    if (infraHtml !== "") {
        html += "<br><em>Infrastructures</em><br>" + infraHtml;
        hasContent = true;
    }
}
    // --- 3. OCCUPATION ALLEMANDE (Filtrage par Groupe coché) ---
const mappingAllemand = [
    { label: "Administration", img: "administration.svg", group: GROUPS.allemandAdministration },
    { label: "Administration Militaire", img: "administration_militaire.svg", group: GROUPS.allemandAdministrationMilitaire },
    { label: "Logistique", img: "logistic.svg", group: GROUPS.allemandLogistic },
    { label: "Organisation Todt", img: "TODT.svg", group: GROUPS.allemandTODT },
    { label: "Transport", img: "camion.svg", group: GROUPS.allemandTransport },
    { label: "Aéroport", img: "plane.svg", group: GROUPS.allemandPlane },
    
    { label: "Armement / Défense", img: "militaire.svg", group: GROUPS.allemandMilitaire },
    
    { label: "Maintien de l'ordre", img: "ordre.svg", group: GROUPS.allemandOrdre }
    
];

const allemandActifs = mappingAllemand.filter(item => map.hasLayer(item.group));

if (allemandActifs.length > 0) {
    html += "<br><em>Occupation Allemande</em><br>";
    allemandActifs.forEach(item => {
        html += `<div class="legend-item">
                    <img src="${CONFIG.paths.icons}${item.img}" class="legend-icon">
                    ${item.label}
                 </div>`;
    });
    hasContent = true;
}
const mappingDivers = [
        
        { label: "Association", color: CONFIG.colors.association, group: GROUPS.association, type: "circle" },
        { label: "Abri anti-bombardement", color: CONFIG.colors.abri, group: GROUPS.abri, type: "circle" },
        { label: "Village", color: CONFIG.colors.village, group: GROUPS.village, type: "text" }
    ];

    const diversActifs = mappingDivers.filter(item => map.hasLayer(item.group));
    if (diversActifs.length > 0) {
    html += "<br><em>Lieux & Zones</em><br>";
    diversActifs.forEach(item => {
        if (item.type === "text") {
            // Version TEXTE PUR pour le village
            html += `<div class="legend-item">
                        <span class="label-village" style="margin-right:8px; width:45px; display:inline-block; text-align:center;">
                        Kievka
                        </span>
                        ${item.label}
                     </div>`;
        } else {
            // Version CLASSIQUE pour les autres
            let style = `background:${item.color}`;
            let extraClass = item.type === "circle" ? "legend-circle" : "legend-square";
            
            html += `<div class="legend-item">
                        <div class="legend-color ${extraClass}" style="${style}"></div>
                        ${item.label}
                     </div>`;
        }
    });
        hasContent = true;
    }

// --- 4. PAIN (Secteurs 1 à 11) ---
let painHtml = "";

for (let i = 1; i <= 11; i++) {
    const secteurNom = "secteur" + i;
    const groupeSecteur = GROUPS[secteurNom];

    // On vérifie si le groupe existe et s'il est affiché sur la carte
    if (groupeSecteur && map.hasLayer(groupeSecteur)) {
        const color = COULEURS_TYPES[i] || COULEURS_TYPES["defaut"];
        painHtml += `
            <div class="legend-item">
                <div class="legend-color legend-circle" style="background:${color}"></div>
                Secteur ${i}
            </div>`;
    }
}

if (painHtml !== "") {
    html += "<br><em>Distribution du Pain</em><br>" + painHtml;
    hasContent = true;
}

    // Affichage ou masquage de la boîte
    const legendDiv = document.querySelector('.dynamic-legend');
    legendDiv.innerHTML = html;
    legendDiv.style.display = hasContent ? 'block' : 'none';
}
 // /////////////////////////////////////////////////

// Fonction principale de traitement des géométries
function processGeometry(item, targetGroup, colorOrStyle) {
    const coords = item.geometryProperty;
    //const props = (item.Properties ?? "").toString();

    //const props = item.nom || (item.Properties ? item.Properties.toString() : "");
    let props = item.nom || "";
    if (item.Properties) {
        if (typeof item.Properties === 'string') {
            // Cas 1 : Properties est directement un texte (ex: "Club de l'association...")
            props = item.Properties;
        } else if (typeof item.Properties === 'object') {
            // Cas 2 : Properties est un objet complexe (ex: { zone: "Ghetto", id_ilot: 1, ... })
            //props = `Zone : ${item.Properties.zone || ''} - Habitants juifs : ${item.Properties.nb_personne || ''}`;
            props = `Habitants juifs recensés : ${item.Properties.nb_personne || ''}`;
        }
    }
    const fid = item.fid;
    
    if (!coords || coords.length === 0) return;

    let layer = null;
    let finalColor;

    // Calcul de la couleur
    if (typeof colorOrStyle === 'function') {
        finalColor = colorOrStyle(item);
    } else {
        finalColor = colorOrStyle || "#000000";
    }

    // --- CAS 1: POINT ---
    if (typeof coords[0] === "number") {
    
    if (targetGroup === GROUPS.pointPain) {
        // On redirige dynamiquement vers secteur1, secteur2, etc.
        const secteurNom = "secteur" + item.Type;
        if (GROUPS[secteurNom]) {
            targetGroup = GROUPS[secteurNom];
        }
    }
    
        const icon = getIcon(item);
        if (icon) {
        let specificGroup = targetGroup|| GROUPS.allemand;
          if (item.religion === 'Juive') specificGroup = GROUPS.culteJuif;
            if (item.religion === 'Catholique') specificGroup = GROUPS.culteCatholique;
      if(item.religion === 'Orthodoxe') specificGroup = GROUPS.culteOrthodoxe;
            
        if (item.type === 'Administration') specificGroup = GROUPS.allemandAdministration;
        if (item.type === 'Administration militaire') specificGroup = GROUPS.allemandAdministrationMilitaire;
        if (item.type === 'Organisation de l’armée d’occupation/logistique') specificGroup = GROUPS.allemandLogistic;
        if (item.type === 'Maintien de l’ordre') specificGroup = GROUPS.allemandOrdre;
        if (item.type === 'Aéroport') specificGroup = GROUPS.allemandPlane;
        
        if (item.type === 'Armement/défense') specificGroup = GROUPS.allemandMilitaire;
        if (item.type === 'Organisation Todt') specificGroup = GROUPS.allemandTODT;
        if (item.type === 'Infrastructure transport') specificGroup = GROUPS.allemandTransport;
           
           if (specificGroup) {
            layer = L.marker(coords, { icon: icon }).addTo(specificGroup);
        } else {
            console.error("Impossible de trouver un groupe pour l'item :", item);
        }
        } 
        
      
        else if (item.statut) {
        const couleur = getCouleurStatut(item);
        
        let specificGroup = GROUPS.entreprise; 
    const statut = item.statut.trim();

    if (statut === "Commerçant/artisan") specificGroup = GROUPS.entCommercant;
    else if (statut === "Construction/matériaux") specificGroup = GROUPS.entConstruction;
    else if (statut === "Entreprise Production alimentaire") specificGroup = GROUPS.entAlimentaire;
    else if (statut === "Production biens manufacturés") specificGroup = GROUPS.entManufacture;
    else if (statut === "Imprimerie/reliure") specificGroup = GROUPS.entImprimerie;
    else if (statut === "Travail du bois") specificGroup = GROUPS.entBois;

    // 2. Création du carré
    const squareIcon = L.divIcon({
        className: 'custom-square-marker',
        html: `<div style="background-color: ${couleur}; width: 10px; height: 10px; border: 1px solid #333;"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
    });

        layer = L.marker(coords, { icon: squareIcon }).addTo(specificGroup);
    }
        else {
            layer = L.circleMarker(coords, { 
                radius: CONFIG.styles.point.radius, 
                color: finalColor, 
                fillColor: finalColor, 
                fillOpacity: CONFIG.styles.point.fillOpacity,
                weight: 1 
            }).addTo(targetGroup);
        }
    } 
    // --- CAS 2: POLYGONE (BATIMENT) ---
    // On vérifie si c'est un anneau fermé
    else if (Array.isArray(coords[0]) && coords[0].toString() === coords[coords.length - 1].toString()) {
    let style;
    let destinationGroup = targetGroup;
         if (targetGroup === GROUPS.cimetiere) {
        style = { 
            color: "#444", 
            weight: 1, 
            fill: true, 
            fillOpacity: 1,
            fillColor: 'transparent',
            fillPattern: cemeteryPattern 
        };
    }
    else if (targetGroup === GROUPS.equipement) {
    const Periode = item.Periode; 
                    if (Periode === "before") destinationGroup = GROUPS.infra_before;
                   
                    else if (Periode === "during") destinationGroup = GROUPS.infra_during;
        style = { 
            color: getCOULEURSInfra(item), 
            fillColor: getCOULEURSInfra(item), 
            fillOpacity: CONFIG.styles.equipement.fillOpacity, 
            opacity: CONFIG.styles.equipement.opacity, 
            weight: CONFIG.styles.equipement.weight 
        };
    }
    else if (targetGroup === GROUPS.village) {
            style = {
                color: finalColor,   // Utilise la couleur définie dans LAYERS_CONFIG (ou force '#000')
                weight: 2,           // Épaisseur de la bordure (contour épais)
                dashArray: '4, 6',   // Motif pointillé : 6px de trait, 8px de vide
                fillOpacity: 0,      // Fond totalement transparent
                opacity: 1,          // L'opacité du trait (1 = opaque)
                lineCap: 'butt'      // Finition des tirets (optionnel)
            };
        }
    
    else {
        style = { 
            color: finalColor, 
            fillColor: finalColor, 
            fillOpacity: CONFIG.styles.batiment.fillOpacity, 
            opacity: CONFIG.styles.batiment.opacity, 
            weight: CONFIG.styles.batiment.weight 
        };
    }
        
        layer = L.polygon(coords, style).addTo(destinationGroup);
        layer.custId = fid;
        layer.on("click", (ev) => switchSideBar(sidebar, ev.target.custId, fid));
        
        if (targetGroup === GROUPS.village && props) {
        layer.bindTooltip(props, {
            permanent: true,      // Toujours visible (pas besoin de survoler)
            direction: "center",  // Force le texte au centre du polygone
            className: "label-village" // Classe CSS pour le style (voir étape 2)
        }).openTooltip();
    }
        
       
    }
    // --- CAS 3: LIGNE (RUE / RAIL) ---
    else {
    
    
        const latlngs = (Array.isArray(coords[0][0])) ? coords : [coords];
        const isEau = (targetGroup === GROUPS.eauLigne);
        const isParc=(targetGroup === GROUPS.parcLigne);
        const isVert = (targetGroup === GROUPS.espacesverts);
        const isRue = (targetGroup === GROUPS.rues);
        const isPain = (targetGroup === GROUPS.ruePain);
        
        if (targetGroup === GROUPS.ruePain) {
        const secteurNom = "secteur" + item.Type;
        if (GROUPS[secteurNom]) {
            targetGroup = GROUPS[secteurNom];
            lineOptions = { 
            weight: 60,       
            opacity: 1, 
            color: finalColor, 
            interactive: true 
        };
        }
    }
        
        
        latlngs.forEach(seg => {
            let lineOptions;
            if (targetGroup === GROUPS.rues) {
                lineOptions = { ...CONFIG.styles.rueInvisible, interactive: true };
             }   
           else if (targetGroup === GROUPS.eauLigne || targetGroup === GROUPS.parcLigne ) {
            lineOptions = { ...CONFIG.styles.rueInvisible, interactive: true };
            }
            
            else if (isPain) {
             lineOptions = { 
            weight: 6,       
            opacity: 0.9, 
            color: finalColor, 
            interactive: true 
        };
    }
            else {
                lineOptions = { ...CONFIG.styles.lineDefault, color: finalColor, interactive: true };
            }

            const line = L.polyline(seg, lineOptions).addTo(targetGroup);
            layer = line;

            if (targetGroup === GROUPS.voieferree) {
                applyRailStyle(line);
            } 
            else if (props && line.setText && isRue) {
                line.setText(props, { 
                    center: true, 
                    offset: -1,
                    attributes: { fill: "#000000", "font-size": "13px", "opacity": 1 } 
                });
            }
            else if (props && line.setText && isEau) {
            
            line.setText(props, { 
                center: true, 
                offset: -1,
                attributes: {     
                        fill: "#0f4c81", 
                        "font-size": "17px", 
                        "font-weight": "bold",
                        "letter-spacing": "2px"
                    } 
            });
            }
            
          
             else if (props && line.setText && isParc) {
            
            line.setText(props, { 
                center: true, 
                offset: -1,
                attributes: {     
                        fill: "#1A3013", 
                        "font-size": "14px", 
                        "font-weight": "bold",
                        "letter-spacing": "2px"
                    } 
            });
            }

            
        });
    }

   if (layer && props && targetGroup !== GROUPS.village && targetGroup !== GROUPS.eauLigne && targetGroup !== GROUPS.rues && targetGroup !== GROUPS.parcLigne ) {
        layer.bindTooltip(props);
    }
}

// Chargeur générique
async function loadLayerData(filename, targetGroup, color) {
    try {
        const response = await fetch(`polygones/${filename}.json`);
        const data = await response.json();
        data.forEach(item => processGeometry(item, targetGroup, color));
    } catch (e) {
        console.error(`Erreur chargement ${filename}:`, e);
    }
}



/* =========================================
   5. INTERFACE (SIDEBAR & POPUPS)
   ========================================= */

// Contrôle Nord personnalisé
const NorthControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = "<span style='font-size:25px;margin-left:7px;'>&#8593;</span><br/>Nord<br/>";
        return div;
    }
});
map.addControl(new NorthControl());

// Sidebar
const sidebar = L.control.sidebar('sidebar', { position: 'left' }).addTo(map);

let windowObjectReference = null;
function openRequestedPopup(link, windowName) {
    if (windowObjectReference && !windowObjectReference.closed) {
        windowObjectReference.close();
    }
    windowObjectReference = window.open(link, windowName, "popup,left=100,top=100,width=820,height=680");
    if(windowObjectReference) windowObjectReference.focus();
}

function switchSideBarPhoto(photo) {
    const images = photo.images || (photo.image ? [photo.image] : []);
    const total = images.length;
    const auteurHtml = photo.auteur 
        ? `<p><strong>Auteur :</strong> ${photo.auteur}</p>` 
        : '';

    const carouselId = 'carousel-' + photo.id;
    // ← on stocke les URLs en data-attribute pour éviter les problèmes de guillemets
    const imagesData = encodeURIComponent(JSON.stringify(images));

    const content = `
        <div class="photo-popup-header">
            <span class="photo-popup-date">${photo.date || ''}</span>
            <h2 class="photo-popup-titre">${photo.titre}</h2>
        </div>

        <div class="carousel" id="${carouselId}" data-images="${imagesData}">
            <div class="carousel-track">
                ${images.map((url, i) => `
                    <img src="${url}"
                         class="carousel-img"
                         data-index="${i}"
                         onclick="openLightboxFromCarousel('${carouselId}', ${i})"
                         onerror="this.src='leaflet/images/no-image.png'"/>
                `).join('')}
            </div>
            ${total > 1 ? `
            <button class="carousel-btn prev" onclick="moveCarousel('${carouselId}', -1)">&#10094;</button>
            <button class="carousel-btn next" onclick="moveCarousel('${carouselId}',  1)">&#10095;</button>
            <div class="carousel-counter">
                <span id="${carouselId}-index">1</span> / ${total}
            </div>` : ''}
        </div>

        <div style="padding: 0 5px; margin-top:8px;">
            <p style="font-style:italic; color:#444;">${photo.legende}</p>
            <hr/>
            <p><strong>Source :</strong> ${photo.source}</p>
            ${auteurHtml}
        </div>`;

    sidebar.setContent(content);
    if (!sidebar.isVisible()) sidebar.show();
}

async function loadPhotos() {
    
    try {
        const response = await fetch('./polygones/photos.json');
        const data = await response.json();

        data.forEach(photo => {
            if (!photo.geometryProperty) return;

            

            L.marker(photo.geometryProperty, { icon: ICONS.camera})
                .on('click', () => switchSideBarPhoto(photo))
                .addTo(GROUPS.photos);
        });

    } catch(e) {
        console.error('Erreur loadPhotos:', e);
    }
}

// Carousel dans la sidebar
function moveCarousel(id, direction) {
    const carousel = document.getElementById(id);
    const imgs = carousel.querySelectorAll('.carousel-img');
    const counter = document.getElementById(id + '-index');
    let current = parseInt(carousel.dataset.current || 0);

    current = (current + direction + imgs.length) % imgs.length;
    carousel.dataset.current = current;

    carousel.querySelector('.carousel-track').style.transform = 
        `translateX(-${current * 100}%)`;
    
    if (counter) counter.textContent = current + 1;
}

function openLightboxFromCarousel(carouselId, startIndex) {
    const carousel = document.getElementById(carouselId);
    const images = JSON.parse(decodeURIComponent(carousel.dataset.images));
    openLightbox(images, startIndex);
}

// Lightbox avec carousel
function openLightbox(images, startIndex = 0) {
    if (typeof images === 'string') images = [images]; // rétrocompat
    let current = startIndex;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    overlay.innerHTML = `
        <div class="lightbox-inner" onclick="event.stopPropagation()">
            <img class="lightbox-img" src="${images[current]}"/>
            ${images.length > 1 ? `
            <button class="lightbox-btn prev" id="lb-prev">&#10094;</button>
            <button class="lightbox-btn next" id="lb-next">&#10095;</button>
            <div class="lightbox-counter">
                <span id="lb-index">${current + 1}</span> / ${images.length}
            </div>` : ''}
        </div>`;

    document.body.appendChild(overlay);

    // Fermeture au clic sur le fond
    overlay.addEventListener('click', () => document.body.removeChild(overlay));

    // Navigation
    const updateImg = () => {
        overlay.querySelector('.lightbox-img').src = images[current];
        const idx = overlay.querySelector('#lb-index');
        if (idx) idx.textContent = current + 1;
    };

    const prevBtn = overlay.querySelector('#lb-prev');
    const nextBtn = overlay.querySelector('#lb-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { current = (current - 1 + images.length) % images.length; updateImg(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { current = (current + 1) % images.length; updateImg(); });

    // Navigation clavier
    const onKey = (e) => {
        if (e.key === 'ArrowLeft') { current = (current - 1 + images.length) % images.length; updateImg(); }
        if (e.key === 'ArrowRight') { current = (current + 1) % images.length; updateImg(); }
        if (e.key === 'Escape') { document.body.removeChild(overlay); document.removeEventListener('keydown', onKey); }
    };
    document.addEventListener('keydown', onKey);
}

/* =========================================
   6. INITIALISATION AUTOMATISÉE
   ========================================= */

// Liste des fichiers à charger
const LAYERS_CONFIG = [
    { file: "brest-ghetto", group: GROUPS.ghetto, color: CONFIG.colors.ghetto },
    { file: "brest-hors-ghetto", group: GROUPS.ghetto, color: CONFIG.colors.ghetto },
    { file: "eau", group: GROUPS.eau, color: CONFIG.colors.eau },
    { file: "espaces-verts", group: GROUPS.espacesverts, color: CONFIG.colors.vert },
    { file: "citadelle", group: GROUPS.citadelle, color: CONFIG.colors.citadelle },
    { file: "village", group: GROUPS.village, color: CONFIG.colors.village },
    { file: "cimetiere", group: GROUPS.cimetiere, color: CONFIG.colors.cimetiere },
    { file: "pont", group: GROUPS.pont, color: CONFIG.colors.pont },
    { file: "hopital", group: GROUPS.hopital, color: CONFIG.colors.hopital },
    { file: "abri", group: GROUPS.abri, color: CONFIG.colors.abri },
    
    { file: "equipement", group: GROUPS.equipement, color: getCOULEURSInfra }, 
    { file: "rues", group: GROUPS.rues, color: CONFIG.colors.rue },
    { file: "eauLigne", group: GROUPS.eauLigne, color: CONFIG.colors.eau },
    { file: "parcLigne", group: GROUPS.parcLigne, color: CONFIG.colors.vert },
    { file: "association", group: GROUPS.association, color: CONFIG.colors.association},
    { file: "entreprise", group: null, color: null },
    { file: "voie-ferree", group: GROUPS.voieferree, color: null },
    
    { file: "allemand", group:null, color: null },
    { file: "pointPain", group: GROUPS.pointPain, color: getCouleurSpeciale },
    
    { file: "ruePain", group: GROUPS.ruePain, color: getCouleurSpeciale },
   
    
    { file: "lieux_de_culte", group: null, color: null } // Cas spécial traité dans processGeometry
];



// Arbre des couches pour le contrôle
const overlaysTree = {
     label: "<span class='title'>Brest-Litovsk</span>",
    
    children: [
        
        
         { label: "<span class='tree-section-header'>AVANT 1941</span>" ,
         children:[
         { label: "Infrastructures ancienne ( avant 1941 )", layer: GROUPS.infra_before },
      /*
      {
            label: "Infrastructures ",
            selectAllCheckbox: true, 
            children: [
                { label: "Avant 1941", layer: GROUPS.infra_before },
               
                { label: "Nouvelles infrastructures (1941 : occupation allemande)", layer: GROUPS.infra_during }
            ]
        },*/
        
        { label: "Association juive ", layer: GROUPS.association },
        
        
        
        
        {
            label: "Entreprises",
            selectAllCheckbox: true,
            collapsed: true,
            children: [
                { label: "Commerçants & Artisans", layer: GROUPS.entCommercant },
                { label: "Construction & Matériaux", layer: GROUPS.entConstruction },
                { label: "Production alimentaire", layer: GROUPS.entAlimentaire },
                { label: "Biens manufacturés", layer: GROUPS.entManufacture },
                { label: "Imprimerie & Reliure", layer: GROUPS.entImprimerie },
                { label: "Travail du bois", layer: GROUPS.entBois }
            ]
        },
        { label: "Photo historique ", layer: GROUPS.photos },
        
           ]
        },
        { label: "<span class='tree-section-header header-red'>SOUS L'OCCUPATION</span>",
        children: [
         { label: "Infrastructures nouvelle: occupation allemande ", layer: GROUPS.infra_during},
        {
            label: "Occupation Allemande",
            selectAllCheckbox: true,
            collapsed: true,
            children: [
                { label: "Administration", layer: GROUPS.allemandAdministration },
                { label: "Administration militaire", layer: GROUPS.allemandAdministrationMilitaire },
                { label: "Organisation de l'armée d'occupation/ Logistique", layer: GROUPS.allemandLogistic },
                { label: "Organisation TODT", layer: GROUPS.allemandTODT },
                { label: "Infrastructure transport", layer: GROUPS.allemandTransport },
                { label: "Aéroport", layer: GROUPS.allemandPlane },
                { label: "Armement/Défense", layer: GROUPS.allemandMilitaire },
                
                { label: "Maintien de l'ordre", layer: GROUPS.allemandOrdre }
            ]
        },
        { label: "Abri antiaérien", layer: GROUPS.abri },
        
        { label: "Carte Historique 1942", layer: GROUPS.planHistorique },
        {
        label: "Réseau de distribution du pain à la population juive",
        selectAllCheckbox: true,
        collapsed: true,
        children: [
            { label: "Secteur 1", layer: GROUPS.secteur1 },
            { label: "Secteur 2", layer: GROUPS.secteur2 },
            { label: "Secteur 3", layer: GROUPS.secteur3 },
            { label: "Secteur 4", layer: GROUPS.secteur4 },
            { label: "Secteur 5", layer: GROUPS.secteur5 },
            { label: "Secteur 6", layer: GROUPS.secteur6 },
            { label: "Secteur 7", layer: GROUPS.secteur7 },
            { label: "Secteur 8", layer: GROUPS.secteur8 },
            { label: "Secteur 9", layer: GROUPS.secteur9 },
            { label: "Secteur 10", layer: GROUPS.secteur10 },
            { label: "Secteur 11", layer: GROUPS.secteur11 }
            ]
        }
      ]
      }
       
        
        
    ]
};
map.on('zoomend', function() {
    const container = map.getContainer();
    const zoom = Math.floor(map.getZoom());
    
    // On nettoie les anciennes classes de zoom (ex: leaflet-zoom-14)
    container.className = container.className.replace(/\bleaflet-zoom-\d+\b/g, '');
    
    // On ajoute la nouvelle classe (ex: leaflet-zoom-15)
    container.classList.add('leaflet-zoom-' + zoom);
    
    console.log("Classe ajoutée au conteneur : leaflet-zoom-" + zoom);
});
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Lancement de tous les chargements en parallèle
    const promises = LAYERS_CONFIG.map(cfg => loadLayerData(cfg.file, cfg.group, cfg.color));
    promises.push(loadPhotos());
    await Promise.all(promises);

    // 2. Ajout du contrôle des couches (Tree)
    if (L.control.layers.tree) {
        L.control.layers.tree({}, overlaysTree, { collapsed: false }).addTo(map);
    } else {
        console.warn("Plugin 'L.control.layers.tree' manquant");
    }

    // 3. Écouteur pour mettre à jour la légende quand on coche/décoche
    map.on('overlayadd overlayremove', function() {
        updateLegend();
    });

    // 4. APPEL INITIAL : Pour afficher la légende si des couches sont actives au chargement
    updateLegend();
});
