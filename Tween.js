class Tween {
    //constrcutor start,target,duration, function call back
      constructor(start, target, duration, callback) {
          this.start = start; // value start
          this.target = target; // value end
          this.duration = duration; // duration
          this.elapsed = 0; // elapsed
          this.callback = callback; 
          this.source = {}; 
      }
      //animation easeInSine
      easeInSine(progress) {
          return 1 - Math.cos((progress * Math.PI) / 2);
      }
      //update move
      update(delta) {
          this.elapsed += delta; 
          const progress = Math.min(this.elapsed / this.duration, 1);
  
          // update start and key
          for (const key in this.start) {
              this.source[key] = this.start[key] + (this.target[key] - this.start[key]) * this.easeInSine(progress);
          }
  
          //update animation
          this.callback(this.source);
          if (progress < 1) {
              requestAnimationFrame((timestamp) => this.update(timestamp));
          }
      }
  }