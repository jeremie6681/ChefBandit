//lodeRunnerScripts.js
//philippe Doyon & jeremie Lapointe
// 2 mars 2018

var objCanvas = null;
var objC2D = null;

var intTailleCases = 30 ;
var tabObjMurs = null;
var objPointage = null;

    var tableau = [
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

function initAnimation(Canvas){
    objCanvas = Canvas;
    objC2D = objCanvas.getContext('2d');

    initMurs();
    dessiner();
}

function dessiner() {
    
    objC2D.fillStyle = 'black';
    objC2D.beginPath();
    objC2D.fillRect(0,0, objCanvas.width, objCanvas.height);
    
    dessinerTableau(objC2D); 
    dessinerMurs(objC2D);          
}

function dessinerTableau(objC2d){
  
    for (var intCasesX =0;intCasesX<28;intCasesX++){
        for (var intCasesY =0;intCasesY<17;intCasesY++){
            switch(tableau[intCasesX][intCasesY]){
                case 1:
                    objC2d.fillStyle='red';
                    objC2d.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                break;
                case 2:
                    objC2d.fillStyle='blue';
                    objC2d.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                break;
                case 3:
                    objC2d.fillStyle='yellow';
                    objC2d.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                break;
                case 4:
                     objC2d.fillStyle='grey';
                    objC2d.fillRect((intCasesX*intTailleCases)+30,(intCasesY*intTailleCases)+30,intTailleCases,intTailleCases);
                break;
            }
        }
    }
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

    function dessinerMurs(objC2D){
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
    function initPointage(){
        objPointage = new Object();
        objPointage.score = 0;
        objPointage.scoreNiveauPrec = 0 ;
        objPointage.tempsNiveau = 0;
        objPointage.tempsTotal = 0;
        objPointage.vies = 5;
        objPointage.niveau =1;
    }
    function dessinerPointage(objC2D){
        objC2D.save();
        var strTextePointage= "Vies : "+objPointage.vies + "  Niveau : " + objPointage.niveau + " Pointage : " + objPointage.score +" Temps : "+objPointage.tempsNiveau;
        
        objC2D.fillStyle = 'white';
        objC2D.font = '20px Arial';
        objC2D.textBaseLine = 'middle';
        objC2D.textAlign = 'left';
        objC2D.fillText(strTextePointage,30,18*intTailleCases);
        objC2D.restore();

    }