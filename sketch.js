var dog,sadDog,happyDog, database;
var foodS=0,foodStock;
var addFood,foodSprite;
var foodObj=[],vi;

//create feed and lastFed variable here


function preload(){
  vi = loadImage("v.png")
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
foodSprite = loadImage("Milk.png");
}

async function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  Food=createButton("Feed The Doggo");
  Food.position(900,95);
  Food.mousePressed(await feedDog);
}

function draw() {
  background(46,139,87);

 
  //write code to display text lastFed time here

 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
}


async function feedDog(){
  
  let time = 0;
  function f(d) {
    time = d.val();
  }
  await database.ref("lastFeed").on("value",f);
  console.log(await getTime())
  console.log(foodS)
  if((time == await getTime()) && (foodS>0)) {
    alert("ele está cheio, volte uma hora mais tarde")
  } else if(foodS<=0){
    foodS = 0;
    alert("adicione comida antes")
  } else {
    console.log(foodS)
    foodS--;
    dog.addImage(happyDog);
    foodObj[foodObj.length-1].addImage("b",vi);
    foodObj[foodObj.length-1].changeImage("b");
    database.ref("/").update({
      "food":foodS,
      "lastFeed": await getTime()
    });
  }
  
}
async function getTime() {
    var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Tokyo");
    var responseJson = await response.json(); 
    var hour = Number(responseJson.datetime.slice(11,13));
    return hour;
}
//function to add food in stock
function addFoods(){
  foodS++;
  foodObj.push(createSprite(random(200,800),random(100,300),0,0));
  foodObj[foodObj.length-1].addImage("a",foodSprite);
  foodObj[foodObj.length-1].scale=0.1;
  database.ref('/').update({
    food:foodS
  })
}
