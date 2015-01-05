

// Start enchant.js
enchant();

var moveSpeed = 5;
var scene ;

var playerSheetPath = 'res/playerSheet.png';
var enemy1SheetPath = 'res/enemy1Sheet.png';
var enemy2SheetPath = 'res/enemy2Sheet.png';
var enemy3SheetPath = 'res/enemy3Sheet.png';
var enemy4SheetPath = 'res/enemy4Sheet.png';
var projectileSheetPath = 'res/projectile.png';
var starSheetPath = 'res/star.png';
var explosionSheetPath = 'res/explosionSheet.png';


var JOUEUR = 1;
var ENNEMY  = 2;

window.onload = function() {

        //source du code pour la taille de la fenêtre: http://java.scripts-fr.com/scripts.php?js=23
        var larg = (window.innerWidth);
        var haut = (window.innerHeight);

        console.log("Cette fenêtre fait " + larg + " de large et "+haut+" de haut"); 
        var hauteurBase = 620;
        var largeurBase = 400;

        // Starting point

        var scale;
        if(larg<largeurBase){
            scale = larg/largeurBase;
            hauteurBase=haut/scale;
        }
        else if(haut<hauteurBase){
            scale = haut/hauteurBase;                
        }
        else{
            scale=1;
        }

        var game = new Game(largeurBase, hauteurBase);
        game.preload(
           playerSheetPath,
           enemy1SheetPath,
           enemy2SheetPath,
           enemy3SheetPath,
           enemy4SheetPath,
           projectileSheetPath,
           starSheetPath,
           explosionSheetPath);

        game.fps = 60;
        game.scale=scale;
        game.onload = function() {
                // Once Game finish loading
                scene = new SceneGame();
                game.pushScene(scene);
                //scene.moveTo(50, 100); 
            }
            window.scrollTo(0,0);
            game.start();  

        };

/**
 * SceneGame  
 */
 var SceneGame = Class.create(Scene, {
        /**
         * The main gameplay scene.     
         */
         initialize: function() {
            var game, label, bg, penguin, iceGroup;
                // Call superclass constructor
                Scene.apply(this);

                // Access to the game singleton instance
                game = Game.instance;
                game.x=50;//larg/2-game.width/2;
                game.y=100;//   haut/2-game.height/2;

                this.backgroundColor = 'black';

                label = new Label('Score: 0');
                label.x = 5;
                label.y = 5;        
                label.color = 'white';
                label.font = '20px strong';
                label.textAlign = 'left';
                label._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
                this.scoreLabel = label;        

                shooting = new Label('Shooting: 0');
                shooting.x = game.width-shooting.width-7;
                shooting.y = 5;        
                shooting.color = 'white';
                shooting.font = '20px strong';
                shooting.textAlign = 'right';
                shooting._style.textShadow ="-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black";
                this.shooting = shooting;   

                penguin = new Penguin();
                penguin.x = game.width/2 - penguin.width/2;
                penguin.y = 2*game.height/3 - penguin.height/2;
                this.penguin = penguin;

                iceGroup = new Group();
                this.iceGroup = iceGroup;

                projectilesGroup = new Group();
                this.projectilesGroup = projectilesGroup;


                starGroup = new Group();
                this.starGroup = starGroup;

                //attention à l'ordre!!!!
                this.addChild(this.starGroup);
                this.addChild(projectilesGroup);
                this.addChild(iceGroup);        
                this.addChild(penguin);
                this.addChild(penguin.projectileGroup);        
                this.addChild(label);
                this.addChild(shooting);

                this.addEventListener(Event.TOUCH_MOVE,this.handleTouchControl);
                this.addEventListener(Event.ENTER_FRAME,this.update);

                // Instance variables
                this.generateIceTimer = 0;
                this.generateStars = 0;
                this.score = 0;
                this.shoot = 0;
                this.vitesseEnnemy = 7;
                this.vitesseProjCarre = 16;
                this.deltaShoot = 1.6;
                this.deltaAppartion = 2.0;
                this.deltaAppartionStar = 0.8;


            },

            handleTouchControl: function (evt) {
                this.penguin.x = evt.x;
                this.penguin.y = evt.y;
                if(this.penguin.shootPossible==true){
                    this.penguin.shoot();
                }
            },

            update: function(evt) {

                this.generateIceTimer += evt.elapsed * 0.001;
                this.generateStars += evt.elapsed * 0.001;
                if(this.generateStars>= this.deltaAppartionStar)
                {
                    star = new Star();
                    this.starGroup.addChild(star);
                    this.generateStars=0;
                    if(this.score>=15 && this.score<30){
                        this.deltaAppartionStar = 0.6;
                    }
                    else if(this.score>=30){
                        this.deltaAppartionStar = 0.4;
                    }

                }
                if(this.generateIceTimer >= this.deltaAppartion)
                {
                    var ice;
                    this.generateIceTimer = 0;



                    if(this.deltaShoot>0.19)
                        this.deltaShoot -= 0.02;

                    if(this.score<15){
                        ice = new Ice(4,1, this.deltaShoot, this.vitesseProjCarre);
                    }
                    else if(this.score>=15 && this.score<30){
                        if(this.deltaAppartion>0.75)
                            this.deltaAppartion -= 0.029;
                        ice = new Ice(5,Math.floor(Math.random()*2)+1, this.deltaShoot, this.vitesseProjCarre);
                    }
                    else if(this.score>=30 && this.score<45){
                        if(this.deltaAppartion>0.75)
                            this.deltaAppartion -= 0.029;
                        if(this.vitesseEnnemy<16)
                            this.vitesseEnnemy+=0.1;
                        ice = new Ice(this.vitesseEnnemy,Math.floor(Math.random()*3)+1, this.deltaShoot, this.vitesseProjCarre); 
                    }
                    else if(this.score>=45 && this.score<55){
                        if(this.deltaAppartion>0.75)
                            this.deltaAppartion -= 0.023;
                        
                        if(this.vitesseEnnemy<16)
                            this.vitesseEnnemy+=0.1;

                        ice = new Ice(this.vitesseEnnemy,Math.floor(Math.random()*4)+1, this.deltaShoot, this.vitesseProjCarre); 
                    }
                    else{
                        if(this.deltaAppartion>0.75)
                            this.deltaAppartion -= 0.023;

                        if(this.vitesseEnnemy<11)
                            this.vitesseEnnemy+=0.15;

                        if(this.vitesseProjCarre<30)
                            this.vitesseProjCarre += 0.5;
                        ice = new Ice(this.vitesseEnnemy,Math.floor(Math.random()*4)+1, this.deltaShoot, this.vitesseProjCarre);
                    }

                    this.iceGroup.addChild(ice);
                }

                var game;
                game = Game.instance;

                    // Check collision

                    for (var k = this.projectilesGroup.childNodes.length - 1; k >= 0; k--){
                        var iceProjectile;
                        iceProjectile = this.projectilesGroup.childNodes[k];
                        if(iceProjectile.intersect(this.penguin)){
                            this.penguin.destroyed(iceProjectile);      
                            break;
                        }
                    }
                    for (var i = this.iceGroup.childNodes.length - 1; i >= 0; i--) {
                        var ice;
                        ice = this.iceGroup.childNodes[i];

                        if(ice.intersect(this.penguin)){  
                           this.penguin.destroyed(ice, JOUEUR);
                           break;
                       }

                       for (var j = this.penguin.projectileGroup.childNodes.length - 1; j >= 0; j--){
                         var projectile;
                         projectile = this.penguin.projectileGroup.childNodes[j];
                         if(projectile.intersect(ice)){
                            ice.destroyed(projectile);
                        }
                    }
                }
        },

        setScore: function (value) {
            this.score = value;
            this.scoreLabel.text = 'Score: ' + this.score;
        },  
        setShoot: function (value) {
            this.shoot = value;
            this.shooting.text = 'Shooting: ' + this.shoot;
        } 
    });

/**
 * Penguin
 */
 var Penguin = Class.create(Sprite, {

    /**
     * The player character.     
     */     
     initialize: function() {
        var projectileGroup;
        var shootDuration;
        var shootPossible = true;
        // Call superclass constructor
        Sprite.apply(this,[51, 70]);
        this.image = Game.instance.assets[playerSheetPath];        
        this.animationDuration = 0;
        this.shootDuration = 0;
        this.addEventListener(Event.ENTER_FRAME, this.updateAnimation);
        this.addEventListener(Event.ENTER_FRAME, this.canShoot);

        projectileGroup = new Group();
        this.projectileGroup = projectileGroup;

        // Key Binding
        // Access to the game singleton instance
        var game = Game.instance;
        game.keybind(65, 'left');
        game.keybind(68, 'right');
        game.keybind(87, 'up');
        game.keybind(83, 'down');
        game.keybind(32 , 'a');
    },

    updateAnimation: function (evt) {        
        this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >= 0.25)
        {
            this.frame = (this.frame + 1) % 2;
            this.animationDuration -= 0.25;
        }
    },


    onenterframe: function() {
            //04.2 Keyboard Input
            var game = Game.instance;
            if (game.input.left && !game.input.right && this.x>0) {
                this.tx = this.x -= moveSpeed;
            } else if (game.input.right && !game.input.left && this.x+this.width<game.width) {
                this.tx = this.x += moveSpeed;
            }

            if (game.input.up && !game.input.down && this.y>0) {
                this.ty = this.y -= moveSpeed;
            } else if (game.input.down && !game.input.up && this.y+this.height<game.height) {
                this.ty = this.y += moveSpeed;
            }

            //shoot
            if(game.input.a && this.shootPossible==true){
              this.shoot();
          }       
      },

      canShoot: function(evt) {
        var delta=0.22;
        this.shootDuration = this.shootDuration +evt.elapsed * 0.001;       
        if(this.shootDuration >= delta) {
            this.shootPossible = true;
        }
        else{
           this.shootPossible = false;
       }
   },

   shoot: function(){
    var p = new Projectile(this.x, this.y, this.width, JOUEUR);
    this.projectileGroup.addChild(p);
    this.shootDuration = 0 ;
    this.parentNode.shoot++;
    this.parentNode.setShoot(this.parentNode.shoot);
},

destroyed: function(proj) {
    var game = Game.instance;
    explo = new Explostion(this.x, this.y, JOUEUR);
    this.parentNode.addChild(explo);
    proj.parentNode.removeChild(proj);
    this.parentNode.removeChild(this);
}

});

 /**
 * Ice Cube
 */
 var Ice = Class.create(Sprite, {
    /**
     * The obstacle that the penguin must avoid
     */
     initialize: function(vitesse, type, deltaShoot, vitesseProjoCarre) {

        this.animationDuration = 0;
        this.delta=0.1;
        this.deltaBase = deltaShoot;
        this.vitesseProjCarre = vitesseProjoCarre;

        switch(type){
            case 1:
            Sprite.apply(this,[60, 56]);
            this.image  = Game.instance.assets[enemy1SheetPath];
            break;
            case 2:
            Sprite.apply(this,[85, 67]);
            this.image  = Game.instance.assets[enemy2SheetPath];                
            break;
            case 3:
            Sprite.apply(this,[104, 78]);
            this.image  = Game.instance.assets[enemy3SheetPath];
            break;
            case 4:
            Sprite.apply(this,[72, 68]);
            this.image  = Game.instance.assets[enemy4SheetPath];
            break;
            default:
            Sprite.apply(this,[85, 67]);
            this.image  = Game.instance.assets[enemy2SheetPath];
            break;
        } 

        this.typee = type;
        this.vitesse=vitesse;

        this.rotationSpeed = 0;
        this.setLane();
        this.addEventListener(Event.ENTER_FRAME, this.update);
        this.cpt=0;
        this.dir=this.angleX=Math.random()*2-1;
    },

    setLane: function() {
        var game, distance;
        game = Game.instance;        

        this.x = this.width/2 + Math.floor(Math.random()*(game.width-10)+5)-this.width;
        this.y = -this.height/1.75;    
    },

    update: function(evt) { 
        var ySpeed, game;

        game = Game.instance;
        ySpeed = this.vitesse*20;
        this.y += ySpeed * evt.elapsed * 0.001;

        if(this.typee==4){
            if(this.dir>0){
                this.x -=1.5;
            }
            else{
                this.x +=1.5;
            }
            
            this.cpt++;
            if(this.cpt==100 || this.x<-10 || this.x+this.height>game.width+10){
                this.dir=-this.dir;
                this.cpt=0;
            }
        }

        if(this.y > game.height)
        {
            this.parentNode.removeChild(this);  
            //console.log('dcfnv')        
        }
        this.shoot(evt);
    },

    shoot: function(evt) {

        this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >=  this.delta)
        {
            //console.log(this.vitesseProjCarre)
            var p = new Projectile(this.x, this.y, this.width, ENNEMY, this.vitesseProjCarre, this.typee);
            this.parentNode.parentNode.projectilesGroup.addChild(p);
            this.delta = (Math.random() * this.deltaBase*1.5) + this.deltaBase/1.5; 
            this.animationDuration = 0;
        }
    },
    destroyed: function(proj) {
        var game = Game.instance;
        this.parentNode.parentNode.setScore(this.parentNode.parentNode.score + 1);
        this.parentNode.parentNode.penguin.projectileGroup.removeChild(proj);
        explo = new Explostion(this.x, this.y, ENNEMY);
        this.parentNode.parentNode.addChild(explo);
        this.parentNode.removeChild(this);

    }
});

var Projectile = enchant.Class.create(enchant.Sprite, {

    /**type:
        1- sur les cotés angle fixe
        2- tout droit
        3- angle random
        **/
        initialize: function(x,y, parentWidth, faction, vitesse, type)
        {
        //this.vitesse = vitesse;
        var game = Game.instance;
        this.camp = faction;
        Sprite.apply(this,[12, 12]);
        this.image = Game.instance.assets[ projectileSheetPath]; // set image
        
        this.y = y+5; 
        this.x = x+parentWidth/2-(this.width)/2;

         //console.log(vitesse);

         if(this.camp == 2){

         //console.log(type)
         switch(type){
            case 1:
                this.angleX=Math.floor(Math.random()*2);//Math.random()*4-2;
                if(this.angleX==0)
                    this.angleX=-1;
                this.angleY=Math.sqrt(vitesse-Math.pow(this.angleX,2));
                break;
                case 2:
                this.angleX=0
                this.angleY=Math.sqrt(vitesse);
                break;
                case 3:
                this.angleX=Math.random()*4-2;
                this.angleY=Math.sqrt(vitesse-Math.pow(this.angleX,2));
                break;
                case 4:
                this.angleX=Math.random()*2-1;
                this.angleY=Math.sqrt(vitesse-Math.pow(this.angleX,2));
                break;
                default:
                this.angleX=0
                this.angleY=Math.sqrt(vitesse);
                break;

            }    
        }
        this.frame = 15;                   // set image data
        this.addEventListener(Event.ENTER_FRAME,this.update);
    },

    update: function(evt) {
        if(this.camp == 1){//joueur
            this.moveBy(0, -6, 0);
            if(this.y<this.parentNode.parentNode.y-50){
               this.parentNode.removeChild(this);
           }
       }
       else if(this.camp == 2){
        this.y+=this.angleY;
        this.x+=this.angleX;
        if(this.y>this.parentNode.parentNode.height){
           this.parentNode.removeChild(this);   
        //           
    }
}
}
});

var Explostion = enchant.Class.create(enchant.Sprite, {

    initialize: function(x,y, faction) {
        var game = Game.instance;
        Sprite.apply(this,[60, 60]);
        this.image = Game.instance.assets[explosionSheetPath]; // set image        
        this.y = y;
        this.x = x;
        this.cpt=0;   
        this.faction=faction;              
        this.addEventListener(Event.ENTER_FRAME,this.update);
        this.animationDuration=0
    },

    update: function(evt) {
        this.animationDuration += evt.elapsed * 0.001;       
        if(this.animationDuration >= 0.06)
        {
            this.frame = (this.frame + 1);
            this.animationDuration =0;
            this.cpt +=1;
            if(this.cpt==5)
            {
                if(this.faction==JOUEUR){
                    var game = Game.instance;
                    
                    game.replaceScene(new SceneGameOver(this.parentNode.score,this.parentNode.shoot));   
                }
                this.parentNode.removeChild(this);
            }
        }
    }
});


var Star = enchant.Class.create(enchant.Sprite, {

    initialize: function(x,y, faction) {
        var game = Game.instance;
        Sprite.apply(this,[32, 32]);
        this.image = Game.instance.assets[starSheetPath]; // set image        
        this.y = 0;
        this.x = Math.random()*game.width-this.width;
        this.vitesse = Math.random()*2+7;
        this.frame = 15;                   // set image data
        var scalee = Math.random()*0.45+0.10;
        this.scale(scalee,scalee);
        this.addEventListener(Event.ENTER_FRAME,this.update);
    },

    update: function(evt) {
        this.moveBy(0, this.vitesse, 0);
        if(this.y>this.parentNode.parentNode.height){
           this.parentNode.removeChild(this);
           //console.log('sta DESTROY')
       }
   }

});
/**
 * SceneGameOver  
 */
 var SceneGameOver = Class.create(Scene, {
    initialize: function(score, shoot) {
        var gameOverLabel, scoreLabel;
        Scene.apply(this);
        this.backgroundColor = 'black';

        var game;
        game = Game.instance;

        gameOverLabel = new Label("GAME OVER<br>Move to Restart");
        gameOverLabel.x = game.width/2-gameOverLabel.width/2;
        gameOverLabel.y = game.height/3-70;
        gameOverLabel.color = 'white';
        gameOverLabel.font = '32px strong';
        gameOverLabel.textAlign = 'center';

        scoreLabel = new Label('SCORE: ' + score);
        scoreLabel.x = game.width/2-scoreLabel.width/2;
        scoreLabel.y = game.height/2;        
        scoreLabel.color = 'white';
        scoreLabel.font = '24px strong';
        scoreLabel.textAlign = 'center';

        shootLabel = new Label('SHOOTING: ' + shoot);
        shootLabel.x = game.width/2-shootLabel.width/2;
        shootLabel.y = game.height/2+2*20;        
        shootLabel.color = 'white';
        shootLabel.font = '24px strong';
        shootLabel.textAlign = 'center';

        var nombre = score/shoot*100;
        arrondi = nombre*100;          // 556.845
        arrondi = Math.round(arrondi); // 556
        arrondi = arrondi/100;         // 5.56
        if(shoot==0)
            arrondi=0;
        ratioLabel = new Label('RATIO: ' +arrondi + '%');
        ratioLabel.x = game.width/2-ratioLabel.width/2;
        ratioLabel.y = game.height/2+4*20;        
        ratioLabel.color = 'white';
        ratioLabel.font = '24px strong';
        ratioLabel.textAlign = 'center';

        this.addChild(gameOverLabel);
        this.addChild(scoreLabel);
        this.addChild(shootLabel);
        this.addChild(ratioLabel);

        this.addEventListener(Event.INPUT_CHANGE, this.touchToRestart);
        this.addEventListener(Event.TOUCH_MOVE, this.touchToRestart);
    },

    touchToRestart: function(evt) {
        var game = Game.instance;

        scene = new SceneGame();
        game.replaceScene(scene);
    }
});
