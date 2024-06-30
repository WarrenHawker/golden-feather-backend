"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandomItem = void 0;
const pickRandomItem = (arr) => {
    let randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};
exports.pickRandomItem = pickRandomItem;
