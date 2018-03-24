//lodeRunnerScripts.js
//philippe Doyon & jeremie Lapointe
// 2 mars 2018

var objCanvas = null;
var objC2D = null;
var objJoueur = null;
var objSons = null;
var objTextures= null;
var objPointage = null;
var objCycleAnimation = null;
var ObjAnimationsGarde= null;
var ObjAnimationsLode = null;

var objDateHeureDepart = null;

const intTailleCases = 30 ;
const intTailleTableauX = 28;
const intTailleTableauY = 17;

var tabObjMurs = null;
var tabObjTrou = null;
var tabGrilleAi = null;
var tabObjGardien = null;
var tabObjLingo = null;

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

//true -> Joueur / false -> Gardien
class Personnage {
    constructor(booType) {
        this.intNbLingoOr = 0;
        this.booChuteLibre = false;
        this.booBloquee = false;
        this.dateHeureTombeTrou = null;
        this.tabDirection =[0,0];
        this.booAnimationEnCour = false;
        
        this.fltOffsetX= 0;
        this.fltOffsetY= 0;
       // this.booDirection = false; //Pour les animations, Gauche -> True / Droit -> false

        //Personnage Joueur
        if(booType) {
            this.intID = 20;
            this.intPositionX = 14;
            this.intPositionY = 15;
           // this.couleur = 'white';
            this.animation= objAnimationsLode.immobileLode;
        }
        //Personnage Gardien
        else {
            var intNbGardienTableau = ((tabObjGardien.length == "undefined") ? 0 : tabObjGardien.length);
            this.intID = (intNbGardienTableau + 30);
            this.couleur = 'purple'; //tempo

            var booPositionValide = false;
            var x = 0;
            var y = 0;
            while(!booPositionValide) {
                x = Math.floor(Math.random() * 28) + 1;
                y = Math.floor(Math.random() * 13) + 1;
                booPositionValide = this.estSurPlateForme(x,y) && (tableau[x -1][y -1] == 0) && emplacementSansPersonnage(x, y);
            }
            
            this.intPositionX = x;
            this.intPositionY = y;
            this.animation= objAnimationsGarde.immobileGarde;
        }
        this.intPositionXFiniAnimation = this.intPositionX;
        this.intPositionYFiniAnimation = this.intPositionY;
    }

    estSurPlateForme() {
        return (tableau[this.intPositionX - 1][this.intPositionY] == 1);
    }

    estSurPlateForme(intX,intY) {
        return (tableau[intX - 1][intY] == 1);
    }

    //paramètre true => trou vide / paramètre false => trou plein
    estDansTrou(booEtat) {
        return (tableau[this.intPositionX - 1][this.intPositionY - 1] == (booEtat ? 5 : 6));
    }

    estSurLingo() {
        return ((tabObjLingo.findIndex(element => ((element.intPositionX == this.intPositionX) && (element.intPositionY == this.intPositionY))) == -1) ? false : true);
    }

    estEnChuteLibre() {
        console.log(this.intPositionX + " x " + this.intPositionY + " Y");
        this.booChuteLibre = (((tableau[this.intPositionX - 1][this.intPositionY] == 0) || (tableau[this.intPositionX - 1][this.intPositionY] == 2)) && (tableau[this.intPositionX - 1][this.intPositionY - 1] != 2));
        
        return this.booChuteLibre || (tableau[this.intPositionX - 1][this.intPositionY] == 5) || (tableau[this.intPositionX - 1][this.intPositionY] == 7);
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

        if(booFaitDeplacement && booPossible && !this.booChuteLibre && !this.booBloquee) {
            this.deplacement(intFuturX,intFuturY);
            
        }
        else if (this.booChuteLibre){
            this.tabDirection=[0,1]
        }

        return booPossible;
    }

    deplacement(intFuturX,intFuturY) {
        this.intPositionXFiniAnimation += intFuturX;
        this.intPositionYFiniAnimation += intFuturY;
        this.booAnimationEnCour = true;
        this.booBloquee = true;
        
        //permet de mettre a jour la direction dans laquelle lode se deplace 
        if (intFuturX!=0||intFuturY!=0){
            this.tabDirection=[intFuturX,intFuturY]
            console.log(intFuturX+'     '+intFuturY);
        }
    }

    //true -> gauche / false -> droite
    //Gestion si sur brique, pas d'échelle em haut, pas de corde, pas de lingo ....
    creuserPossible(booDirection) {
        return ((tableau[this.intPositionX + (booDirection ? -2 : 0)][this.intPositionY] == 1) &&
                (tableau[this.intPositionX + (booDirection ? -2 : 0)][this.intPositionY - 1] == 0) && 
                ((tabObjLingo.findIndex(element => ((element.intPositionX == (this.intPositionX + (booDirection ? -1 : 1))) && 
                                                    (element.intPositionY == (this.intPositionY)))) == -1) ? true : false));
    }
}

class trou {
    constructor(intPositionX, intPositionY) {
        this.intPositionX = intPositionX;
        this.intPositionY = intPositionY;
        this.objDateHeureTrou = new Date();
        this.objPersonnageTrou = null;
        this.objDateHeureTomberTrou = null;
        this.booSupposerReferme = false; //Utilise quand un trou devrait etre refermer mais que le gardien ne peut réaparaitre

        tableau[this.intPositionX -1][this.intPositionY -1] = 5;
    }

    rempliTrou(objPersonnage) {
        this.objPersonnageTrou = objPersonnage;
        this.objDateHeureTomberTrou = new Date();
    }
    
}

class lingo {
    constructor(intPositionX, intPositionY) {
        this.intPositionX = intPositionX;
        this.intPositionY = intPositionY;
    }
}

function initAnimation(Canvas){
    objCanvas = Canvas;
    objCanvas.focus();
    objC2D = objCanvas.getContext('2d');

    initSons();
    initPointage();
    initTextures();
    initAnimationsLode();
    initAnimationsGardes();
    initPersonnage();
    initMurs();
    initLingo();
    initTrou();
  
    dessiner();
    animer();
}
//differentes images pour les 'animations' des gardes
function initAnimationsGardes(){
//load img sans or
    var objImageAnimEchl1 = new Image();
    objImageAnimEchl1.src = 'sprites/garde/gardeEchelle1.png';

    var objImageAnimEchl2 = new Image();
    objImageAnimEchl2.src = 'sprites/garde/gardeEchelle2.png';

    var objImageDefault = new Image();
    objImageDefault.src = 'sprites/garde/gardeImmobileLarge.png'; 
    
    var objImageBarreDroite = new Image();
    objImageBarreDroite.src = 'sprites/garde/gardeBarreDroite.png'; 

    var objImageBarreGauche = new Image();
    objImageBarreGauche.src = 'sprites/garde/gardeBarreGauche.png';

    var objImageTomber = new Image();
    objImageTomber.src = 'sprites/garde/gardeTomber.png';

    var objImageCourrirGauche = new Image();
    objImageCourrirGauche.src = 'sprites/garde/gardeCourrirGauche1.png';

    var objImageCourrirDroite = new Image();
    objImageCourrirDroite.src = 'sprites/garde/gardeCourrirDroite1.png';

  //load img avec or  

    var objImageAnimEchl1OR = new Image();
    objImageAnimEchl1OR.src = 'sprites/garde/gardeEchelle1OR.png';

    var objImageAnimEchl2OR = new Image();
    objImageAnimEchl2OR.src = 'sprites/garde/gardeEchelle2OR.png';

    var objImageDefaultOR = new Image();
    objImageDefaultOR.src = 'sprites/garde/gardeImmobileLargeOR.png'; 
  
    var objImageBarreDroiteOR = new Image();
    objImageBarreDroiteOR.src = 'sprites/garde/gardeBarreDroiteOR.png'; 

    var objImageBarreGaucheOR = new Image();
    objImageBarreGaucheOR.src = 'sprites/garde/gardeBarreGaucheOR.png';

    var objImageTomberOR = new Image();
    objImageTomberOR.src = 'sprites/garde/gardeTomberOR.png';

    var objImageCourrirGaucheOR = new Image();
    objImageCourrirGaucheOR.src = 'sprites/garde/gardeCourrirGauche1OR.png';

    var objImageCourrirDroiteOR = new Image();
    objImageCourrirDroiteOR.src = 'sprites/garde/gardeCourrirDroite1OR.png';

    objAnimationsGarde = new Object();
    objAnimationsGarde.courrirDroiteGarde = construireAnimationSprite(60,objImageCourrirDroite)
    objAnimationsGarde.courrirGaucheGarde =  construireAnimationSprite(60,objImageCourrirGauche)
    objAnimationsGarde.monterEchelleGarde =   construireAnimationSprite(60,objImageAnimEchl1)
    objAnimationsGarde.descendreEchelleGarde =    construireAnimationSprite(60,objImageAnimEchl2)
    objAnimationsGarde.barreDroiteGarde = construireAnimationSprite(60,objImageBarreDroite)
    objAnimationsGarde.barreGaucheGarde=  construireAnimationSprite(60,objImageBarreGauche)
    objAnimationsGarde.tomberGarde =  construireAnimationSprite(60,objImageTomber)
    objAnimationsGarde.immobileGarde= construireAnimationSprite(60,objImageDefault)

    //si ont de l'or
    objAnimationsGarde.courrirDroiteGardeOR = construireAnimationSprite(60,objImageCourrirDroiteOR)
    objAnimationsGarde.courrirGaucheGardeOR =  construireAnimationSprite(60,objImageCourrirGaucheOR)
    objAnimationsGarde.monterEchelleGardeOR =   construireAnimationSprite(60,objImageAnimEchl1OR)
    objAnimationsGarde.descendreEchelleGardeOR =    construireAnimationSprite(60,objImageAnimEchl2OR)
    objAnimationsGarde.barreDroiteGardeOR = construireAnimationSprite(60,objImageBarreDroiteOR)
    objAnimationsGarde.barreGaucheGardeOR=  construireAnimationSprite(60,objImageBarreGaucheOR)
    objAnimationsGarde.tomberGardeOR =  construireAnimationSprite(60,objImageTomberOR)
    objAnimationsGarde.immobileGardeOR= construireAnimationSprite(60,objImageDefaultOR)

}
//différentes images pour les 'animations' de lode
function initAnimationsLode(){

    var objImageEchelleLode = new Image();
    objImageEchelleLode.src = 'sprites/lode/lodeEchelle.png';

    var objImageDefault = new Image();
    objImageDefault.src = 'sprites/lode/lodeImmobile.png'; 
    
    var objImageBarreDroite = new Image();
    objImageBarreDroite.src = 'sprites/lode/lodeBarreDroite.png'; 

    var objImageBarreGauche = new Image();
    objImageBarreGauche.src = 'sprites/lode/lodeBarreGauche.png';

    var objImageTomber = new Image();
    objImageTomber.src = 'sprites/lode/lodeTomber.png';

    var objImageCourrirGauche = new Image();
    objImageCourrirGauche.src = 'sprites/lode/lodeCourrirGauche.png';

    var objImageCourrirDroite = new Image();
    objImageCourrirDroite.src = 'sprites/lode/lodeCourrirDroite.png';


    objAnimationsLode = new Object();
    objAnimationsLode.courrirDroiteLode = construireAnimationSprite(30,objImageCourrirDroite)
    objAnimationsLode.courrirGaucheLode =  construireAnimationSprite(30,objImageCourrirGauche)
    objAnimationsLode.echelleLode =   construireAnimationSprite(30,objImageEchelleLode)
    objAnimationsLode.barreDroiteLode = construireAnimationSprite(30,objImageBarreDroite)
    objAnimationsLode.barreGaucheLode=  construireAnimationSprite(30,objImageBarreGauche)
    objAnimationsLode.tomberLode =  construireAnimationSprite(30,objImageTomber)
    objAnimationsLode.immobileLode= construireAnimationSprite(30,objImageDefault)
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

    objImage = new Image();
    objImage.src = 'textures/or.png';
    objTextures.or = objImage;

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
    for(var intIndex = 0; intIndex<(objPointage.niveau + 2); intIndex++) {//+2 pour le 
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
    objSon.setAttribute('src', 'sons/sonLodePerdVie.wav');
    objSon.load();
    objSons.lodePerdVie = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonOr.wav');
    objSon.load();
    objSons.or = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonPerdreToutesSesVies.wav');
    objSon.load();
    objSons.perdreToutesVies = objSon;

    objSon = document.createElement('audio');
    objSon.setAttribute('src', 'sons/sonTomber.mp3');
    objSon.load();
    objSons.tomber = objSon;
}

function initLingo() {
    tabObjLingo = new Array();

    tabObjLingo.push(new lingo(5,2));
    tabObjLingo.push(new lingo(24,4));
    tabObjLingo.push(new lingo(22,7));
    tabObjLingo.push(new lingo(8,13));
    tabObjLingo.push(new lingo(25,13));
    tabObjLingo.push(new lingo(19,15));
}

function initTrou() {
    tabObjTrou = new Array();
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
    mettreAJourTrou();
    
    mettreAJourPointage();
    mettreAJourJoueur();
    mettreAjourGardes();
    mettreAJourLingo();
    personnageEnChuteLibre();
    mettreAJourNiveau();
}

function mettreAJourJoueur() {
    if ((Math.abs(objJoueur.fltOffsetX).toFixed(3) == 30.000) || (Math.abs(objJoueur.fltOffsetY).toFixed(3) == 30.000)) {
        objJoueur.intPositionX = objJoueur.intPositionXFiniAnimation;
        objJoueur.intPositionY = objJoueur.intPositionYFiniAnimation;
        objJoueur.fltOffsetX = 0;
        objJoueur.fltOffsetY = 0;
        objJoueur.booAnimationEnCour = false;
        objJoueur.booBloquee = false; //Peut etre faire d autre validation genre trou ....
    }
    
    if(objJoueur.booAnimationEnCour && (objJoueur.fltOffsetX == 0) && (objJoueur.fltOffsetY == 0)) {
        mettreAjourAnimationLode();
        objJoueur.fltOffsetX += (intTailleCases/objJoueur.animation.intDureeAnimation)*objJoueur.tabDirection[0];
        objJoueur.fltOffsetY += (intTailleCases/objJoueur.animation.intDureeAnimation)*objJoueur.tabDirection[1];
    }
    else if(objJoueur.booAnimationEnCour){
        objJoueur.fltOffsetX += (intTailleCases/objJoueur.animation.intDureeAnimation)*objJoueur.tabDirection[0];
        objJoueur.fltOffsetY += (intTailleCases/objJoueur.animation.intDureeAnimation)*objJoueur.tabDirection[1];
    }
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
        var intSecondeEcoulerTrou = Math.round((((objDateheureMaintenant - element.objDateHeureTrou % 3600000) % 60000) / 1000));

        if (intSecondeEcoulerTrou == 8 && !element.booSupposerReferme) {
            //Personne dans le trou et va mourir
            if (element.objPersonnageTrou != null) {
                var objPersoDansTrou = element.objPersonnageTrou;
                if (objPersoDansTrou.intID == 20) {
                    objPointage.vies--;
                    objPointage.score = objPointage.scoreNiveauPrec;
                    //Animation mort, son ??
                    reinitialiseNiveau();
                }
                else {
                    //Gardien point de départ
                    //Position aléatoire sur la ligne 2
                    objSons.gardeMeurt.play();
                    var booPositionValide = false;
                    var x;
                    var y;
                    while(!booPositionValide) {
                        x = Math.floor(Math.random() * 15) + 1;
                        y = 2;
                        booPositionValide = objPersoDansTrou.estSurPlateForme(x,y) && (tableau[x -1][y -1] == 0) && emplacementSansPersonnage(x,y);
                    }
                    
                    objPersoDansTrou.intPositionX = x;
                    objPersoDansTrou.intPositionY = y;
                    objPersoDansTrou.booBloquee = false;

                    //Point car garde meurt
                    objPointage.score += 75;
                }
            }
            refermerTrou(element);
        }
        //gardien dans trou mais va sortir
        else if (element.objPersonnageTrou != null && (element.objPersonnageTrou.intID != 20)) {
            var intSecondeEcoulerTombeTrou = Math.round((((objDateheureMaintenant - element.objPersonnageTrou.dateHeureTombeTrou % 3600000) % 60000) / 1000));
            
            if (intSecondeEcoulerTombeTrou == 4)
                element.booSupposerReferme = true;

            //Si personnage au point au dessu du trou quand doit réaparaitre, il attends
            if ((intSecondeEcoulerTombeTrou >= 4) && emplacementSansPersonnage(element.intPositionX, (element.intPositionY -1))) {
                element.objPersonnageTrou.intPositionX = element.intPositionX;
                element.objPersonnageTrou.intPositionY = (element.intPositionY - 1);
                element.objPersonnageTrou.booBloquee = false;

                refermerTrou(element);
            }
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
      
        if (!objSons.creuser.ended){
        objSons.creuser.pause();
        objSons.creuser.currentTime = 0;
        }
        objSons.creuser.play();
    }    
}

//Referme un trou
function refermerTrou(objTrou) {
    tabObjTrou.splice(tabObjTrou.indexOf(objTrou),1);
    tableau[objTrou.intPositionX - 1][objTrou.intPositionY - 1] = 1;
    objSons.remplirBloc.play();
}

function refermeToutLesTrous() {
    tabObjTrou.forEach(element => {
        tableau[element.intPositionX - 1][element.intPositionY - 1] = 1;
    });
}

//Chute libre et tomber dans un trou ...
function personnageEnChuteLibre() {
    //Joueur
    if (objJoueur.estEnChuteLibre()){
        objJoueur.deplacement(0,1);
        objSons.tomber.play();                     
    }
    else if (objJoueur.estDansTrou(true))
        tomberDansTrou(objJoueur);
    else{
        objSons.tomber.pause();
        objSons.tomber.currentTime = 0;
    }

    tabObjGardien.forEach(objGardien => {
        
        if (objGardien.estDansTrou(true)) {
            tomberDansTrou(objGardien);
        }
        else if (objGardien.estDansTrou(false)) {
            objGardien.booBloquee = true;
        }
    });
}

//Vérifie si la position est occupé par un autre personnage
function emplacementSansPersonnage(intX,intY) {
    var intIndexGardeSiPresent = tabObjGardien.findIndex(element => ((element.intPositionX == intX) && (element.intPositionY == intY)));

    return (!((objJoueur.intPositionX == intX) && (objJoueur.intPositionY == intY)) && (intIndexGardeSiPresent == -1));
}

function tomberDansTrou(objPersonnage) {

    tabObjTrou.forEach(element => {
        if ((objPersonnage.intPositionX == element.intPositionX) && (objPersonnage.intPositionY == element.intPositionY)) {
            objPersonnage.dateHeureTombeTrou = new Date();
            element.objPersonnageTrou = objPersonnage;
            tableau[element.intPositionX - 1][element.intPositionY - 1] = 6;

            if (objPersonnage.intID != 20)
                objPointage.score += 75;
            else {
                objPersonnage.booBloquee = true;
            }

            //Perte lingo si tombe dans vide
            if (objPersonnage.intNbLingoOr > 0 && objPersonnage.intID != 20) {
                objPersonnage.intNbLingoOr--;
                gestionStockLingo(true, element.intPositionX, element.intPositionY - 1 );
            }
        }
    });
}

function mettreAJourLingo() {
    //Joueur
    if (objJoueur.estSurLingo()) {
        objJoueur.intNbLingoOr++;
        objPointage.score += 250;

        if (!objSons.or.ended){
            objSons.or.pause();
            objSons.or.currentTime = 0;
            }
        objSons.or.play();
        gestionStockLingo(false, objJoueur.intPositionX, objJoueur.intPositionY);
    }

    //Gardien
    tabObjGardien.forEach(element => {
        if (element.estSurLingo()) {
            element.intNbLingoOr++;
            gestionStockLingo(false, element.intPositionX, element.intPositionY);
        }
    });
}


function mettreAJourNiveau() {
    //Si tout les lingos ramassés
    if ((objJoueur.intNbLingoOr == 6) && (objPointage.niveau < 10) && (tableau[18][0] == 0)) {
        //fait apparaitre échelle pour le prochain niveau
        echelleSortie(true);
    }
    else if (objJoueur.intPositionX == 19 && objJoueur.intPositionY == 1) {
        //Réinisiallise niveau
        objPointage.niveau++;
        objPointage.scoreNiveauPrec = objPointage.score;
        objSons.finirNiveau.play();
        reinitialiseNiveau();
    }
}

//True -> ajoute échelle | false -> retire échelle
function echelleSortie(booAjoutRetire) {
    var i;
    for (i =0; i< 4;i++) {
        tableau[18][i] = (booAjoutRetire ? 3 : 0);
    }
}
//remet le niveau à son état initial, 
//à utiliser quand lode meurt
function reinitialiseNiveau() {
    objDateHeureDepart = null;
    initPersonnage();
    initLingo();
    echelleSortie(false);
    refermeToutLesTrous();
    initTrou();

    objPointage.tempsNiveauSeconde = ajouteZeros(0);
    objPointage.tempsNiveauMinute = ajouteZeros(0);
}

//Ajoute ou enlève un lingo
//booAction = True -> ajout | false -> enlève
function gestionStockLingo(booAction, intPositionX, intPositionY) {
    if (booAction) {
        tabObjLingo.push(new lingo(intPositionX,intPositionY));
    }
    else {
        tabObjLingo.splice(tabObjLingo.findIndex(element => ((element.intPositionX == intPositionX) && (element.intPositionY == intPositionY))),1);
    }
}

function dessiner() {
    
    objC2D.fillStyle = 'black'; //couleur de fond du tableau
    objC2D.beginPath();
    objC2D.fillRect(0,0, objCanvas.width, objCanvas.height);
    
    dessinerTableau(); 
    dessinerMurs();
    dessinerLingo();
    dessinePersonnage();
    dessinerPointage();
    
    if (objPointage.vies<=0){
        gameOver();
    }
    else if (objJoueur.intNbLingoOr == 6 && objPointage.niveau == 10){
        gagnerPartie();
    }
}

function dessinerTableau(){
    var intCasesX;
    for (intCasesX =0;intCasesX<intTailleTableauX;intCasesX++){
        var intCasesY;
        for (intCasesY =0;intCasesY<intTailleTableauY;intCasesY++){
            switch(tableau[intCasesX][intCasesY]){
                case 1:
                    objC2D.drawImage(objTextures.brique, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases) 
                    break;
                case 2:
                   objC2D.drawImage(objTextures.barre, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases)               
                    break;
                case 3:
                    objC2D.drawImage(objTextures.echelle, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases) 
                    break;
                case 4:
                    objC2D.drawImage(objTextures.bloc, (intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases) 
                    break;
                case 5:
                case 6:
                    objC2D.save();
                    objC2D.fillStyle = "white";
                    objC2D.globalAlpha = 0.2;
                    objC2D.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                    objC2D.restore();
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
    //objC2D.fillStyle='white';
    //objC2D.fillRect(((objJoueur.intPositionX - 1)*intTailleCases)+30,((objJoueur.intPositionY - 1)*intTailleCases)+30,intTailleCases,intTailleCases);
    objC2D.drawImage(objJoueur.animation.image, ((objJoueur.intPositionX)*intTailleCases),((objJoueur.intPositionY)*intTailleCases),intTailleCases,intTailleCases);
    //Garde
    tabObjGardien.forEach(element => {
 
            objC2D.drawImage(element.animation.image, ((element.intPositionX)*intTailleCases)+element.fltOffsetX,((element.intPositionY)*intTailleCases)+element.fltOffsetY,intTailleCases,intTailleCases);
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

function dessinerLingo() {
    tabObjLingo.forEach(element => {
        objC2D.drawImage(objTextures.or, ((element.intPositionX)*intTailleCases),((element.intPositionY)*intTailleCases),intTailleCases,intTailleCases)});
}

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
                creuser(false);
            break;
        case 90: //z
            //Démarre chronomètre si partie commencer 
            objDateHeureDepart = (objDateHeureDepart == null) ? new Date() : objDateHeureDepart;
            if (objJoueur.creuserPossible(true))
                //alert("ttt");
                creuser(true);
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
    but.intX = objJoueur.intPositionX-1;
    but.intY = objJoueur.intPositionY-1;

    pointDepart.intX=tabObjGardien[intNoIndexGarde].intPositionX-1;
    pointDepart.intY=tabObjGardien[intNoIndexGarde].intPositionY-1;
    pointDepart.f= Number.MAX_VALUE;   //h+g
    pointDepart.g = 0;                  // score g distance du depart
    pointDepart.h= null;                // score h distance estimee du but
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
   // console.log(Date.now()-tempsDebut+" milisecondes");
    return solution ;
}
//retourne les case dans lesquelles 
//il est possible de faire un mouvement 
//qui sont autour de la case reçue
function trouverVoisins(nodeActuelle){
    var tabVoisins = [];
    var node = new Object();
    //vers le haut
    if(nodeActuelle.intY>0){
        if(tableau[nodeActuelle.intX][nodeActuelle.intY-1]==3||(tableau[nodeActuelle.intX][nodeActuelle.intY]==3 && tableau[nodeActuelle.intX][nodeActuelle.intY-1]==0)){
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
        if((tableau[nodeActuelle.intX+1][nodeActuelle.intY]!=1 && tableau[nodeActuelle.intX+1][nodeActuelle.intY+1]!=0 && tableau[nodeActuelle.intX][nodeActuelle.intY+1]!=2)||tableau[nodeActuelle.intX+1][nodeActuelle.intY]==2){
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
    //vers la gauche
    if(nodeActuelle.intX>0){
        if((tableau[nodeActuelle.intX -1][nodeActuelle.intY]!=1 && tableau[nodeActuelle.intX-1][nodeActuelle.intY+1]!=0&& tableau[nodeActuelle.intX][nodeActuelle.intY+1]!=2)||tableau[nodeActuelle.intX-1][nodeActuelle.intY]==2){ 
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
//retourne true si le voisin à déja été visité
function voisinDejaVisite(closeSet,voisin){
    var booDejaVisite = false ;
    closeSet.forEach(function(e){
        (e.intX == voisin.intX && e.intY == voisin.intY)?booDejaVisite=true:booDejaVisite=booDejaVisite;
    });
    return booDejaVisite;
}
//retoure un aproximation de la distance entre une node et le but
//ici une formule de distance entre 2 points est utilisée 
function calculerHeuristique(voisin,but){
    return (Math.abs(but.intX-voisin.intX)+Math.abs(but.intY-voisin.intY))
}

function mettreAjourGardes(){
 
    if (objDateHeureDepart != null){
        //pour meilleur performance du programme
            var i;
            var intDimention = tabObjGardien.length;
            for(i= 0 ; i<intDimention;i++){
                if (!tabObjGardien[i].booBloquee){
                    //Aplique déplacement car animation fini
                    if ((Math.abs(tabObjGardien[i].fltOffsetX).toFixed(3) == 30.000) || (Math.abs(tabObjGardien[i].fltOffsetY).toFixed(3) == 30.000)) {
                        tabObjGardien[i].intPositionX = tabObjGardien[i].intPositionXFiniAnimation;
                        tabObjGardien[i].intPositionY = tabObjGardien[i].intPositionYFiniAnimation;
                        tabObjGardien[i].booAnimationEnCour = false;
                    }

                    var tabDeplacement = trouverDeplacementGarde(i);
                    if(!tabObjGardien[i].booAnimationEnCour) {
                        if (tabDeplacement!=null){
                            if (tabDeplacement[0]!=null){
                                //savoir si le gardien doit tomber dans le trou
                                if (tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY]==5){
                                    tabObjGardien[i]
                                    tabObjGardien[i].intPositionY++;
                                    tabObjGardien[i].fltOffsetX = 0;
                                    tabObjGardien[i].fltOffsetY = 0;
                                    tabObjGardien[i].tabDirection = [0,0];
                                    objSons.gardeTombeTrou.play();
                                    tabObjGardien[i].booBloquee = true;
                                    tabObjGardien[i].intPositionXFiniAnimation =tabObjGardien[i].intPositionX;
                                    tabObjGardien[i].intPositionYFiniAnimation =tabObjGardien[i].intPositionY;
                                }
                                //colision entre le garde et lode
                                else if ((tabDeplacement[0].intX+1==objJoueur.intPositionX&&tabDeplacement[0].intY+1==objJoueur.intPositionY)){
                                    objPointage.vies --;
                                    reinitialiseNiveau();
                                    objSons.lodePerdVie.play();
                                }
                                // sinon bouge
                                else {
                                    if (!gardeVasMarcherSurAutreGarde(tabDeplacement[0].intX+1,tabDeplacement[0].intY+1)){
                                       
                                        tabObjGardien[i].fltOffsetX = 0;
                                        tabObjGardien[i].fltOffsetY = 0;
                                        tabObjGardien[i].tabDirection = [((tabDeplacement[0].intX+1)-tabObjGardien[i].intPositionX),((tabDeplacement[0].intY+1)-tabObjGardien[i].intPositionY)]
                                        tabObjGardien[i].animation.intNbrFrameDepuisDernierAnim =0;
                                        tabObjGardien[i].animation.intNbrFrameDepuisDernierFrame =0;
                                        
                                        mettreAjourAnimationGarde()
                                        tabObjGardien[i].intPositionXFiniAnimation = tabDeplacement[0].intX+1;
                                        tabObjGardien[i].intPositionYFiniAnimation = tabDeplacement[0].intY+1;
                                        tabObjGardien[i].booAnimationEnCour = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
    //mettre à jour les donées nescesaires aux animations
      var intIndex;
            var intDimentionTableauGarde = tabObjGardien.length;
            for(intIndex = 0; intIndex < intDimentionTableauGarde;intIndex++) {
                if (!((Math.abs(tabObjGardien[intIndex].fltOffsetX).toFixed(3) == 30.000) || (Math.abs(tabObjGardien[intIndex].fltOffsetY).toFixed(3) == 30.000))) {
                 tabObjGardien[intIndex].fltOffsetX += (intTailleCases/tabObjGardien[intIndex].animation.intDureeAnimation)*tabObjGardien[intIndex].tabDirection[0];
                 tabObjGardien[intIndex].fltOffsetY += (intTailleCases/tabObjGardien[intIndex].animation.intDureeAnimation)*tabObjGardien[intIndex].tabDirection[1];
             }
                tabObjGardien[intIndex].animation.intNbrFrameDepuisDernierAnim++;
                tabObjGardien[intIndex].animation.intNbrFrameDepuisDernierFrame++;
            }  
    }
}

//empeche les gardes d'occuper la meme case
//retourne un boolean qui indique si le mouvement qu'allait effectuer le garde
//le place sur un autre garde
function gardeVasMarcherSurAutreGarde(intX,intY){
    var booVasMarcherSurAutreGarde= false;
    tabObjGardien.forEach(function(e){

        booVasMarcherSurAutreGarde = (e.intPositionXFiniAnimation == intX && e.intPositionYFiniAnimation == intY) ? true: booVasMarcherSurAutreGarde;
    });
    return booVasMarcherSurAutreGarde;
}
//affiche un écrand 'game over'
function gameOver(){
    objSons.lodePerdVie.pause();
    arreterAnimation();
    console.log('game over');
    effacerDessin();
    objC2D.fillStyle='black'
    objC2D.fillRect(0,0,objCanvas.width,objCanvas.height)
    var strTexte ='game over';
    objC2D.fillStyle = 'red';
    objC2D.font = '80px Arial';
    objC2D.textBaseLine = 'middle';
    objC2D.textAlign = 'center';
    objC2D.fillText(strTexte,objCanvas.width/2,objCanvas.height/2);
    objSons.perdreToutesVies.play();
    


}
//fonction appelee lorsque les conditions de victoire sont atteintent
function gagnerPartie(){
    arreterAnimation();
    console.log('win');
    effacerDessin();
    objC2D.fillStyle='white'
    objC2D.fillRect(0,0,objCanvas.width,objCanvas.height)
    var strTexte ='vous avez passer tous les niveaux avec un score de '+objPointage.score;
    objC2D.fillStyle = 'blue';
    objC2D.font = '80px Arial';
    objC2D.textBaseLine = 'middle';
    objC2D.textAlign = 'center';
    objC2D.fillText(strTexte,objCanvas.width/2,objCanvas.height/2);
}
//construit les animations
function construireAnimationSprite(intDureeAnimation,image, intId){
    var objAnimation = new Object();

    objAnimation.image = image ;
    objAnimation.intDureeAnimation  = intDureeAnimation;
    objAnimation.intNbrFrameDepuisDernierAnim= intDureeAnimation;
    objAnimation.intNbrFrameDepuisDernierFrame= 0;

    return objAnimation;
}
//permet de detecter quelle animation le garde devrais effectuer
function mettreAjourAnimationGarde(){
    
    for(var i = 0 ;i<tabObjGardien.length;i++){
        //afficher le gardiern différament si il a de l'or
       if (tabObjGardien[i].intNbLingoOr>0){
         if (tabObjGardien[i].tabDirection[1]==-1){
                tabObjGardien[i].animation=objAnimationsGarde.monterEchelleGardeOR
            }
            else if (tabObjGardien[i].tabDirection[1]==1){
                if(tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY-1]==3){
                  tabObjGardien[i].animation=objAnimationsGarde.descendreEchelleGardeOR
                }
                else{
                    tabObjGardien[i].animation=objAnimationsGarde.tomberGardeOR
                }
            }
            else if (tabObjGardien[i].tabDirection[0] ==-1){
                if(tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY-1]==2){
                    tabObjGardien[i].animation=objAnimationsGarde.barreGaucheGardeOR
                }
                else{
                    tabObjGardien[i].animation=objAnimationsGarde.courrirGaucheGardeOR
                }
            }
            else if (tabObjGardien[i].tabDirection[0]==1){
                if(tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY-1]==2){
                    tabObjGardien[i].animation=objAnimationsGarde.barreDroiteGardeOR
                }
                else{
                    tabObjGardien[i].animation=objAnimationsGarde.courrirDroiteGardeOR
                }   
            }
            else {
                tabObjGardien[i].animation=objAnimationsGarde.immobileGardeOR
            }
    }
    //gardes sans or 
    else {
        if (tabObjGardien[i].tabDirection[1]==-1){
            tabObjGardien[i].animation=objAnimationsGarde.monterEchelleGarde
        }
        else if (tabObjGardien[i].tabDirection[1]==1){
            if(tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY-1]==3){
                tabObjGardien[i].animation=objAnimationsGarde.descendreEchelleGarde
            }
            else{
                tabObjGardien[i].animation=objAnimationsGarde.tomberGarde
            }
        }
        else if (tabObjGardien[i].tabDirection[0] ==-1){
            if(tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY-1]==2){
                tabObjGardien[i].animation=objAnimationsGarde.barreGaucheGarde
            }
            else{
                tabObjGardien[i].animation=objAnimationsGarde.courrirGaucheGarde
            }
        }
        else if (tabObjGardien[i].tabDirection[0]==1){
            if(tableau[tabObjGardien[i].intPositionX-1][tabObjGardien[i].intPositionY-1]==2){
                tabObjGardien[i].animation=objAnimationsGarde.barreDroiteGarde
            }
            else{
                tabObjGardien[i].animation=objAnimationsGarde.courrirDroiteGarde
            }
        }
        else {
            tabObjGardien[i].animation=objAnimationsGarde.immobileGarde
        }
    }
}
}
function mettreAjourAnimationLode(){
    if (objJoueur.tabDirection[1]==-1){
        objJoueur.animation=objAnimationsLode.echelleLode
    }
    else if (objJoueur.tabDirection[1]==1){
        if(tableau[objJoueur.intPositionX-1][objJoueur.intPositionY-1]==3){
            objJoueur.animation=objAnimationsLode.echelleLode
        }
        else{
            objJoueur.animation=objAnimationsLode.tomberLode
        }
    }
    else if (objJoueur.tabDirection[0] ==-1){
        if(tableau[objJoueur.intPositionX-1][objJoueur.intPositionY-1]==2){
            objJoueur.animation=objAnimationsLode.barreGaucheLode
        }
        else{
            objJoueur.animation=objAnimationsLode.courrirGaucheLode
        }
    }
    else if (objJoueur.tabDirection[0]==1){
        if(tableau[objJoueur.intPositionX-1][objJoueur.intPositionY-1]==2){
            objJoueur.animation=objAnimationsLode.barreDroiteLode
        }
        else{
            objJoueur.animation=objAnimationsLode.courrirDroiteLode
        }
    }
    else {
            objJoueur.animation=objAnimationsLode.immobileLode
    }
}

