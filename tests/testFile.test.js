import Ship from "../src/Ship.js" 
import Gameboard from "../src/Gameboard.js"

function ShipTests() {
    const newShip = new Ship(2); 

    test('Sinking tests', () => {
        newShip.hit(); 
        expect(newShip.isSunk()).toBe(false);
        newShip.hit(); 
        expect(newShip.isSunk()).toBe(true);
        newShip.hit(); 
        expect(newShip.isSunk()).toBe(true);
    }) 
}

function gameBoardTests() {

    const newGameboard = new Gameboard(4, 4); 
    const newShip = new Ship(2, 'E', 0);
    const newShip2 = new Ship(3, 'E', 1);
    const newShip3 = new Ship(3, 'E', 2);
    const newShip4 = new Ship(4, 'S', 3);
    const newShip5 = new Ship(3, 'N', 4); 

    test('Initialize gameboard', () => {
        expect(newGameboard.cells).toEqual([[null, null, null, null],[null, null, null, null],[null, null, null, null],[null, null, null, null]]);
    })

    test('Place ship', () => {
        expect(newGameboard.placeShip(newShip, [0, 1])).toBe(true);
    })

    test('Place ship [2,1]', () => {
        expect(newGameboard.placeShip(newShip2, [2, 1])).toBe(true);
    })

    test('Place ship out of bounds E', () => {
        expect(newGameboard.placeShip(newShip3, [2, 2])).toBe(false);
    })

    test('Place ship in already shipped', () => {
        expect(newGameboard.placeShip(newShip3, [2, 1])).toBe(false);
    })

    test('Vertical ship OOB', () => {
        expect(newGameboard.placeShip(newShip4, [1, 0])).toBe(false);
    })

    test('Vertical ship OOB', () => {
        expect(newGameboard.placeShip(newShip5, [1, 0])).toBe(false);
    })

    test('Vertical ship', () => {
        expect(newGameboard.placeShip(newShip4, [0, 0])).toBe(true);
    })

    test('Erase ship', () => {
        newGameboard.eraseShip(newShip4);
        expect(newGameboard.coordIsEmpty(newShip4.head)).toBe(true);
    })

    test('Move ship', () => {
        newGameboard.moveShip([2,1], [3, 0]);
    })
}

ShipTests(); 
gameBoardTests(); 

