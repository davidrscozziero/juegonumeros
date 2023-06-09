// Variables globales
var canvasWidth = 400;
var canvasHeight = 400;
var monkey;
var bananas = [];
var trees = [];
var score = 0;
var gameOver = false;

// Función para cargar los archivos de imágenes y sonidos
function preload() {
  monkeyImg = loadImage('assets/monkey.png');
  bananaImg = loadImage('assets/banana.png');
  treeImg = loadImage('assets/tree.png');
  jumpSound = loadSound('assets/jump.mp3');
  collectSound = loadSound('assets/collect.mp3');
  gameOverSound = loadSound('assets/game-over.mp3');
}

// Función para inicializar el juego
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  monkey = new Monkey();
  for (var i = 0; i < 5; i++) {
    bananas.push(new Banana());
    trees.push(new Tree());
  }
}

// Función para actualizar el estado del juego en cada cuadro
function draw() {
  clear();
  background(100, 200, 100);
  if (!gameOver) {
    // Actualizar y dibujar los objetos del juego
    monkey.update();
    monkey.draw();
    for (var i = 0; i < bananas.length; i++) {
      bananas[i].update();
      bananas[i].draw();
    }
    for (var i = 0; i < trees.length; i++) {
      trees[i].update();
      trees[i].draw();
    }
    // Verificar colisiones
    for (var i = 0; i < bananas.length; i++) {
      if (monkey.collidesWith(bananas[i])) {
        bananas.splice(i, 1);
        collectSound.play();
        score++;
        bananas.push(new Banana());
      }
    }
    for (var i = 0; i < trees.length; i++) {
      if (monkey.collidesWith(trees[i])) {
        gameOver = true;
        gameOverSound.play();
      }
    }
    // Mostrar la puntuación
    textSize(32);
    fill(255);
    text('Score: ' + score, 10, 30);
  } else {
    // Mostrar el mensaje de fin de juego
    textSize(64);
    fill(255, 0, 0);
    textAlign(CENTER);
    text('Game Over', canvasWidth/2, canvasHeight/2);
  }
}

// Clase para el objeto Mono
function Monkey() {
  this.x = canvasWidth/2;
  this.y = canvasHeight - 50;
  this.vx = 0;
  this.vy = 0;
  this.gravity = 0.5;
  this.jumpSpeed = -10;
  this.width = 50;
  this.height = 50;

  // Actualizar la posición y velocidad del mono
  this.update = function() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    if (this.y + this.height > canvasHeight) {
      this.y = canvasHeight - this.height;
      this.vy = 0;
    }
    if (keyIsDown(LEFT_ARROW)) {
      this.vx = -5;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.vx = 5;
    } else {
      this.vx = 0;
    }
    if (keyIsDown(UP_ARROW) && this.vy == 0) {
      this.vy = this.jumpSpeed;
      jumpSound.play();
    }
  };

  // Dibujar el mono en la pantalla
  this.draw = function() {
    image(monkeyImg, this.x, this.y, this.width, this.height);
  };

  // Verificar si el mono colisiona con otro objeto
  this.collidesWith = function(obj) {
    if (this.x + this.width < obj.x || this.x > obj.x + obj.width) {
      return false;
    }
    if (this.y + this.height < obj.y || this.y > obj.y + obj.height) {
      return false;
    }
    return true;
  };
}

// Clase para el objeto Banana
function Banana() {
  this.x = random(canvasWidth);
  this.y = -50;
  this.vy = random(2, 5);
  this.width = 30;
  this.height = 30;

  // Actualizar la posición de la banana
  this.update = function() {
    this.y += this.vy;
    if (this.y > canvasHeight) {
      this.y = -50;
      this.x = random(canvasWidth);
    }
  };

  // Dibujar la banana en la pantalla
  this.draw = function() {
    image(bananaImg, this.x, this.y, this.width, this.height);
  };
}

// Clase para el objeto Árbol
function Tree() {
  this.x = random(canvasWidth);
  this.y = -200;
  this.vy = random(1, 3);
  this.width = 100;
  this.height = 200;

  // Actualizar la posición del árbol
  this.update = function() {
    this.y += this.vy;
    if (this.y > canvasHeight) {
      this.y = -200;
      this.x = random(canvasWidth);
    }
  };

  // Dibujar el árbol en la pantalla
  this.draw = function() {
    image(treeImg, this.x, this.y, this.width, this.height);
  };
}