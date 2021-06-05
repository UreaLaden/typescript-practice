const carMakers: string[] = ['ford','toyota','honda'];

const dates  = [new  Date(), new Date()];

const carsByMake: string[][] = [ ];

// Help with inference when extracting values
const car = carMakers[0];
const myCar = carMakers.pop();

// Prevent incompatible values
carMakers.push(10);

// Help with 'map'
carMakers.map((car:string):string =>{
  return car;
});

// Flexible types 
const importantDates:(string | Date)[]=[];
importantDates.push('2030-10-12');
importantDates.push(new Date());