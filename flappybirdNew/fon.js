export class Fon{
    frame;

    constructor(main){
        this.main = main;
        this.ctx = main.ctx;
        this.speed = 4;
        this.index = 0;

        this.image = null;
    };
    
    setImage(image){
        this.image = image;
    }
    render(){

        this.index += 0.3;

        const backgroundDirection = -((this.index * this.speed) % canvas.width);
    
        const bgSource = {
          x: 0,
          y: 0,
          width: canvas.width,
          height: canvas.height
        }
    
        const bgMovePartOne = {
          x: backgroundDirection + canvas.width,
          y: 0,
          width: canvas.width,
          height: canvas.height
        }
    
        const bgMovePartTwo = {
          x: backgroundDirection,
          y: 0,
          width: canvas.width,
          height: canvas.height
        }
        


        this.ctx.drawImage(
          this.image,
          bgSource.x,
          bgSource.y,
          bgSource.width,
          bgSource.height,
          bgMovePartOne.x,
          bgMovePartOne.y,
          bgMovePartOne.width,
          bgMovePartOne.height
        )
    
        this.ctx.drawImage(
          this.image,
          bgSource.x,
          bgSource.y,
          bgSource.width,
          bgSource.height,
          bgMovePartTwo.x,
          bgMovePartTwo.y,
          bgMovePartTwo.width,
          bgMovePartTwo.height
        )
    
         requestAnimationFrame(() => this.render());
    };
     
    start() {
 }
}



import { Main } from './main.js';
import { Pipe } from './pipe.js';
import { Bird } from './bird.js';
import { Score } from './score.js';
