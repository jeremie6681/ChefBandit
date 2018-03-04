//lodeRunnerScripts.js
//philippe Doyon & jeremie Lapointe
// 2 mars 2018

var objCanvas = null;
var objC2D = null;
var objJoueur = null;

var tabObjGardien = null;

var intNiveau = 1;

var intTailleCases = 30 ;
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

        //Personnage Joueur
        if(booType) {
            this.intID = 20;
            this.intPositionX = 14;
            this.intPositionY = 15;
            this.couleur = 'white';
            //tableau[this.intPositionX-1][this.intPositionY-1] = 20;
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
            //tableau[this.intPositionX-1][this.intPositionY-1] = 30;
        }
    }

    estSurPlateForme() {
        return (tableau[this.intPositionX - 1][this.intPositionY] == 1);
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
            else if ((intFuturY == 1) && (intContenuEndroitFutur != 3))
                booPossible = false;

        } catch (error) {
            //est en dépassement de tableau
            booPossible = false;
        }

        if(booFaitDeplacement && booPossible) {
            this.deplacement(intFuturX,intFuturY);
        }

        return booPossible;
    }

    deplacement(intFuturX,intFuturY) {
        this.intPositionX += intFuturX;
        this.intPositionY += intFuturY;
    }
}

function initAnimation(Canvas){
    objCanvas = Canvas;
    objCanvas.focus();
    objC2D = objCanvas.getContext('2d');

    initPersonnage();
    initMurs();
    initPointage();
    
    dessiner();
    animer();
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
    for(var intIndex = 0; intIndex<(intNiveau * 3); intIndex++) {
        tabObjGardien.push(new Personnage(false));
    }
}

function initPointage(){
    objPointage = new Object();
    objPointage.score = 0;
    objPointage.scoreNiveauPrec = 0 ;
    objPointage.tempsNiveau = 0;
    objPointage.tempsTotal = 0;
    objPointage.vies = 5;
    objPointage.niveau =1;
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
}

function dessiner() {
    
    objC2D.fillStyle = 'black';
    objC2D.beginPath();
    objC2D.fillRect(0,0, objCanvas.width, objCanvas.height);
    
    dessinerTableau(); 
    dessinerMurs();
    dessinePersonnage();
    dessinerPointage();      
}

function dessinerTableau(){
  
    for (var intCasesX =0;intCasesX<28;intCasesX++){
        for (var intCasesY =0;intCasesY<17;intCasesY++){
            switch(tableau[intCasesX][intCasesY]){
                case 1:
                    objC2D.fillStyle='red';
                    objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    break;
                case 2:
                    objC2D.fillStyle='blue';
                    objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    break;
                case 3:
                    objC2D.fillStyle='yellow';
                    objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    break;
                case 4:
                     objC2D.fillStyle='grey';
                     objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
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
    var strTextePointage= "Vies : "+objPointage.vies + "  Niveau : " + objPointage.niveau + " Pointage : " + objPointage.score +" Temps : "+objPointage.tempsNiveau;
    
    objC2D.fillStyle = 'white';
    objC2D.font = '20px Arial';
    objC2D.textBaseLine = 'middle';
    objC2D.textAlign = 'left';
    objC2D.fillText(strTextePointage,30,18*intTailleCases);
    objC2D.restore();

}

function gereDeplacementJoueur(keyCode) {
    switch(keyCode) {
        case 37: // Flèche-à-gauche
            objJoueur.deplacementPossible(-1,0,true);
            break;
        case 38: // Flèche-en-haut
            objJoueur.deplacementPossible(0,-1,true);
            break;
        case 39: // Flèche-à-droite
            objJoueur.deplacementPossible(1,0,true);
            break;
        case 40: // Flèche-en-bas
            objJoueur.deplacementPossible(0,1,true);
            break;
    }
}