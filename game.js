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
    width: 600, // Увеличиваем ширину экрана
    height: 900, // Увеличиваем высоту экрана
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1200 }, debug: false } // Отключаем debug, чтобы убрать хитбоксы
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
    this.cameras.main.setZoom(0.8); // Ещё сильнее отдаляем камеру
    this.cameras.main.scrollY = 100; // Опускаем камеру ниже
    this.add.image(300, 300, 'background').setScale(1); // Поднимаем фон выше и уменьшаем
    
    this.bird = this.physics.add.sprite(100, 450, 'bird').setOrigin(0.5, 0.5).setScale(0.2);
    this.bird.setCollideWorldBounds(true);
    this.bird.body.setSize(this.bird.width * 0.6, this.bird.height * 0.6);
    
    this.input.on('pointerdown', () => this.bird.setVelocityY(-350));
    
    this.pipes = this.physics.add.group({ allowGravity: false }); // Отключаем гравитацию для труб
    this.time.addEvent({ delay: 1500, callback: addPipe, callbackScope: this, loop: true });
    
    this.physics.add.collider(this.bird, this.pipes, gameOver, null, this);
    
    this.score = 0;
    this.scoreText = this.add.text(10, 10, 'Счет: 0', { fontSize: '20px', fill: '#fff' });
}

function addPipe() {
    const gap = Phaser.Math.Between(200, 300); // Смещаем разрыв вниз для баланса
    const pipeHeight = 500; // Делаем трубы чуть короче
    
    const topPipe = this.pipes.create(600, gap - pipeHeight / 2 + 150, 'pipe') // Смещаем верхнюю трубу вниз
        .setOrigin(0.5, 1)
        .setScale(0.3)
        .setFlipY(true)
        .setImmovable(true)
        .setVelocityX(-250);
    
    const bottomPipe = this.pipes.create(600, gap + pipeHeight / 2 - 150, 'pipe') // Смещаем нижнюю трубу выше
        .setOrigin(0.5, 0)
        .setScale(0.3)
        .setImmovable(true)
        .setVelocityX(-250);
    
    topPipe.body.setSize(topPipe.width * 0.8, topPipe.height * 0.8);
    bottomPipe.body.setSize(bottomPipe.width * 0.8, bottomPipe.height * 0.8);
    
    // Добавляем счет за пролет трубы
    topPipe.passed = false;
}

function update() {
    if (this.bird.y > 900 || this.bird.y < 0) {
        gameOver.call(this);
    }
    
    this.pipes.getChildren().forEach(pipe => {
        if (!pipe.passed && pipe.x < this.bird.x) {
            pipe.passed = true;
            this.score += 0.5; // Каждая пара труб даёт 1 очко (по 0.5 за каждую)
            this.scoreText.setText('Счет: ' + Math.floor(this.score));
        }
    });
}

function gameOver() {
    console.log("Игра окончена! Ваш счет: " + Math.floor(this.score));
    alert('Игра окончена! Ваш счет: ' + Math.floor(this.score));
    this.scene.restart();
}
