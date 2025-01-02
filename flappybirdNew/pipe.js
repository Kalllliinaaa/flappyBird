export class Pipe {
    frame;
    pipeBottomSourse;
    pipeBottomImage;
    pipeTopSourse;
    pipeTopImage;
    gap;
    constantGap;
    column = [];
    

    constructor(main) {
    this.main = main;
    this.ctx = main.ctx;
    this.image = null;
    this.SIZE = [51, 36];
    this.animationFrameId = null;

    // Начальная позиция первой колонки
    this.column[0] = {
        x: canvas.width,
        y: -204,
        width: 78, // Указываем ширину трубы (должно быть значение, например 78, как в source)
    };

    // Инициализация источников труб
    this.pipeBottomSourse = {
        x: 432,
        y: 110,
        width: 78, // Ширина нижней трубы
        height: 504,
    };

    this.pipeTopSourse = {
        x: 510,
        y: 110,
        width: 80, // Ширина верхней трубы
        height: 504,
    };

    // Установим начальные значения для постоянного зазора
    this.gap = this.pipeBottomSourse.height * 0.40;
    this.constantGap = this.pipeBottomSourse.height + this.gap;
}
reset() {
    this.column[0].x = this.main.canvas.width;
    this.column[0].y = -204; // Пример для случайной высоты трубы
    this.width = 60;
    this.height = 200;
    this.speed = 2; // Устанавливаем начальную скорость
    cancelAnimationFrame(this.animationFrameId);
}
    setImage(image) {
        this.image = image;
    }
    
    render() {
        if (this.column.length === 0) {
            console.error("Массив 'column' пуст!");
            return;
        }
    
        for (let i = 0; i < this.column.length; i++) {
            if (!this.column[i]) continue;
    
            // Инициализация переменных для изображения труб
            const pipeBottomImage = {
                x: this.column[i].x,
                y: this.column[i].y,
                width: this.column[i].width, // Используем ширину из объекта колонки
                height: 580,
            };
    
            const pipeTopImage = {
                x: this.column[i].x,
                y: this.column[i].y + this.constantGap,
                width: this.column[i].width, // Используем ширину из объекта колонки
                height: 580,
            };
    
            // Отображение нижней трубы
            this.ctx.drawImage(
                this.image,
                this.pipeBottomSourse.x,
                this.pipeBottomSourse.y,
                this.pipeBottomSourse.width,
                this.pipeBottomSourse.height,
                pipeBottomImage.x,
                pipeBottomImage.y,
                pipeBottomImage.width,
                pipeBottomImage.height,
            );
    
            // Отображение верхней трубы
            this.ctx.drawImage(
                this.image,
                this.pipeTopSourse.x,
                this.pipeTopSourse.y,
                this.pipeTopSourse.width,
                this.pipeTopSourse.height,
                pipeTopImage.x,
                pipeTopImage.y,
                pipeTopImage.width,
                pipeTopImage.height,
            );
    
            // Перемещение труб по оси X
            this.column[i].x -= 5;
    
            // Проверка на выход трубы за экран
            if (this.column[i].x < -pipeTopImage.width) {
                this.column.splice(i, 1); // Убираем колонку
                // Добавляем новую колонку на случайной высоте
                this.column.push({
                    x: canvas.width, // Новая труба начинается с правой стороны экрана
                    y: Math.floor(Math.random() * (canvas.height - this.pipeTopSourse.height)) - this.pipeTopSourse.height,
                    width: this.pipeBottomSourse.width, // Добавляем ширину в объект колонки
                });
            }
        }
    
        // Запрос следующего кадра для анимации
        this.animationFrameId = requestAnimationFrame(() => this.render());
    }
    
    
    start() {
        // this.main.getFon();
    }
}

  
import { Main } from './main.js';
import { Bird } from './bird.js';
import { Fon } from './fon.js';
import { Score } from './score.js';