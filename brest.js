var windowObjectReference = null; // variable globale
function openRequestedPopup(link,windowName) {
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
