//https://www.openstreetmap.org/#map=13/52.0808/23.6979&layers=Y
var map = new L.map('map').setView([52.0889, 23.6979], 14);
// http://{s}.tile.osm.org/{z}/{x}/{y}.png
L.tileLayer('', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom:19,
    maxZoom:25
    }).addTo(map);

var myWindow;
var north = L.control({position: "topleft"});
north.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = "<span style='font-size:25px;margin-left:7px;'>&#8593;</span><br/>Nord<br/>";
    return div;
}
north.addTo(map);

L.control.scale({metric:true,imperial:false}).addTo(map);
var sidebar 
function addCoords(layerGrp,boundaries,color) {
    for (var e = 0, len = boundaries.length; e < len; ++e)
    {
	coords = boundaries[e].geometryProperty;
	properties = boundaries[e].Properties
	firstPoint = coords[0];
	lastPoint = coords[coords.length-1];

	if (coords.length > 0 && (firstPoint.toString() == lastPoint.toString())) {
	    var polygon=L.polygon(coords).addTo(layerGrp);
	    polygon.custId = boundaries[e].fid
	    polygon.custName = boundaries[e].fid
	    polygon.setStyle({weight: '1'});
	    polygon.setStyle({color: color});
	    polygon.setStyle({fillColor: color});
	    polygon.setStyle({fillOpacity:0.25,opacity:0.30});
	    polygon.bindTooltip(properties)
	    polygon.on("click", function(e) {var id = e.target.custId;var cname = e.target.custName;switchSideBar(sidebar,id,cname)})

	} else {
	    var polyline=L.polyline(coords).addTo(layerGrp);
	    polyline.setStyle({weight: '1'});
	    polyline.setStyle({color: color});
	    polyline.setStyle({fillColor: color});
	    polyline.setText(properties, {repeat: false, center:true, attributes: {fill: "#000000","font-size": "13px"}});
	    //polyline.bindTooltip(properties)
	}
    }
}

var windowObjectReference = null; // variable globale
function openRequestedPopup(link,windowName) {
    if (windowObjectReference != null) {
	windowObjectReference.close();
    }
    
    if (windowObjectReference == null || windowObjectReference.closed) {
	/* si le pointeur vers l'objet window n'existe pas
	   ou s'il existe mais que la fenêtre a été fermée */
	let windowFeatures = "popup,left=100,top=100,width=820,height=680";
	windowObjectReference = window.open(
            link,
            windowName,
            windowFeatures
	);
	/* on le crée. La nouvelle fenêtre sera créée et affichée
	   par-dessus les éventuelles autres fenêtres. */
    } else {
	windowObjectReference.focus();
	/* sinon la référence existe et la fenêtre n'est pas fermée
	   on peut donc l'amener devant avec la méthode focus()
	   sans avoir à recréer la fenêtre ou à recharger la 
	   ressource référencée. */
    }
}

function switchSideBar(sidebar,id,name) {
    var visible = sidebar.isVisible();
    var currentName = name
    var liste = []
    var links = []
    var values = ""
    var nodes = document.getElementById(id).childNodes
    for (var i = 0; i < nodes.length; ++i) {
	liste[i] = nodes[i].textContent
	links[i] = nodes[i].href
    }

    for (var i = 0; i < liste.length; ++i) {
	values = values+"<li><a target='Habitant' onclick='openRequestedPopup(this.href, this.target); return false;' href='"+links[i]+"'>"+liste[i]+"</a></li>"
    }

    if(liste.length == 1) {
	var habitants = "habitant"
    } else {
	var habitants = "habitants"
    }
    
    var content = "<h2>"+liste.length+" "+habitants+"</h2><ul>"+values+"</ul>"//+" à "+currentName+"</h2><ul>"+values+"</ul>"

    if(!visible) {
	sidebar.setContent(content);
	sidebar.show();
    }
    else {
	sidebar.hide();
	sidebar.setContent(content);
	sidebar.show();
    }
}

async function getBoundaries(file) {
    const response = await fetch("./polygones/"+file+".json");
    let boundaries = await response.json();
    return boundaries
}

var ghetto = L.layerGroup();
var rues = L.layerGroup();
var eau = L.layerGroup();
var espacesverts = L.layerGroup();
var citadelle = L.layerGroup();
var cimetiere = L.layerGroup();
var equipement = L.layerGroup();
var habillage = L.layerGroup();
var hopital = L.layerGroup();
var voieferree = L.layerGroup();

document.addEventListener("DOMContentLoaded", function(event){
    getBoundaries("brest-ghetto").then((boundaries) => { addCoords(ghetto, boundaries,'#D15A5ACF') })
    getBoundaries("brest-hors-ghetto").then((boundaries) => { addCoords(ghetto, boundaries,'#AFAFAF') })
    getBoundaries("eau").then((boundaries) => { addCoords(eau, boundaries,'#64AFEF') })
    getBoundaries("espaces-verts").then((boundaries) => { addCoords(espacesverts, boundaries,'#439627') })
    getBoundaries("citadelle").then((boundaries) => { addCoords(citadelle, boundaries,'#AFAFAF') })
    getBoundaries("cimetiere").then((boundaries) => { addCoords(cimetiere, boundaries,'#AFAFAF') })
    getBoundaries("hopital").then((boundaries) => { addCoords(cimetiere, boundaries,'#E55757') })
    getBoundaries("equipement").then((boundaries) => { addCoords(equipement, boundaries,'#5A7421') })
    getBoundaries("habillage").then((boundaries) => { addCoords(equipement, boundaries,'#EFEFEF') })
    getBoundaries("rues").then((boundaries) => { addCoords(rues, boundaries,'#ffffff') })
    getBoundaries("voie-ferree").then((boundaries) => { addCoords(rues, boundaries,'#000000FF') })

    habillage.addTo(map);    
    ghetto.addTo(map);    
    rues.addTo(map);
    voieferree.addTo(map);
    eau.addTo(map);
    espacesverts.addTo(map);
    citadelle.addTo(map);
    hopital.addTo(map);
    cimetiere.addTo(map);
    equipement.addTo(map);

    
    sidebar = L.control.sidebar('sidebar', {
	position: 'left'
    });
    map.addControl(sidebar);
    
});



