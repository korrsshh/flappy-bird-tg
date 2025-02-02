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
    width: 540, // Ещё больше увеличиваем экран для лучшего обзора
    height: 810,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1200 }, debug: false } // Увеличили гравитацию, чтобы птица не зависала
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
    this.add.image(270, 405, 'background').setScale(0.6); // Подстраиваем фон под новый размер экрана
    
    this.bird = this.physics.add.sprite(100, 405, 'bird').setOrigin(0.5, 0.5).setScale(0.25); // Ещё больше уменьшаем птицу
    this.bird.setCollideWorldBounds(true);
    
    this.input.on('pointerdown', () => this.bird.setVelocityY(-350)); // Увеличиваем импульс при прыжке
    
    this.pipes = this.physics.add.group();
    this.time.addEvent({ delay: 1500, callback: addPipe, callbackScope: this, loop: true });
    
    this.physics.add.collider(this.bird, this.pipes, gameOver, null, this);
    
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Счет: 0', { fontSize: '20px', fill: '#fff' });
}

function addPipe() {
    const gap = Phaser.Math.Between(250, 350); // Увеличиваем разрыв между трубами
    const pipeHeight = 500; // Ещё больше корректируем высоту труб
    
    const topPipe = this.pipes.create(540, gap - pipeHeight / 2, 'pipe')
        .setOrigin(0.5, 1)
        .setScale(0.35) // Дополнительно уменьшаем трубы
        .setFlipY(true);
    
    const bottomPipe = this.pipes.create(540, gap + pipeHeight / 2, 'pipe')
        .setOrigin(0.5, 0)
        .setScale(0.35);
    
    topPipe.setVelocityX(-250);
    bottomPipe.setVelocityX(-250);
    
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;
}

function update() {
    if (this.bird.y > 810 || this.bird.y < 0) gameOver.call(this);
}

function gameOver() {
    console.log("Игра окончена! Ваш счет: " + this.score);
    alert('Игра окончена! Ваш счет: ' + this.score);
    this.scene.restart();
}
