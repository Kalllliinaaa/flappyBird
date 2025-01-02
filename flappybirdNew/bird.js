export class Bird {
    constructor(main) {
        this.main = main;
        this.ctx = main.ctx;
        this.speed = 3.1;
        this.index = 0;
        this.gravity = 0.8;
        this.image = null;
        this.angle = 0;
        this.SIZE = [51, 36]; // Размеры птицы
        this.birdSource = null;
        this.birdY = this.main.canvas.height / 2; // Позиция птицы по вертикали
        this.isDead = false; // Флаг, показывающий, умерла ли птица // Флаг, показывающий, прошла ли птица через трубу
        this.animationFrameId = null; // ID анимации
        this.reset();
        this.passedPipes = [];
        this.newPipeScore = 0;
    }
    reset() {
        // Сброс состояния птицы
        // this.x = 50;
        this.birdY = this.main.canvas.height / 2;
        this.velocity = 0;
        this.isDead = false;
        this.passedPipes = [];
        this.gravity = 0.8;  // Возвращаем начальное значение гравитации
        this.angle = 0; 
        this.newPipeScore = 0;    
    }
    
    setImage(image) {
        this.image = image;
    }

    render() {
        if (!this.image || this.isDead) return; // Если птица мертва, не рендерим её
    
        const birdSize = this.SIZE;
    
        // Перемещение фона
        this.index += 0.3;
        const backgroudX = -((this.index * this.speed) % this.main.canvas.width);
    
        const bgSource = {
            x: 0,
            y: 0,
            width: this.main.canvas.width,
            height: this.main.canvas.height,
        };
    
        const bgPartOneResult = {
            x: backgroudX + this.main.canvas.width,
            y: 0,
            width: this.main.canvas.width,
            height: this.main.canvas.height,
        };
    
        const bgPartTwoResult = {
            x: backgroudX,
            y: 0,
            width: this.main.canvas.width,
            height: this.main.canvas.height,
        };
    
        // Отображаем фон
        this.ctx.drawImage(
            this.image,
            bgSource.x, bgSource.y, bgSource.width, bgSource.height,
            bgPartOneResult.x, bgPartOneResult.y, bgPartOneResult.width, bgPartOneResult.height
        );
    
        this.ctx.drawImage(
            this.image,
            bgSource.x, bgSource.y, bgSource.width, bgSource.height,
            bgPartTwoResult.x, bgPartTwoResult.y, bgPartTwoResult.width, bgPartTwoResult.height
        );
    
        // Рендерим птицу
        this.birdSource = {
            x: 432,
            y: Math.floor((this.index % 9) / 3) * this.SIZE[1],
            width: this.SIZE[0],
            height: this.SIZE[1],
        };
    
        const birdResult = {
            x: this.main.canvas.width / 2 - this.SIZE[0] / 2,
            y: this.birdY,
            width: this.SIZE[0],
            height: this.SIZE[1],
        };
    
        this.ctx.drawImage(
            this.image,
            this.birdSource.x, this.birdSource.y, this.birdSource.width, this.birdSource.height,
            birdResult.x, birdResult.y, birdResult.width, birdResult.height
        );
    
        // Обновляем гравитацию
        this.birdY += this.gravity;
    
        if (this.gravity < 0) {
            this.gravity += 0.7;
        } else {
            this.gravity = 3;
        }
    
        if (this.gravity > 0) {
            this.angle = 10;
        } else {
            this.angle = -10;
        }
    
        let angleInRadians = this.angle * Math.PI / 180;
    
        // Поворот птицы
        this.ctx.save();
        this.ctx.translate(birdResult.x + this.SIZE[0] / 2, birdResult.y + this.SIZE[1] / 2);
        this.ctx.rotate(angleInRadians);
        this.ctx.translate(-(birdResult.x + this.SIZE[0] / 2), -(birdResult.y + this.SIZE[1] / 2));
        this.ctx.drawImage(
            this.image,
            this.birdSource.x, this.birdSource.y, this.birdSource.width, this.birdSource.height,
            birdResult.x, birdResult.y, this.SIZE[0], this.SIZE[1]
        );
        this.ctx.restore();
    
        // Проверка на столкновение с трубами и землей
        if (this.isCollidingWithPipes() || birdResult.y + this.SIZE[1] >= this.main.canvas.height) {
            this.die();
        }
    
        // Проверка, прошла ли птица через трубы
        this.checkPipePass(birdResult);
    
        // Запрос следующего кадра
        this.animationFrameId = requestAnimationFrame(() => this.render());
    }
    
    flap() {
        if (this.gravity > 0) {
            this.gravity = -10;  // Поднимаем птицу
        }
    }

    // Проверка на столкновение с трубами
    isCollidingWithPipes() {
        const birdResult = {
            x: this.main.canvas.width / 2 - this.SIZE[0] / 2,
            y: this.birdY,
            width: this.SIZE[0],
            height: this.SIZE[1],
        };

        // Проход по всем трубам
        for (let i = 0; i < this.main.pipe.column.length; i++) {
            const pipe = this.main.pipe.column[i];

            // Верхняя труба
            const topPipe = {
                x: pipe.x,
                y: pipe.y,
                width: pipe.width,
                height: this.main.pipe.constantGap, // Высота верхней трубы
            };

            // Нижняя труба
            const bottomPipe = {
                x: pipe.x,
                y: pipe.y + this.main.pipe.constantGap,
                width: pipe.width,
                height: this.main.canvas.height - (pipe.y + this.main.pipe.constantGap), // Высота нижней трубы
            };

            // Проверка столкновения с верхней трубой
            if (
                birdResult.x + birdResult.width > topPipe.x && // Птица справа от верхней трубы
                birdResult.x < topPipe.x + topPipe.width &&   // Птица слева от верхней трубы
                birdResult.y < topPipe.y + topPipe.height  - 180   // Птица выше верхней трубы
            ) {
                console.log('Столкновение с верхней трубой')
                return true; // Столкновение с верхней трубой
            }

            // Проверка столкновения с нижней трубой
            if (
                birdResult.x + birdResult.width > bottomPipe.x && // Птица справа от нижней трубы
                birdResult.x < bottomPipe.x + bottomPipe.width && // Птица слева от нижней трубы
                birdResult.y + birdResult.height > bottomPipe.y // Птица ниже нижней трубы
            ) {
                console.log('Столкновение с нижней трубой')
                return true; // Столкновение с нижней трубой
            }
        }
        console.log('Cтолкновений не было')
        return false; // Если столкновений не было
    }

    // Метод для проверки, прошла ли птица через трубу
checkPipePass(birdResult) {
    for (let i = 0; i < this.main.pipe.column.length; i++) {
        const pipe = this.main.pipe.column[this.newPipeScore];
        
        // Проверяем, проходит ли птица по горизонтали через трубу
        const birdPassedHorizontal = birdResult.x + birdResult.width > pipe.x && birdResult.x < pipe.x + pipe.width;

        // Проверка, что птица проходит между верхней и нижней частью трубы
        const birdPassedVertical = birdResult.y + birdResult.height > pipe.y && birdResult.y < pipe.y + this.main.pipe.constantGap;
        
        // Если птица проходит через трубу и ещё не прошла
        // console.log({passedPipes: this.passedPipes})
        if (birdPassedHorizontal && birdPassedVertical) {
            // debugger
            this.main.score.update(); // Увеличиваем счет
            this.passedPipes[i] = true; // Помечаем трубу как пройденную
            console.log('Прошла через трубу!', birdPassedHorizontal, birdPassedVertical, pipe);
        }
    }
}


    die() {
        this.isDead = true; // Устанавливаем флаг смерти птицы
        cancelAnimationFrame(this.animationFrameId); // Останавливаем анимацию игры

        // Показать экран Game Over
        this.main.showGameOver();
    }
    
    start() {
        // this.main.start();
    }
}

import { Main } from './main.js';
import { Pipe } from './pipe.js';
import { Fon } from './fon.js';
import { Score } from './score.js';