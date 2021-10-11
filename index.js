const readline = require('readline')
const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
)

function ask (questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve)
  })
}

//------------Player object--------------//
//This player object contains the player's inventory and starts them off on the porch.
let player = {
  inventoryPlayer: [],
  currentRoom: `porch`
}

//-----------------Rooms class----------------//
//Here we will define the class for the rooms in the game. I create a this for name, description and locked.

class Room {
  constructor (name, description, locked, item, connections) {
    this.name = name
    this.description = description
    this.locked = locked
    this.item = item
    this.connections = connections
  }

  //move function of Room class that takes player from current room to new room they enter and gives the description of the new room
  move () {
    console.log(this.connections)

    if (this.connections.includes(player.currentRoom)) {
      console.log('succesS')
    }
  }
}

//----------------make Rooms from the class ---------------//
//These constructors pass in all item properties from class (name, description, locked, item, connections) to the child item to create a new room!

let porch = new Room(
  'a dirty and scary porch welcomes you to the Witch House', //name of room
  'Once on this porch you read a chilling message!', //description of room
  false, //is it locked true or false
  'doormat', //item found in the room
  'foyer' //connecting rooms, the 0 index in the array is the previous room, the 1 index of array is room it connects to
)

let foyer = new Room(
  'dark and menacing foyer you step into as soon as you open the front door of the Witch House',
  'Once in this haunting and dingy foyer, /n you notice a gallon of water on the floor in a dark corner. /nYou can examine, use, or take the water!',
  true,
  'water',
  ['porch', 'kitchen']
)
let bathroom = new Room('bathroom', 'a bathroom', false)

let kitchen = new Room(
  'you have entered a creepy cobwebby kitchen with a ghostly figure watching you from the window. The most delicious-smelling freshly baked blueberry pie you have ever imagined is on the kitchen table.',
  'You can examine, use, or take the delicious pie!',
  false,
  'blueberry pie',
  ['foyer', 'den']
)

let den = new Room(
  'den',
  'a cozy denYou are now in a cozy den with a crackling fire in the fireplace. There is a table and on it is a book with a well-worn cover. Someone has drawn a skull and crossbones on it--so incredibly scary! You can try to examine, use, or take the book!',
  false,
  'book',
  ['kitchen', 'bedroom']
)

let bedroom = new Room(
  'bedroom',
  'You are in a surprisingly clean and cozy bedroom with a comfortable bed in it. There are soft pillows and warm blankets. You can try to examine, use, or take the book!',
  false,
  'bed',
  ['den', 'lair']
)

let lair = new Room(
  'lair',
  `the evil witch's filthy lair`,
  false,
  'witch',
  'bedroom'
) //here there is no room after the lair so I just listed the previous room

//-----------------Lookup table for Rooms-----------//
//This lookup table is for the rooms, it looks up string and spits out variable version
let lookupRoomTable = {
  porch: porch,
  foyer: foyer,
  kitchen: kitchen,
  den: den,
  bedroom: bedroom,
  bathroom: bathroom,
  lair: lair
}

//-----------------Items class----------------//
//here we will define the class for items player can take, drop, or use

class Item {
  constructor (name, description, action, takeable) {
    this.name = name
    this.description = description
    this.action = action || 'nothing happens' //if item has no action property nothing happens
    this.takeable = takeable || false //if item has no takeable property nothing happens
  }

  examine () {
    //'examine' method of Item class. If user types examine, they get a description
    return `What you see is... ${this.description}`
  }

  take () {
    //'take' method of 'Item' class. If item is takeable, push item to inventory array which was initialized up above in 'global variables' section of code

    if (this.takeable) {
      inventoryPlayer.push(this.name)
      return `you picked up ${this.name}`
    } else {
      return `hey, you can't take that!`
    }
  }

  drop () {
    //'drop' method of 'Item' class. If item is in player's inventory and this method is called it pops the item off the array inventory

    if (this.takeable) {
      inventoryPlayer.pop(this.name)
      return `you dropped ${this.name}`
    } else {
      return `hey, you can't drop that!`
    }
  }
  //'use' method of the 'Item' class. If the item is named in the if statement, the method returns a message otherwise it will return the action
  use () {
    if (this.name === 'key' && inventoryPlayer.includes('key')) {
      return `you can open the door!`
    } else {
      return this.action //if there is an action it will return the action otherwise it will return the 'or' condition which is "no" action
    }
  }
}
//----------------Make game items from the class ---------------//
//These constructors pass in all item properties from class Item to the child item (name, description, action, takeable) and creates an item as specified.

let doormat = new Item(
  'doormat', //name
  'a doormat', //description
  'you lift up the doormat and see a key. Do you want to use it or take it?', //action
  false //not takeable so it will come back as undefined
)
let door = new Item(
  'door',
  'This is a dirty old door with a rusty lock and it is locked.',
  'The door opens and you see a foyer! Type move foyer if you want to go in.',
  false
)

let key = new Item(
  'key',
  'a rusty old key with a skull on it looks like it fits the lock on the door. You can try to use or take the key',
  'The key goes into the lock on the door and you turn it. Type use, take, or examine door for more action!',
  true //this one is takeable so it's true
)

let water = new Item(
  'water',
  'A gallon container of water is in the corner of the foyer. You may have a sip, but you may want to take the water with you, it  may come in handy! Type use water or take water for more action!',
  'The water tastes delicious! Type take to take the rest, use to drink more, or r for list of other rooms!',
  true
)

let pie = new Item(
  'pie',
  'a homemade blueberry pie! how delightful! Type use or take to interact further with this superb treat.',
  'The pie is sweet and fruity, like nothing from this world! It is so delicious, but if you like you can take the rest with you by typing take at the prompt or you can move on to another room (type r for list of rooms).',
  true
)

let book = new Item(
  'book',
  'There is a book on the living room table. It is a dog-eared copy of Eloquent Javascript. So far, this is the scariest thing in the whole house.',
  `This book looks pretty complicated, but you never know when you might need to learn some coding skills or just blow someone's mind with it. You can type use or take... if you have the guts! Otherwise, move on to another room (type r for list of rooms).`,
  true
)

let sink = new Item(
  'sink',
  `The bathroom has a gruesome bathtub filled with bones and hair, but there is a sink that looks nice and clean. It even has hot and cold water, a fresh bar of soap, and a fresh, folded towel. ',
  'This sink would be a great place to wash up in case you picked up some nasty witch germs opening the front door! Type use to use it! Try not to think about what's in that bathtub...`,
  false
)

let bed = new Item(
  'bed',
  'a bed with pillows and a nice, warm blankie. If you type use or take you can find out what is next!',
  'the bed looks so inviting, maybe take a nap? Take care though, the witch is pretty hungry and can smell you in the house! Type use to use the bed for your rest.',
  false
)

let witch = new Item(
  'witch',
  'an evil witch who lives in this house. Be careful, she is wicked hungry and you could be on the menu! Type use or take to find out what this demented servant of dark forces is capable of.',
  'The witch is evil and hideous! she is a sallow crone with a screechy voice and ravenous hunger in her eyes. She has seen you and her intentions are clear! You may have some items to help deal with this crisis. What do you want to do now?',
  true
)

//-----------------Lookup table for game items-----------//
//still not sure what lookup table does--research and explain it//This lookup table is for the rooms, it looks up string and spits out variable version
let lookupItemTable = {
  doormat: doormat,
  key: key,
  door: door,
  water: water,
  pie: pie,
  book: book,
  sink: sink,
  bed: bed,
  witch: witch
}

//----State Machine for Room transitions----------//
/*I started building a state machine here by creating the lookup for room transitions. This shows the allowable transitions I would have. However, I decided to instead approach the transitions as "connections" within each individual room. I'm leaving this here, commented out, if I want to come back and change the code to use a state machine instead!
let roomState = {
  porch: ['foyer'],
  foyer: ['bathroom'],
  kitchen: ['den'],
  den: ['bedroom'],
  bedroom: ['witchRoom']
}*/

//-----------------Start Game Code----------------//
//This welcome message uses async await to ask a user if they want to check out the Hungry Witch House. If they say yes, they receive a message welcoming to the challenge and giving some instructions. Otherwise they are taunted until they decide to play.
async function welcome () {
  let welcomeMessage = await ask(
    "Welcome to the Hungry Witch House. It's a spooky looking house with a rickety old door and cobwebs on the windows. This house is filled with evil and dread, but do not let that deter you! There is a tasty treat inside, a place to rest and clean up, and some interesting reading material. It will be worth it, I promise! Want to check it out?"
  )

  //this while loop welcomes user to the game if they answer yes to the above console.log message. If they type no it scolds them.
  while (welcomeMessage !== 'yes' && welcomeMessage !== 'y') {
    welcomeMessage = await ask(
      "Are you scared? Why don't you eat some courage pudding and type yes or y. Chicken!"
    )
  }
  console.log(
    'Okay, glad you are taking the challenge! You are a crazy, but brave soul to enter this wicked place. The witch thinks that sounds delicious--er, I mean admirable! As you can see, the front door is old and cracked and there is a dusty, worn out doormat at your feet. You can type examine, take, or use plus the name of the item you see to interact with the item. You can type move to change rooms!'
  )
  await start()
}
welcome()

async function start () {
  //declare variable for user action that takes in user input via async await to define the action
  let userAction = await ask('what would you like to do?')

  //SANITIZATION OF INPUT: takes user action input, lower cases it, and splits it on any spaces
  let inputArray = userAction.toLowerCase().split(' ')

  //this code defines a variable action. It takes input array @ index zero to give you only the action user specified (ie - "use").
  let action = inputArray[0]

  let targetTable = inputArray.slice(1).join(' ')
  //targetTable is the target we are going look up in the lookup table. It would be the second word the user enters, so it would look up an item or a room in their respective lookup tables. This code slices input array and joins together at space in case you have 2 word input---like bath room. I don't have two word items in my items list, but this is code sanitization

  if (action === 'move') {
    //if the action is 'move' it goes to room's move() method and whatever is the target of the lookup table it runs the move()method on it
    lookupRoomTable[targetTable].move()
    await start() //this takes user back to the userAction so they can enter more input
  }
  if (action === 'use') {
    //if the action is 'use' it goes to room's move() method and whatever is the target of the lookup table it runs the move()method on it
    console.log(lookupItemTable[targetTable].use())
    await start()
    //
  } else {
    console.log("You can't use that, try again!")
    await start()
  }
  if (action === 'take') {
    //if the action is take, lookUpItemTable references targetTable and checks if it is in the Item class -- a boolean so it will result in true or false. "instanceof" checks if item exists--looks at boolean of takeable item.
    if (lookupItemTable[targetTable] instanceof Item) {
      //if takeable it will run the take method on it. Otherwise, it will lot "you can't take that!"
      await start()
    } else {
      console.log(lookupItemTable[targetTable] instanceof Item)
      //It's not an item, can't take it message
      console.log("You can't take that, try again!") //for some reason, when I type take and the item's ame it console.lots the use message above.
      await start()
    }
  }
  if (action === 'examine') {
    console.log(lookupItemTable[targetTable].examine())
    await start()
  } else if (action === 'leave' || action === 'exit') {
    //player types exit or leave and game kicks them out with a shaming message
    console.log(
      "Ok you're quitting the game, you big chicken! Come back when you muster up some courage."
    )
    process.exit()
  } else {
    //catch all for every other action player tries to do!
    console.log("I can't do that...invalid input, please try again!")
    await start()
  }
}

start()
//this is what makes it go back to the top of the async function so it can start getting the user input again since this input wasn't right

//-------player----------//
//create a player variable. what is in player's inventory. player should be able to see this by typing "see inventory"

//--------------State Machine------------//
//here we will have a state machine to control movement between rooms that is and is not allowed//

//-----------------Rooms class and constructor ----------------//

//----------------actions player can take------------------//
//read, unlock the door, move forward/backwards/left/right, open the door, take item, drop item, drink/drink water, throw, drop, sleep/nap/rest, brush teeth*/
