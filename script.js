'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

// creatUserName(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = acc.balance;
  labelBalance.textContent = `${acc.balance}€`;
};
// calcDisplayBalance(account1.movements);

const calcDisplaysummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€ `;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${intrest}€`;
};
// calcDisplaysummary(account1.movements);

const creatUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
creatUserNames(accounts);

const updateUI = function (acc) {
  // DISPLAY MOVEMENTS
  displayMovements(acc.movements);

  // DISPLAY BALANCE
  calcDisplayBalance(acc);

  // DISPLAY SUMMARY
  calcDisplaysummary(acc);
  console.log('login');
};

// EVENT HANDLER /////////////////////////////////////
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // DISPLAY UI AND WELCOME MESSAGE
    labelWelcome.textContent = `welcome back,${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // CLEAR INPUT-FIELDS

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // UPDATE UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // DOING THE TRANSFER
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    console.log();

    // updateUI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // ADD AMOUNT
    currentAccount.movements.push(amount);
    // UPDATE UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// FIND INDEX-METHOD /////////////////////////////////////////
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('delete');

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // delete account /////////////
    accounts.splice(index, 1);

    // HIDE UI ////////////////////
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// const user = `Steven Thomas Williams`; //stw

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// METHODS OF ARRAYS

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE METHOD////////////////////////////////////////
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(-3));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log(...arr);

// // SPLICE///////////////////////////////////////////////
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE METHOD///////////////////////////////////
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT METHOD/////////////////////
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN METHOD ////////////////////////
// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // GETTING LAST Elements
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log(`jonas`.at(0));
// console.log(`jonas`.at(-1));

// FOR EACH METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log('--------FOR OF LOOP METHOD--------');

// // for (const movement of movements)
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`movement ${i + 1}: you deposited ${movement}`);
//   } else {
//     console.log(`movement ${i + 1}: you withdraw ${Math.abs(movement)}`);
//   }
// }

// console.log('----------FOR EACH METHOD---------');

// movements.forEach(function (mov, i, r) {
//   if (mov > 0) {
//     console.log(`movement ${i + 1}: you deposited ${mov} `);
//   } else {
//     console.log(`movement ${i + 1}: you withdraw ${Math.abs(mov)}`);
//   }
// });

// FOR EACH METHOD ON MAPS AND SETS///////////////

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}:${value}`);
// });

// // SET ///////////
// const currenciesunique = new Set(['USD', 'GBG', 'USD', 'EUR', 'EUR']);
// console.log(currenciesunique);

// currenciesunique.forEach(function (value, _, map) {
//   console.log(`${value}:${value}`);
// });
// CODING CHALLENGE #1/////////////////////////////////////////////
// const dogJulia = [3, 5, 2, 12, 7];
// const dogJulia2 = [9, 16, 6, 8, 3];
// const dogkate = [4, 1, 15, 8, 3];
// const dogkate2 = [10, 5, 6, 1, 4];
// const checkDog = function (dogJulia, dogkate) {
//   const dogJuliaCorrected = dogJulia.slice();
//   dogJuliaCorrected.splice(0, 1);
//   dogJuliaCorrected.splice(-2);
//   const dogs = dogJuliaCorrected.concat(dogkate);
//   console.log(dogs);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(
//         `dog number ${i + 1}: its an adult and its ${dog} years old `
//       );
//     } else {
//       console.log(
//         ` dog number ${i + 1}: its ${dog} years old and its still a puppy`
//       );
//     }
//   });
// };
// checkDog(dogJulia, dogkate);
// checkDog(dogJulia2, dogkate2);

// const eurToUsd = 1.1;

// //  MAP METHOD ////////////////////////////////////////
// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// // SAME RESULT BY USING ARROW METHOD////////////////////////
// // const movementsUsd = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUsd);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdraw'} ${Math.abs(
//       mov
//     )}`

//   // if (mov > 0) {
//   //   return `movement ${i + 1}: you deposited ${mov}`;
//   // } else {
//   //   return `movement ${i + 1}: you withdraw ${Math.abs(mov)}`;
//   // }
// );
// console.log(movementsDescriptions);

// FILTER METHOD/////////////////////////

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// // SAME THING AS FILTR METHOD BUT WITH FOR LOOP METHOD/////////////////

// const depositeFor = [];
// for (const mov of movements) if (mov > 0) depositeFor.push(mov);

// console.log(depositeFor);

// // SAME FIRLTER METHOD AS DEPOSITS BUT ON WITHDRAWLS/////////////////

// const withdrawls = movements.filter(mov => mov < 0);
// console.log(withdrawls);

// REDUCE METHOD///////////////
// console.log(movements);

// // ACCUMULATOR IS LIKE A SNOWBALL
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`iteration number ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// // SAME THING BY ARROW METHOD///////////
// // const balance = movements.reduce(
// //   (acc, cur) => acc + cur,
// //   0
// //   // console.log(`iteration number ${i}: ${acc}`);
// // );
// console.log(balance);

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// // MAXIMUM VALUE ////////////////////
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);
// console.log(max);

// CODING CHALLENGE #2 //////////////////////////////////////

// const dogData1 = [5, 2, 4, 1, 15, 8, 3];
// const dogData2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = function (data) {
//   const humanAges = data.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   console.log(average);
//   return average;
// };
// const avg1 = calcAverageHumanAge(dogData1);
// const avg2 = calcAverageHumanAge(dogData2);

// console.log(avg1, avg2);

// CHANNING METHOD////////////////////

// const eurToUsd = 1.1;

// //
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// CODING CHALLENGE #3 ///////////////////////////////////////
// const calcAverageHumanAge = function (data) {
//   const humanAges = data.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(adults);

//   const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;
//   console.log(average);
//   return average;
// };
// const avg1 = calcAverageHumanAge(dogData1);
// const avg2 = calcAverageHumanAge(dogData2);

// console.log(avg1, avg2);

// const dogData1 = [5, 2, 4, 1, 15, 8, 3];
// const dogData2 = [16, 6, 10, 5, 6, 1, 4];
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length , 0);

// const data1 = calcAverageHumanAge(dogData1);
// const data2 = calcAverageHumanAge(dogData2);

// console.log(data1, data2);

// FND METHOD /////////////////////////////////////////////////
// const firstWithDrawl = movements.find(mov => mov < 0);

// console.log(movements);
// console.log(firstWithDrawl);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// SAME THING BUT WITH FILTER METHOD/////////////////////////////
// const account = accounts.filter(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);

// // equality /////////////
// console.log(movements.includes(-130));

// // CONDITION ////////
// console.log(movements.some(mov => mov === -130));

// // SOME METHOD //////////////////
// const anyDeposit = movements.some(mov => mov > 1500);
// console.log(anyDeposit);

// // EVERY METHOD////////////////////////
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // SEPARATE CALLBACK
// const deposit = mov => mov < 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// // FLAT AND FLATMAP METHOD //////////////////////////////////
// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);

// flat ////////// ////////////   ///////////////////  //////////////
// const overallBalance = accounts;
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

// // FLATMAP//          ///////////////////////          //////////////////////
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)

//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance2);

// SORTING ARRAYS ////////////////////

// const owners = ['jonas ', 'zack', 'adam', 'martha'];
// console.log(owners.sort());
// console.log(owners);

// /NUMBERS//
// console.log(movements);
// console.log(movements.sort());//THIS DOES NOT WORK ///

// RETURN < 0 , A , B ( keep order)
// RETURN > 0 , B , A (switch order)

// ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });

// ShORT WAY
// movements.sort((a, b) => a - b);
// console.log(movements);

// descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b < a) return 1;
// });

// movements.sort((a, b) => b - a);
// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // EMPTY ARRAYS + FILL METHOD
// const x = new Array(7);
// console.log(x);

// x.fill(1, 5);
// console.log(x);

// arr.fill(23, 2, 7);
// console.log(arr);

// // ARRAY. FROM

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 8 }, () => 2);
// console.log(z);

// const z = Array.from(
//   { length: 100 },
//   (_, i) => Math.random(Math.trunc) * 100 + 1,
//   0
// );
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', '@'))
//   );
//   console.log(movementUI);

//   const movementUI2 = [...document.querySelectorAll('.movements__value')];
// });

// ARRAYS METHOD PRACTICE ///////////////////
// EX-1 ///////////
// const bankDepositeSum = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc > 0)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(bankDepositeSum);

// // EX-2 //////////
// // const numDeposit1000 = accounts
// //   .flatMap(acc => acc.movements)
// //   .filter(acc => acc >= 1000).length;
// // console.log(numDeposit1000);

// // OTHER WAY ////
// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
// console.log(numDeposit1000);

// // PREFIXES ++ OPERATOR//
// let a = 10;
// console.log(++a);

// console.log(a);

// // EX-3 //
// const { deposits, withdrawls } = accounts
//   .flatMap(acc => acc.movements)
//   .reduce(
//     (sums, cur) => {
//       // cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
//       sums[cur > 0 ? 'deposits' : 'withdrawls'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );
// console.log(deposits, withdrawls);

// // example of ↑↑↑↑↑↑↑↑↑ ///////////////////
// const CHALLENGE = [1, [3, 4], 6, [5, 2, 7], -7, -5, [-9, -4, -3]];
// const { minus, plus } = CHALLENGE.flat().reduce(
//   (sums, cur) => {
//     sums[cur < 0 ? 'minus' : 'plus'] += cur;
//     return sums;
//   },
//   { minus: 0, plus: 0 }
// );

// console.log(minus, plus);

// // EX-4 //////////
// // THIS IS A NICE TITLE > THIS IS A TITLE
// const convertTitalCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'the', ' but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word =>
//       exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
//     )
//     .join(' ');
//   return capitalize(titleCase);
// };
// console.log(convertTitalCase('THIS IS A NICE TITLE'));
// console.log(convertTitalCase('this is a LONG title but not too long'));
// console.log(convertTitalCase('and here is another title with an EXAMPLE'));

// CODING CHALENGE #4 //////////////

// TEST DATA: ////////////////
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// console.log(dogs);

// 2
// const dogSarah = dogs.find(dog => dog.owners.includes('sarah'));
// console.log(dogSarah);
// console.log(
//   `sarah's dog is eating too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }`
// );

// 3
const ownersEatMuch = dogs.curFood.filter(dog => dog.curFood > dog.recFood);
console.log(ownersEatMuch);
