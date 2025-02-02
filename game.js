console.log("game.js загружен!");

// Подключаем Telegram Web Apps API
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand();
} else {
    console.warn("Telegram WebApp API не найден. Запускаем в браузере.");
}

document.body.style.background = '#70c5ce';

// Подключаем Phaser
const config = {
    type: Phaser.AUTO,
    width: 540, // Размер экрана
    height: 810,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1200 }, debug: true } // Включаем debug для отладки коллизий
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    console.log("Загрузка ассетов...");
    this.load.image('bird', 'bird.png');
    this.load.image('pipe', 'pipe.png');
    this.load.image('background', 'background.png');
}

function create() {
    console.log("Игра запущена!");
    this.cameras.main.scrollY = 50; // Опускаем камеру ниже
    this.add.image(270, 405 + 50, 'background').setScale(0.6); // Смещаем фон вниз
    
    this.bird = this.physics.add.sprite(100, 405, 'bird').setOrigin(0.5, 0.5).setScale(0.25);
    this.bird.setCollideWorldBounds(true);
    this.bird.body.setSize(this.bird.width * 0.6, this.bird.height * 0.6); // Уменьшаем хитбокс птички
    
    this.input.on('pointerdown', () => this.bird.setVelocityY(-350));
    
    this.pipes = this.physics.add.group();
    this.time.addEvent({ delay: 1500, callback: addPipe, callbackScope: this, loop: true });
    
    this.physics.add.collider(this.bird, this.pipes, gameOver, null, this);
    
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Счет: 0', { fontSize: '20px', fill: '#fff' });
}

function addPipe() {
    const gap = Phaser.Math.Between(250, 350);
    const pipeHeight = 500;
    
    const topPipe = this.pipes.create(540, gap - pipeHeight / 2, 'pipe')
        .setOrigin(0.5, 1)
        .setScale(0.35)
        .setFlipY(true);
    
    const bottomPipe = this.pipes.create(540, gap + pipeHeight / 2, 'pipe')
        .setOrigin(0.5, 0)
        .setScale(0.35);
    
    topPipe.setVelocityX(-250);
    bottomPipe.setVelocityX(-250);
    
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;
    
    topPipe.body.setSize(topPipe.width * 0.8, topPipe.height * 0.8); // Уменьшаем хитбокс труб
    bottomPipe.body.setSize(bottomPipe.width * 0.8, bottomPipe.height * 0.8);
}

function update() {
    if (this.bird.y > 810 || this.bird.y < 0) gameOver.call(this);
}

function gameOver() {
    console.log("Игра окончена! Ваш счет: " + this.score);
    alert('Игра окончена! Ваш счет: ' + this.score);
    this.scene.restart();
}
