const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  it('constructor sets position and default values for mode and generatorWatts', function() {
    let rover = new Rover(10569)
    expect(rover).toEqual({position: 10569, mode: 'NORMAL', generatorWatts: 110})
  })
  it('response returned by receiveMessage contains the name of the message', function() {
    let message = new Message('test message')
    let rover = new Rover(10569)
    let response = rover.receiveMessage(message)
    expect(response.message).toEqual('test message')
  })
  it('response returned by receiveMessage includes two results if two commands are sent in the message', function() {
    let commands = [new Command('MOVE'), new Command('MODE_CHANGE')];
    let message = new Message('test message', commands);
    let rover = new Rover(10569);
    let response = rover.receiveMessage(message);
    expect(response.results.length === commands.length).toEqual(true)
  })
  it('responds correctly to the status check command', function() {
    let command = new Command('STATUS_CHECK')
    let message = new Message('test', [command])
    let rover = new Rover(10569);
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual(
      [
        {
          completed: true, 
          roverStatus: {
            mode: rover.mode,
            generatorWatts: rover.generatorWatts,
            position: rover.position
          } 
        }
      ]
    )
  })
  it('responds correctly to the mode change command', function() {
    let command = new Command('MODE_CHANGE')
    let message = new Message('test', [command])
    let rover = new Rover(10569);
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{completed: true}])
    expect(rover.mode).toEqual('LOW_POWER');
    rover.receiveMessage(message);
    expect(rover.mode).toEqual('NORMAL');
  })
  it('responds with a false completed value when attempting to move in LOW_POWER mode', function() {
    let rover = new Rover(10569, 'LOW_POWER')
    let message = new Message('test', [new Command('MOVE', 12000)]);
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{completed: false}])
    expect(rover.position).toEqual(10569)
  })
  it('responds with the position for the move command', function() {
    let rover = new Rover(10569)
    let message = new Message('test', [new Command('MOVE', 12000)])
    let response = rover.receiveMessage(message);
    expect(response.results).toEqual([{completed: true}]);
    expect(rover.position).toEqual(12000)
  })
});
