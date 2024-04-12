class Rover {
   constructor(position, mode = 'NORMAL', generatorWatts = 110) {
      this.position = position;
      this.mode = mode;
      this.generatorWatts = generatorWatts
   }
   receiveMessage(message) {
      let response = {};
      let results = [];
      response.message = message.name;
      if (message.commands) {
         for (let i = 0; i < message.commands.length; i++) {
            let result = {};
            if (message.commands[i].commandType === 'MOVE') {
               if (this.mode === 'LOW_POWER') {
                  result.completed = false;
                  results.push(result)
               } else {
                  result.completed = true;
                  this.position = message.commands[i].value;
                  results.push(result);
               }
            } else if (message.commands[i].commandType === 'STATUS_CHECK') {
               result.completed = true;
               result.roverStatus = {
                  mode: this.mode,
                  generatorWatts: this.generatorWatts,
                  position: this.position
               }
               results.push(result)
            } else if (message.commands[i].commandType === 'MODE_CHANGE') {
               result.completed = true;
               if (this.mode === 'NORMAL') {
                  this.mode = 'LOW_POWER'
               } else if (this.mode === 'LOW_POWER') {
                  this.mode = 'NORMAL'
               } else {
                  throw Error('invalid mode detected')
               }
               results.push(result);
            } else {
               throw Error('invalid command entered')
            }
         }
      }
      response.results = results;
      return response
   }
}

module.exports = Rover;