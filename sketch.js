var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOver, gameOver_Image;
var restart, restart_Image;


function preload(){
  trex_running = loadAnimation("trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOver_Image = loadImage("game_over.jpg");
  restart_Image = loadImage("restart.png")
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-20,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.6;
  trex.debug = false;
  trex.setCollider("Circle", 0, 0, 40);
  
  ground = createSprite(200, height -30, 400, 20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;

  gameOver = createSprite(width/2, height/2-100);
  gameOver.addImage("gameOver", gameOver_Image);
  gameOver.scale = 3;
  gameOver.visible = false;

  restart = createSprite(width/2, height/2+100);
  restart.addImage("restart", restart_Image);
  restart.scale = 0.7;
  restart.visible = false;
  
  invisibleGround = createSprite(200, height -15, 400, 10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes 
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  score = 0;
}

function draw() {
  background(244, 244, 244);
  textSize(20);
  text("Puntuación: "+ score, width-200, 50);
  
  if(gameState === PLAY){

    score = 0;

    gameOver.visible = false;
    restart.visible = false;

    //mover el suelo
    ground.velocityX = -20;

    //Sumar puntos
    score = score + Math.round(frameCount/2);

   //aparecer las nubes
   spawnClouds();
  
   //aparecer los obstáculos en el suelo
   spawnObstacles();

    if(keyDown("space")&& trex.y >= height/2+280) {
    trex.velocityY = -13;
   }

    if (obstaclesGroup.isTouching(trex)){
      gameState = END;
    }
    
  }else if(gameState === END){
    //detener el suelo
    ground.velocityX = 0;

    trex.changeAnimation("collided", trex_collided);

    gameOver.visible = true;
    restart.visible = true;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles() {
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width, height-46, 10, 40);
   obstacle.velocityX = -20;

   
    //generar obstáculos al azar
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.7;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //escribir aquí el código para aparecer las nubes 
  if (frameCount % 20 === 0) {
    cloud = createSprite(width, height, 40, 10);
    cloud.y = Math.round(random(10, 300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX = -18;
    
     //asignar lifetime a la variable
    cloud.lifetime = 200;
    
    //ajustar la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //agregar cada nube al grupo
   cloudsGroup.add(cloud);
  }
  
}
