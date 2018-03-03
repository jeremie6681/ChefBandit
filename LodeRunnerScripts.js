//lodeRunnerScripts.js
//philippe Doyon & jeremie Lapointe
// 2 mars 2018
var intTailleCases = 30 ;
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
     ]
function initTableau(objC2d){
  
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