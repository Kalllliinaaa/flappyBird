
export class Score {
    constructor(main) {
        this.main = main;
        this.ctx = main.ctx;
        this.currentScore = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;

        this.bestScoreElement = document.getElementById('best-score');
        this.currentScoreElement = document.getElementById('current-score');
    }

    update() {
        this.currentScore++;
        if (this.currentScore > this.bestScore) {
            this.bestScore = this.currentScore;
            localStorage.setItem('bestScore', this.bestScore);  // Сохраняем лучший результат
        }
        this.render();
    }

    render() {
        if (this.bestScoreElement && this.currentScoreElement) {
            this.bestScoreElement.textContent = this.bestScore;
            this.currentScoreElement.textContent = this.currentScore;
        } else {
            console.warn('Score elements are not found in the DOM!');
        }
    }

    reset() {
        this.currentScore = 0;
        this.render();
    }
}

import { Main } from './main.js';
import { Pipe } from './pipe.js';
import { Bird } from './bird.js';
import { Fon } from './fon.js';
