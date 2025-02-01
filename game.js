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
    width: 640,
    height: 960,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
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
    this.add.image(160, 240, 'background').setScale(0.5); // Уменьшаем фон

    this.bird = this.physics.add.sprite(50, 150, 'bird').setOrigin(0.5, 0.5).setScale(0.2);
    this.bird.setCollideWorldBounds(true);
    
    this.input.on('pointerdown', () => this.bird.setVelocityY(-300));
    
    this.pipes = this.physics.add.group();
    this.time.addEvent({ delay: 1500, callback: addPipe, callbackScope: this, loop: true });
    
    this.physics.add.collider(this.bird, this.pipes, gameOver, null, this);
    
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Счет: 0', { fontSize: '20px', fill: '#fff' });
}

function addPipe() {
    const gap = Phaser.Math.Between(120, 200); // Сделаем более удобный разрыв

    const topPipe = this.pipes.create(320, gap - 200, 'pipe').setOrigin(0.5, 1).setScale(0.3);
    const bottomPipe = this.pipes.create(320, gap + 200, 'pipe').setOrigin(0.5, 0).setScale(0.5);

   
    
    topPipe.setVelocityX(-200);
    bottomPipe.setVelocityX(-200);
    
    topPipe.checkWorldBounds = true;
    bottomPipe.checkWorldBounds = true;
    topPipe.outOfBoundsKill = true;
    bottomPipe.outOfBoundsKill = true;
    
    this.pipes.children.iterate(pipe => {
        if (!pipe.scored && pipe.x < 50) {
            this.score += 1;
            this.scoreText.setText('Счет: ' + this.score);
            pipe.scored = true;
        }
    });
}

function update() {
    if (this.bird.y > 480 || this.bird.y < 0) gameOver.call(this);
}

function gameOver() {
    console.log("Игра окончена! Ваш счет: " + this.score);
    alert('Игра окончена! Ваш счет: ' + this.score);
    this.scene.restart();
}
