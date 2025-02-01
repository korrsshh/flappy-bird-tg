// Подключаем Telegram Web Apps API
//const tg = window.Telegram.WebApp;
//tg.expand(); // Разворачиваем приложение на весь экран

document.body.style.background = '#70c5ce';

// Подключаем Phaser
const config = {
    type: Phaser.AUTO,
    width: 320,
    height: 480,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('bird', 'bird.png');
    this.load.image('pipe', 'pipe.png');
    this.load.image('background', 'background.jpg');
}

function create() {
    this.add.image(160, 240, 'background');
    
    this.bird = this.physics.add.sprite(50, 150, 'bird').setOrigin(0.5, 0.5);
    this.bird.setCollideWorldBounds(true);
    this.input.on('pointerdown', () => this.bird.setVelocityY(-300));
    
    this.pipes = this.physics.add.group();
    this.time.addEvent({ delay: 1500, callback: addPipe, callbackScope: this, loop: true });
    
    this.physics.add.collider(this.bird, this.pipes, gameOver, null, this);
    
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Счет: 0', { fontSize: '20px', fill: '#fff' });
}

function addPipe() {
    const gap = Phaser.Math.Between(100, 200);
    const topPipe = this.pipes.create(320, gap - 150, 'pipe').setOrigin(0.5, 1);
    const bottomPipe = this.pipes.create(320, gap + 150, 'pipe').setOrigin(0.5, 0);
    
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
    tg.showAlert('Игра окончена! Ваш счет: ' + this.score);
    this.scene.restart();
}
