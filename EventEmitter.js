class EventEmitter {
    //constrcutor event
      constructor() {
        //constructor events empty
          this.events = {};
      }
      //constrcutor on ssubscribe events
      on(event, listener) {
          if (!this.events[event]) {
              this.events[event] = [];
          }
          this.events[event].push(listener);
      }
   //constrcutor on Unsubscribe event
      off(event, listener) {
          if (this.events[event]) {
              this.events[event] = this.events[event].filter(l => l !== listener);
          }
      }
      //active event
      emit(event, ...args) {
          if (this.events[event]) {
              this.events[event].forEach(listener => listener(...args));
          }
      }
  }