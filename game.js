<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flappy Bird Telegram</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.js"></script>
    <script src="game.js" defer></script>
    <style>
        body { margin: 0; overflow: hidden; background: #70c5ce; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script>
        const tg = window.Telegram.WebApp;
        tg.expand();
    </script>
</body>
</html>
