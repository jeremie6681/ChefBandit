//lodeRunnerScripts.js
//philippe Doyon & jeremie Lapointe
// 2 mars 2018

var objCanvas = null;
var objC2D = null;
var objJoueur = null;
var objSons = null;
var tabObjGardien = null;
var objTextures= null;
var intNiveau = 1;//est stocker dans objpointage
var objPointage = null;
var objDateHeureDepart = null;
var tabObjTrou = new Array();
var tabGrilleAi = null;

const intTailleCases = 30 ;
const intTailleTableauX = 28;
const intTailleTableauY = 17;
var tabObjMurs = null;
var tableau =[
    [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,4],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,4],
    [0,0,1,0,0,0,0,3,3,3,1,0,0,0,0,1,4],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,4],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,3,3,1,4],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,4],
    [0,0,1,0,0,0,0,1,0,0,1,0,0,1,0,1,4],
    [0,0,3,3,3,3,3,1,0,0,1,0,0,1,0,1,4],
    [0,0,1,2,0,0,0,0,0,0,1,0,0,1,0,1,4],
    [0,0,1,2,0,0,0,0,0,0,3,3,3,1,0,1,4],
    [0,0,1,2,0,0,0,0,0,0,1,0,2,1,0,1,4],
    [0,0,1,2,0,0,0,0,0,0,1,0,2,0,0,1,4],
    [0,0,1,2,1,1,1,1,0,0,1,0,2,0,0,1,4],
    [0,0,1,2,1,1,1,1,0,0,1,0,2,0,0,1,4],
    [0,0,1,2,3,3,3,1,0,0,1,0,2,0,0,1,4],
    [0,0,0,2,0,0,0,1,0,0,1,0,2,0,0,1,4],
    [0,0,0,2,0,0,0,1,0,0,1,0,2,0,0,1,4],
    [0,0,0,2,0,0,0,1,0,0,1,0,2,0,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,1,0,2,0,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,1,0,2,0,0,1,4],
    [0,0,0,0,1,0,0,3,3,3,3,3,3,1,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,4],
    [0,0,0,0,3,3,3,1,0,0,0,0,0,1,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,1,4],
    [0,0,0,0,1,0,0,1,0,0,0,0,0,3,3,1,4]
    ];

/* //pas sur
const Direction = {
    HAUT: new Position(0,-1),
    BAS: new Position(0,1),
    GAUCHE: new Position(-1,0),
    DROITE: new Position(1,0), 
}

class Position {
    constructor(X,Y) {
        this.X = X;
        this.Y = Y;
    }
}*/

//true -> Joueur / false -> Gardien
class Personnage {
    constructor(booType) {
        this.intNbLingoOr = 0;
        this.booChuteLibre = false;
        //Personnage Joueur
        if(booType) {
            this.intID = 20;
            this.intPositionX = 14;
            this.intPositionY = 15;
            this.couleur = 'white';
        }
        //Personnage Gardien
        else {
            this.intID = (tabObjGardien.length + 30);
            this.couleur = 'purple'; //tempo

            var booPositionValide = false;
            while(!booPositionValide) {
                this.intPositionX = Math.floor(Math.random() * 28) + 1;
                this.intPositionY = Math.floor(Math.random() * 13) + 1;
                booPositionValide = this.estSurPlateForme() && (tableau[this.intPositionX - 1][this.intPositionY - 1] == 0);
            }
        }
    }

    estSurPlateForme() {
        return (tableau[this.intPositionX - 1][this.intPositionY] == 1);
    }

    estEnChuteLibre() {
        this.booChuteLibre = (((tableau[this.intPositionX - 1][this.intPositionY] == 0) || (tableau[this.intPositionX - 1][this.intPositionY] == 2)) && (tableau[this.intPositionX - 1][this.intPositionY - 1] != 2));
        
        return this.booChuteLibre;
        //return (((tableau[this.intPositionX - 1][this.intPositionY] == 0) || (tableau[this.intPositionX - 1][this.intPositionY] == 2)) && (tableau[this.intPositionX - 1][this.intPositionY - 1] != 2));
    }

    //Si true-> booFaitDeplacement : fait le déplacement si valide
    deplacementPossible(intFuturX,intFuturY, booFaitDeplacement) {
        var booPossible = true;
        try {
            var intContenuEndroitFutur = tableau[(this.intPositionX + intFuturX) -1][(this.intPositionY + intFuturY) -1];

            //Si monte
            if ((intFuturY == -1) && (tableau[this.intPositionX-1][this.intPositionY-1] != 3))
                booPossible = false;
            //si descent
            else if ((intFuturY == 1) && ((intContenuEndroitFutur != 3) && (intContenuEndroitFutur != 0)))
                booPossible = false;
            //si gauche ou droite
            else if ((intFuturX != 0) && (intContenuEndroitFutur == 1))
                booPossible = false;

        } catch (error) {
            //est en dépassement de tableau
            booPossible = false;
        }

        if(booFaitDeplacement && booPossible && !this.booChuteLibre) {
            this.deplacement(intFuturX,intFuturY);
        }

        return booPossible;
    }

    deplacement(intFuturX,intFuturY) {
        this.intPositionX += intFuturX;
        this.intPositionY += intFuturY;
    }

    //true -> gauche / false -> droite
    creuserPossible(booDirection) {
        return (tableau[this.intPositionX + (booDirection ? -2 : 0)][this.intPositionY] == 1);
    }
}

class trou {
    constructor(intPositionX, intPositionY) {
        this.intPositionX = intPositionX;
        this.intPositionY = intPositionY;
        this.objDateHeureTrou = new Date();
    }
    
}

function initAnimation(Canvas){
    objCanvas = Canvas;
    objCanvas.focus();
    objC2D = objCanvas.getContext('2d');

    initPointage();
    initTextures();
    initPersonnage();
    initMurs();
    
    dessiner();
    animer();
}

function initTextures(){
    
    objTextures = new Object();
    //texture briques
    var objImage = new Image();
    objImage.src = 'textures/brique.png';
    objTextures.brique = objImage;

    objImage = new Image();
    objImage.src = 'textures/echelle.png';
    objTextures.echelle = objImage;

    objImage = new Image();
    objImage.src = 'textures/bloc.png';
    objTextures.bloc = objImage;

    objImage = new Image();
    objImage.src = 'textures/barre.png';
    objTextures.barre = objImage;
}

function initMurs() {
    tabObjMurs = new Array();
    var objMur = null;

    // Le mur de gauche (#0)
    objMur = new Object();
    objMur.intXDebut = 0;
    objMur.intYDebut = 0;
    objMur.intXFin = 30;
    objMur.intYFin = objCanvas.height
    objMur.strCouleur = 'darkgrey';
    tabObjMurs.push(objMur);

    // Le mur du centre (en haut) (#1)
    objMur = new Object();
    objMur.intXDebut = 0;
    objMur.intYDebut = 0;
    objMur.intXFin = objCanvas.width;
    objMur.intYFin = 30;
    objMur.strCouleur = 'darkgrey';
    tabObjMurs.push(objMur);

    // Le mur de droite (#2)
    objMur = new Object();
    objMur.intXDebut = objCanvas.width;
    objMur.intYDebut = 0;
    objMur.intXFin = objCanvas.width - 30;
    objMur.intYFin = objCanvas.height;
    objMur.strCouleur = 'darkgrey';
    tabObjMurs.push(objMur);
    //mur bas
    objMur = new Object();
    objMur.intXDebut = 0;
    objMur.intYDebut = objCanvas.height;
    objMur.intXFin = objCanvas.width;
    objMur.intYFin = objCanvas.height -30;
    objMur.strCouleur = 'darkgrey';
    tabObjMurs.push(objMur);
}

function initPersonnage() {
    //Joueur
    objJoueur = new Personnage(true);

    tabObjGardien = new Array();
    //Gardien
    for(var intIndex = 0; intIndex<(objPointage.niveau * 3); intIndex++) {
        tabObjGardien.push(new Personnage(false));
    }
}

function initPointage(){
    objPointage = new Object();
    objPointage.score = 0;
    objPointage.scoreNiveauPrec = 0 ;
    objPointage.vies = 5;
    objPointage.niveau = 1;
    objPointage.tempsNiveauSeconde = ajouteZeros(0);
    objPointage.tempsNiveauMinute = ajouteZeros(0);
}
function initSons() {
    objSons = new Object();

    var objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonFinirUnNiveau.wav');
    objSon.load();
    objSons.finirNiveau = objSon;

  
    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonBlocRemplit.wav');
    objSon.load();
    objSons.remplirBloc = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonCreuser.wav');
    objSon.load();
    objSons.creuser = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonGardeMeurt.mp3');
    objSon.load();
    objSons.gardeMeurt = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonGardeTombeTrou.mp3');
    objSon.load();
    objSons.gardeTombeTrou = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonLodePertVie.wav');
    objSon.load();
    objSons.lodePerdVie = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonOr');
    objSon.load();
    objSons.or = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonPerdreToutesSesVieswav');
    objSon.load();
    objSons.perdreToutesVies = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonTomber.mp3');
    objSon.load();
    objSons.tomber = objSon;
}

// Un cycle d'animation	
function animer() {
    // Requête pour le prochain cycle
    objCycleAnimation = requestAnimationFrame(animer);
    // Le cycle d'animation
    effacerDessin();
    mettreAjourAnimation();
    dessiner();
}

// Arrêter l'animation
function arreterAnimation() {
    if (objCycleAnimation != null)
        cancelAnimationFrame(objCycleAnimation);
    objCycleAnimation = null;
}
    
// Pour effacer le dessin
function effacerDessin() {
    objC2D.clearRect(0,0, objCanvas.width, objCanvas.height); 
}
    
// Pour mettre à jour l'animation
function mettreAjourAnimation() {
    //gereDeplacementJoueur();
    personnageEnChuteLibre();
    mettreAJourPointage();
    
}

//Pour l'instant c'est seulement le chronometre qui est mis à jour ...
function mettreAJourPointage() {
    if (objDateHeureDepart != null) {
        //Temps
        var objDateheureMaintenant = new Date();
        var intMsEcoulees = objDateheureMaintenant - objDateHeureDepart;
        
        objPointage.tempsNiveauSeconde = ajouteZeros(Math.round((((intMsEcoulees % 3600000) % 60000) / 1000)));
        objPointage.tempsNiveauMinute = ajouteZeros(Math.floor((intMsEcoulees % 3600000) / 60000));
    }
    
}

//Vérifie si un trou doit etre refermer
function mettreAJourTrou() {
    var objDateheureMaintenant = new Date();
    tabObjTrou.forEach( element => {
        var intSecondeEcouler = Math.round((((objDateheureMaintenant - element.objDateHeureTrou % 3600000) % 60000) / 1000))
        if (intSecondeEcouler == 4) {
            //refermerTrou(element);
            //element
        }
    })
}

//Referme un trou
function refermerTrou() {

}

function personnageEnChuteLibre() {
    //Joueur
    if (objJoueur.estEnChuteLibre()) {
        objJoueur.deplacement(0,1);
    }

    tabObjGardien.forEach(objGardien => {
        if (objGardien.estEnChuteLibre()) {
            objGardien.deplacement(0,1);
        }
    });
}

//gauche -> true / droite -> false
function creuser(booDirection) {
    //vérifie que le trou n'existe pas déjà
    var objNouveauTrou = new trou(objJoueur.intPositionX + (booDirection ? -1 : 1),objJoueur.intPositionY + 1);

    var objTrouExiste = tabObjTrou.find(function(element) {
        return ((objNouveauTrou.intPositionX == element.intPositionX) && (objNouveauTrou.intPositionY == element.intPositionY));
    });

    //creuse
    if (objTrouExiste == null) {
        tabObjTrou.push(objNouveauTrou);
    }    
}


function dessiner() {
    
    objC2D.fillStyle = 'black';
    objC2D.beginPath();
    objC2D.fillRect(0,0, objCanvas.width, objCanvas.height);
    
    dessinerTableau(); 
    dessinerMurs();
    dessinePersonnage();
    dessinerPointage();
    dessinerTrou();
}

function dessinerTableau(){
  
    for (var intCasesX =0;intCasesX<28;intCasesX++){
        for (var intCasesY =0;intCasesY<17;intCasesY++){
            switch(tableau[intCasesX][intCasesY]){
                case 1:

                    //objC2D.fillStyle='red';
                    //objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    objC2D.drawImage(objTextures.brique, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases) 
                    break;
                case 2:
                   //objC2D.fillStyle='blue';
                   //objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                   objC2D.drawImage(objTextures.barre, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases)               
                    break;
                case 3:
                    //objC2D.fillStyle='yellow';
                    //objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    objC2D.drawImage(objTextures.echelle, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases) 
                    break;
                case 4:
                    // objC2D.fillStyle='grey';
                    // objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    objC2D.drawImage(objTextures.bloc, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases) 
                    break;
            }
        }
    }
}
    
function dessinerMurs(){
    objC2D.save();
    objC2D.globalAlpha = 0.8;

    for (var intNoMur = 0; intNoMur < tabObjMurs.length; intNoMur++) {
        var objMur = tabObjMurs[intNoMur];
        var intCentreX = (objMur.intXDebut + objMur.intXFin) / 2;
        var intCentreY = (objMur.intYDebut + objMur.intYFin) / 2;
        var intRayon = ((intNoMur == 1)||(intNoMur ==3)) ? Math.abs(objMur.intXFin - objMur.intXDebut) / 2 : Math.abs(objMur.intYFin - objMur.intYDebut) / 2;
        var objDegrade = objC2D.createRadialGradient(intCentreX, intCentreY, 0, intCentreX, intCentreY, intRayon);
        objDegrade.addColorStop(0, 'white');
        objDegrade.addColorStop(1, objMur.strCouleur);
        objC2D.fillStyle = objDegrade;
        objC2D.beginPath();
        objC2D.moveTo(objMur.intXDebut, objMur.intYDebut);
        objC2D.lineTo(objMur.intXFin, objMur.intYDebut);
        objC2D.lineTo(objMur.intXFin, objMur.intYFin);
        objC2D.lineTo(objMur.intXDebut, objMur.intYFin);
        objC2D.closePath();
        objC2D.fill();
    }
    objC2D.restore();
}

function dessinePersonnage() {
    //Joueur
    objC2D.fillStyle='white';
    objC2D.fillRect(((objJoueur.intPositionX - 1)*intTailleCases)+30,((objJoueur.intPositionY - 1)*intTailleCases)+30,intTailleCases,intTailleCases);

    //Garde
    tabObjGardien.forEach(element => {
        objC2D.fillStyle = element.couleur;
        objC2D.fillRect(((element.intPositionX - 1)*intTailleCases)+30,((element.intPositionY - 1)*intTailleCases)+30,intTailleCases,intTailleCases);
    });
}

function dessinerPointage(){
    objC2D.save();
    var strTextePointage= "Vies : "+objPointage.vies + "     Niveau : " + objPointage.niveau + "    Pointage : " + objPointage.score +"     Temps : "+objPointage.tempsNiveauMinute + ":" + objPointage.tempsNiveauSeconde;
    
    objC2D.fillStyle = 'white';
    objC2D.font = '30px Arial';
    objC2D.textBaseLine = 'middle';
    objC2D.textAlign = 'center';
    objC2D.fillText(strTextePointage,objCanvas.width/2,18*intTailleCases + 60);
    objC2D.restore();

}

function dessinerTrou() {
    tabObjTrou.forEach(element => {
        objC2D.fillStyle = "orange";
        objC2D.fillRect(((element.intPositionX - 1)*intTailleCases)+30,((element.intPositionY - 1)*intTailleCases)+30,intTailleCases,intTailleCases);
    });
}

//function gereActionJoueur(keyCode) {
function gereDeplacementJoueur(keyCode) {
    switch(keyCode) {
        case 37: // Flèche-à-gauche
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            objJoueur.deplacementPossible(-1,0,true);
            break;
        case 38: // Flèche-en-haut
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            objJoueur.deplacementPossible(0,-1,true);
            break;
        case 39: // Flèche-à-droite
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            objJoueur.deplacementPossible(1,0,true);
            break;
        case 40: // Flèche-en-bas
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            objJoueur.deplacementPossible(0,1,true);
            break;
        case 88: //x
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            if (objJoueur.creuserPossible(false))
-                creuser(false);

            break;
        case 90: //z
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            if (objJoueur.creuserPossible(true))
-                creuser(true);

            break;
    }
}
//Ajoute un zéro à gauche si le nombre envoyé est un chiffre 
function ajouteZeros(intValeur) {
    return (intValeur < 10 ? '0' : '') + intValeur;
}
//utilise l'algorithme A* pour le pathfinding des gardes
//retourne null si aucun chemin est trouvé ou un array contenant
// le chemin le plus court entre le garde et lode 
function trouverDeplacementGarde(intNoIndexGarde){
    var tempsDebut =Date.now();
     var solution = null;
     var openList =[]; //liste des nodes que l'on considere visiter
     var closedList =[];//liste des Nodes visitees
     var pointDepart = new Object();
     var but = new Object();
     but.intX = objJoueur.intPositionX;
     but.intY = objJoueur.intPositionY;
 
     pointDepart.intX=tabObjGardien[intNoIndexGarde].intPositionX;
     pointDepart.intY=tabObjGardien[intNoIndexGarde].intPositionY;
     pointDepart.f= Number.MAX_VALUE;
     pointDepart.g = 0;
     pointDepart.h= null;
     pointDepart.parent = null;
     openList.push(pointDepart)
 
     while (openList.length>0){
         var intPlusBas=0;
       
         for(var i=0; i<openList.length; i++) {
           if(openList[i].f < openList[intPlusBas].f) { 
               intPlusBas = i; 
             }
         }
         var nodeActuelle = openList[intPlusBas];
 
         //si solution trouver 
         if(nodeActuelle.intX == but.intX&&nodeActuelle.intY == but.intY) {
             var c = nodeActuelle;
             var cheminTrouver = [];
             while(c.parent) {
               cheminTrouver.push(c);
               c = c.parent;
             }
             boofini= true;
             solution = cheminTrouver.reverse();
         }
           //cas normal 
           openList.splice(intPlusBas,1);
           closedList.push(nodeActuelle);
           var tabVoisins =trouverVoisins(nodeActuelle);
         
           for (var i = 0 ;i<tabVoisins.length;i++){
             var voisin = tabVoisins[i]
             var intGScore = nodeActuelle.g+1;
             var booMeilleurG = false;  
 
             if (!voisinDejaVisite(closedList,voisin)){
                 booMeilleurG = true;
                 voisin.h = calculerHeuristique(voisin, but);
                 openList.push(voisin)
             }
             else if (intGScore<voisin.g){
                 booMeilleurG = true;
             }
             if (booMeilleurG){
                 voisin.parent = nodeActuelle;
                 voisin.g = intGScore;
                 voisin.f=voisin.g+voisin.h;
             }
           }
     }
     console.log(Date.now()-tempsDebut+" milisecondes");
     return solution ;
 }
 //retourne les case dans lesquelles 
 //il est possible de faire un mouvement 
 //qui sont autour de la case reçue
 function trouverVoisins(nodeActuelle){
     var tabVoisins = [];
     var node = new Object();
         if(nodeActuelle.intY>0){
         if(tableau[nodeActuelle.intX][nodeActuelle.intY-1]==3||(tableau[nodeActuelle.intX][nodeActuelle.intY]==3 && tableau[nodeActuelle.intX][nodeActuelle.intY]==0)){
             node = new Object();
             node.intX = nodeActuelle.intX;
             node.intY = nodeActuelle.intY -1;
             node.f= Number.MAX_VALUE;
             node.g = nodeActuelle+1;
             node.h= null;
             node.parent = null;
             tabVoisins.push(node);
 
         }
     }
  
         //vers le bas
         if(nodeActuelle.intY<intTailleTableauY){
         if(tableau[nodeActuelle.intX][nodeActuelle.intY+1]!=1 && tableau[nodeActuelle.intX][nodeActuelle.intY+1]!=4){
             node = new Object();
             node.intX =nodeActuelle.intX;
             node.intY =nodeActuelle.intY+1;
             node.f= Number.MAX_VALUE;
             node.g = nodeActuelle+1;
             node.h= null;
             node.parent = null;
             tabVoisins.push(node);
         } 
     }
   
         //vers la droite
         if(nodeActuelle.intX<intTailleTableauX-1){
         if(tableau[nodeActuelle.intX+1][nodeActuelle.intY]!=1 && tableau[nodeActuelle.intX+1][nodeActuelle.intY+1]!=0){
             node = new Object();
             node.intX = nodeActuelle.intX +1;
             node.intY = nodeActuelle.intY;
             node.f= Number.MAX_VALUE;
             node.g = nodeActuelle+1;
             node.h= null;
             node.parent = null;
             tabVoisins.push(node);
             
         }
     }
         if(nodeActuelle.intX>0){
         if(tableau[nodeActuelle.intX -1][nodeActuelle.intY]!=1 && tableau[nodeActuelle.intX-1][nodeActuelle.intY+1]!=0){ 
             node = new Object();
             node.intX = nodeActuelle.intX -1;
             node.intY = nodeActuelle.intY;
             node.f= Number.MAX_VALUE;
             node.g = nodeActuelle+1;
             node.h= null;
             node.parent = null;
             tabVoisins.push(node);
         }
     }
     return tabVoisins;
 }
 function voisinDejaVisite(closeSet,voisin){
     var booDejaVisite = false ;
     closeSet.forEach(function(e){
         (e.intX == voisin.intX&&e.intY == voisin.intY)?booDejaVisite=true:booDejaVisite=booDejaVisite;
     });
     return booDejaVisite;
 }
 function calculerHeuristique(voisin,but){
     return (Math.abs(but.intX-voisin.intX)+Math.abs(but.intY-voisin.intY))
 }
 