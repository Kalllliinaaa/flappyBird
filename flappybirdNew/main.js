export class Main {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.pipe = new Pipe(this);
        this.bird = new Bird(this);
        this.fon = new Fon(this);
        this.score = new Score(this);
        this.isGameOver = false;
        this.isGameRunning = false; // Флаг для отслеживания состояния игры
        this.startButton = null; // Для хранения кнопки старта
        this.setupStartButton();  // Обработчик для кнопки старта

        
    }

    setupStartButton() {
        // Проверяем, существует ли кнопка. Если нет — создаем её.
        if (!this.startButton) {
            this.startButton = document.createElement('button');
            this.startButton.id = 'start-button'; // Добавляем ID для кнопки
            this.startButton.innerText = 'Start Game';
            this.startButton.style.position = 'absolute';
            this.startButton.style.top = '50%';
            this.startButton.style.left = '50%';
            this.startButton.style.transform = 'translate(-50%, -50%)';
            this.startButton.style.padding = '10px 20px';
            this.startButton.style.fontSize = '20px';
            this.startButton.style.backgroundColor = '#4CAF50';
            this.startButton.style.color = 'white';
            this.startButton.style.border = 'none';
            this.startButton.style.cursor = 'pointer';
            this.startButton.style.borderRadius = '5px';

            document.body.appendChild(this.startButton);
        }

        // Добавляем обработчик клика на кнопку
        this.startButton.addEventListener('click', () => {
            if (!this.isGameRunning) {
                this.start();
                this.startButton.style.display = 'none'; // Скрываем кнопку после старта игры
            }
        });
    }

    start() {
        // Настроим фон и начнем игру
        this.getFon();
        this.bird.start();
        this.pipe.start();
        this.score.reset(); // Сбросим счет перед началом игры
        this.lastTimestamp = 0;
        this.isGameRunning = true; // Игра начинается
        this.gameLoop(0); // Запуск игрового цикла
    }

    gameLoop(timestamp) {
        if (!this.isGameRunning) return; // Если игра не запущена, выходим

        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;

        const frameRate = 1000 / 60;
        if (deltaTime < frameRate) return;

        this.updateGameState(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop.bind(this)); // Запускаем следующий кадр
    }

    updateGameState(deltaTime) {
        this.pipe.update(deltaTime);
        this.bird.update(deltaTime);
        this.score.update(deltaTime);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.fon.render();
        this.pipe.render();
        this.bird.render();
        this.score.render();
    }

    getFon() {
        const imgURL = 'https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png';
        const image = new Image();
        image.src = imgURL;

        image.onload = () => {
            this.fon.setImage(image);
            this.fon.render();

            this.bird.setImage(image);
            this.pipe.setImage(image);
            this.bird.render();
            this.pipe.render();
        };

        // Слушаем клик для управления птичкой
        this.canvas.addEventListener('click', (event) => {
            if (!this.bird.isDead) {
                this.bird.flap();
            }
        });
    }

    // showGameOver() {
    //     // Настройка стилей для текста
       
    //     // Удаляем старую кнопку рестарта, если она существует
    //     this.removeGameButtons();
    
    //     // Создаем кнопку для перезапуска игры
    //     const buttonAgain = document.createElement('button');
    //     buttonAgain.id = 'restart-button';  // Устанавливаем ID для кнопки рестарта
    //     buttonAgain.innerText = 'Restart Game';
    //     buttonAgain.style.position = 'absolute';
    //     buttonAgain.style.top = '60%';
    //     buttonAgain.style.left = '50%';
    //     buttonAgain.style.transform = 'translateX(-50%)';
    //     buttonAgain.style.padding = '10px 20px';
    //     buttonAgain.style.fontSize = '20px';
    //     buttonAgain.style.backgroundColor = '#f44336';
    //     buttonAgain.style.color = 'white';
    //     buttonAgain.style.border = 'none';
    //     buttonAgain.style.cursor = 'pointer';
    //     buttonAgain.style.borderRadius = '5px';
    //     document.body.appendChild(buttonAgain);
    
    //     const textEnd = document.createElement('div');
    //     // Настройка стилей для текста
    //     textEnd.fillStyle = 'red'; // Цвет текста
    //     textEnd.font = '48px sans-serif'; // Шрифт и размер
    //     textEnd.textAlign = 'center'; // Выравнивание текста по центру
    //     textEnd.textBaseline = 'middle'; // Выравнивание по вертикали
    //     document.body.appendChild(textEnd);
    //     // Рисуем текст на канвасе в центре
    //     textEnd.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    
    
    //     // Обработчик перезапуска игры
    //     buttonAgain.addEventListener('click', () => {
    //         this.resetGame();  // Перезапуск игры
    //         buttonAgain.style.display = 'none';  // Скрываем кнопку рестарта после клика
    //     });
    // }
    showGameOver() {
        // Удаляем старую кнопку рестарта, если она существует
        this.removeGameButtons();
    
        // Создаем кнопку для перезапуска игры
        const buttonAgain = document.createElement('button');
        buttonAgain.id = 'restart-button';  // Устанавливаем ID для кнопки рестарта
        buttonAgain.innerText = 'Restart Game';
        buttonAgain.style.position = 'absolute';
        buttonAgain.style.top = '70%';
        buttonAgain.style.left = '50%';
        buttonAgain.style.transform = 'translateX(-50%)';
        buttonAgain.style.padding = '10px 20px';
        buttonAgain.style.fontSize = '20px';
        buttonAgain.style.backgroundColor = '#f44336';
        buttonAgain.style.color = 'white';
        buttonAgain.style.border = 'none';
        buttonAgain.style.cursor = 'pointer';
        buttonAgain.style.borderRadius = '5px';
        document.body.appendChild(buttonAgain);
    
        // Создаем div для текста "Game Over"
        const gameOverText = document.createElement('div');
        gameOverText.innerText = 'Game Over';
        gameOverText.style.position = 'absolute';
        gameOverText.style.top = '40%';
        gameOverText.style.left = '50%';
        gameOverText.style.transform = 'translateX(-50%) translateY(-50%)';
        gameOverText.style.fontSize = '48px';
        gameOverText.style.fontFamily = 'sans-serif';
        gameOverText.style.color = 'red';
        gameOverText.style.fontWeight = 'bold';
        gameOverText.style.textAlign = 'center';
        document.body.appendChild(gameOverText);
    
        // Обработчик перезапуска игры
        buttonAgain.addEventListener('click', () => {
            this.resetGame();  // Перезапуск игры
            buttonAgain.style.display = 'none';  // Скрываем кнопку рестарта после клика
            gameOverText.style.display = 'none';  // Скрываем текст "Game Over" после клика
        });
    }
    
    // Метод для удаления старой кнопки (если она была)
    removeGameButtons() {
        const existingButton = document.getElementById('restart-button');
        if (existingButton) {
            existingButton.remove();  // Удаляем старую кнопку, если она существует
        }
    
        const existingText = document.querySelector('div');
        if (existingText && existingText.innerText === 'Game Over') {
            existingText.remove();  // Удаляем старый текст "Game Over", если он существует
        }
    }
    
    resetGame() {
        console.log('Перезапуск игры!');
    
        // Сбрасываем все состояния игры и запускаем её заново
        this.isGameRunning = false;
    
        // Сбрасываем все объекты
        this.bird.reset();
        this.pipe.reset();
        this.score.reset();
        // this.fon.reset();
    
        // Удаляем старые элементы (кнопки)
        this.removeGameButtons();
    
        // Очистить канвас
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Запускаем игру с самого начала
        this.start();
    }
    
    removeGameButtons() {
        // Удаляем кнопку старта, если она существует
        if (this.startButton) {
            this.startButton.remove();
            this.startButton = null;
        }
    
        // Удаляем кнопку рестарта, если она существует
        const existingRestartButton = document.getElementById('restart-button');
        if (existingRestartButton) {
            existingRestartButton.remove();
        }
    }
    
}


import { Fon } from './fon.js';
import { Pipe } from './pipe.js';
import { Bird } from './bird.js';
import { Score } from './score.js';

const newMain = new Main();

