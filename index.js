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

//-------------initialize global variables here-----------//

let inventoryPlayer = [] //need this  to hold items so player can check if there is an item in their inventory

//GLOBAL ROOM LOCATION
let currentRoom = `porch`

//-----------------Rooms class----------------//
//here we will define the class for the rooms in the game

class Room {
  constructor (name, description, locked) {
    this.name = name
    this.description = description
    this.locked = locked
  }

  move () {
    console.log(`OK, you have moved from ${currentRoom} to ${this.room} and `)
  }
}

//----------------make Rooms from the class ---------------//
//these constructors pass in all item properties from class to the child item--name, description, action into each item variable

let foyer = new Room(
  'foyer',
  'a foyer you step into as soon as you open the front door of the Witch House.',
  true
)

let kitchen = new Room('kitchen', 'you see a pie...', false)

let den = new Room('den', 'a cozy den', false)

let bedroom = new Room('bedroom', 'a comfy bedroom', false)

let bathroom = new Room('bathroom', 'a bathroom', false)

let witchroom = new Room('witchroom', `the evil witch's filthy lair`, true)

//-----------------create lookup table for game rooms-----------//

let lookupRoomTable = {
  foyer: foyer,
  kitchen: kitchen,
  den: den,
  bedroom: bedroom,
  bathroom: bathroom,
  witchroom: witchroom
}

//-----------------Items class----------------//
//here we will define the class for items player can take or use

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

  //'use' method of the 'Item' class. If the item is named in the if statement, the method returns a message otherwise it will return the action
  use () {
    if (this.name === 'key' && inventoryPlayer.includes('key')) {
      return `you can open the door!`
    } else {
      return this.action //if there is an action it will return the action otherwise it will return the 'or' condition which is "no" action
    }
  }
}
//----------------make game items from the class ---------------//
//these constructors pass in all item properties from class to the child item--name, description, action into each item variable

let doormat = new Item(
  'doormat',
  'a doormat',
  'you lift up the doormat and see a key. .',
  undefined //not takeable so it will come back as undefined
)
let door = new Item(
  'door',
  'a door, lol. How about that! Type use or take plus door for more action.',
  'The dirty old door with a rusty lock is locked.',
  undefined //not takeable so it will come back as undefined
)

let key = new Item(
  'key',
  'a key',
  'a rusty old key with a skull on it looks like it fits the lock on the door. You can try to use or take the key.',
  true
)

let water = new Item(
  'water',
  'a gallon container of cool, clear, fresh water. Type use or take for more action!',
  'A gallon container of water is in the corner of the foyer. You may have a sip, but you may want to take the water with you, it  may come in handy! You can try to use or take the water.',
  true
)

let pie = new Item(
  'pie',
  'a homemade blueberry pie! how delightful! Type use or take to interact further with this superb treat.',
  'You spot a delicious fresh-baked blueberry pie that just came out of the oven. The pie smells yummy! Have a slice if you are hungry. You can take it with you by typing take at the prompt.',
  true
)

let book = new Item(
  'book',
  'a book called Eloquent Javascript. So far, this is the scariest thing in the whole house. But you can type use or take if you have the guts!',
  'There is a book on the living room table. It is a dog-eared copy of Eloquent Javascript. It looks pretty complicated, but you never know when you might need to learn some coding skills. You can take it if you like, just type take at the prompt.',
  true
)

let sink = new Item(
  'sink',
  'a sink that looks nice and clean. You can type use or take to see what happens next!',
  'The sink has hot and cold water and a fresh bar of soap. It would be a great place to wash up in case you picked up some nasty witch germs opening the front door! Type use to use it!',
  undefined //not takeable so it will come back as undefined
)

let bed = new Item(
  'bed',
  'a bed with pillows and a nice, warm blankie. If you type use or take you can find out what is next!',
  'the bed looks so inviting, maybe take a nap? Take care though, the witch is pretty hungry and can smell you in the house! Type use to use the bed for your rest.',
  undefined //not takeable so it will come back as undefined
)

let witch = new Item(
  'witch',
  'an evil witch who lives in this house. Be careful, she is wicked hungry and you could be on the menu! Type use or take to find out what this demented servant of dark forces is capable of.',
  'The witch is evil and hideous! she is a sallow crone with a screechy voice and ravenous hunger in her eyes. She has seen you and her intentions are clear! You may have some items to help deal with this crisis. What do you want to do now?',
  true
)

//-----------------create lookup table for game items-----------//

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

//-----------------Start Game Code----------------//

async function welcome () {
  let welcomeMessage = await ask(
    "Welcome to the Crazy Old Witch House. It's a spooky looking house with a rickety old door and cobwebs on the windows. This house is filled with evil and dread, but do not let that deter you! There is a tasty treat inside, a place to rest and clean up, and some interesting reading material. It will be worth it, I promise! Want to check it out?"
  )

  //this while loop welcomes user to the game if they answer yes to the above console.log message. If they type no it scolds them.
  while (welcomeMessage !== 'yes' && welcomeMessage !== 'y') {
    welcomeMessage = await ask(
      "Are you scared? Why don't you eat some courage pudding and type yes or y. Chicken!"
    )
  }
  console.log(
    'Okay, glad you are taking the challenge! You are a crazy, but brave soul to enter this wicked place. The witch thinks that sounds delicious--er, I mean admirable! As you can see, the front door is old and cracked and there is a dusty, worn out doormat at your feet. You can try to examine, take, or use plus the name of the item you see in this game that you want to interact with!'
  )
  await start()
}
welcome()

async function start () {
  //declare variable for user action that takes in user input to define the action

  let userAction = await ask('what would you like to do?')

  //SANITIZATION OF INPUT: takes user action input, lower cases it, and splits it on any spaces
  let inputArray = userAction.toLowerCase().split(' ')

  //this code defines a variable action. It takes input array @ index zero to give you the action user specified (ie - "use")
  let action = inputArray[0]

  let targetTable = inputArray.slice(1).join(' ')
  //targetTable is the target we are going look up in the lookup table. This code slices input array and joins together in case 2 word input---this may be redundant

  if (action === 'move') {
    //this conditional goes to the lookupItemTable's use() method and whatever is the target of the lookup table and run the use method on it and console.logs it.
    console.log(lookupRoomTable[targetTable].move())
    await start()
  }
  if (action === 'use') {
    //this conditional goes to the lookupItemTable's use() method and whatever is the target of the lookup table and run the use method on it and console.logs it.
    console.log(lookupItemTable[targetTable].use())
    await start()
  } else if (action === 'take') {
    //instanceof is for if item exists--looks at boolean of takeable item
    if (lookupItemTable[targetItemTable] instanceof Item) {
      //if takeable it will return the take property.Otherwise, see else statement below...
      console.log(lookupItemTable[targetTable].take())
    } else {
      console.log(lookupItemTable[targetTable] instanceof Item)
      //It's not an item, can't take it message
      console.log("That's not an item, so you can't take it!")
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
  }
}

start()
//this is what makes it go back to the top of the async function so it can start getting the user input again since this input wasn't right

/*let enterCode = await ask(
    `Don't forget to enter code  so the door will open. It's a word representing a favorite witch holiday. Type it in now!`
  )/

  //process.exit()
}

//-------------User Inputs/Action-------------//


//-------player----------//
//create a player variable. what is in player's inventory. player should be able to see this by typing "see inventory"



//--------------State Machine------------//
//here we will have a state machine to control movement between rooms that is and is not allowed//

//-----------------Rooms class and constructor ----------------//

//----------------actions player can take------------------//
//read, unlock the door, move forward/backwards/left/right, open the door, take item, drop item, drink/drink water, throw, drop, sleep/nap/rest, brush teeth*/
