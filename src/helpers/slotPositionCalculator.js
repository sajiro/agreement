/* eslint-disable */

// Replacement for ember's object get/set
const get = (object, key) => object[key]
const set = (object, key, value) => {
    object[key] = value
}

export const slotSorter = (a, b) => {
    if (a.position === b.position) {
        return a.id - b.id
    }

    return a.position - b.position
}

const maxPosition = 2147483647;
const defaultSeed = 10000000;
let _currentSlots;
let _newSlots;
let _previousSlotIndex;
let _nextSlotIndex;
let _counter;
let _noOfSlots;
let _previousSlot;
let _nextSlot;

export function calculateSlotPositions(currentSlots, newSlots, insertAt) {
    if (newSlots == undefined || newSlots.length === 0) {
        throw 'Nothing to add to new current slot list.';
    }
    _previousSlotIndex = 0;
    _nextSlotIndex = 0;
    _counter = 0;
    _noOfSlots = 0;
    _previousSlot = undefined;
    _nextSlot = undefined;
    _newSlots = newSlots;
    _noOfSlots = newSlots.length;

    setCurrentSlots(currentSlots || []);
    setNeighbours(insertAt);
    if (!isAtSamePosition()) {
        removeExistingSlots();
        let seed = getSeed();
        updateSlots(seed);
    }

    return cleanUpCurrentSlots();
}

/**
 * @description sort slots by position and set the start and end index of an array with default positions
 * @param {*} currentSlots
 */
function setCurrentSlots(currentSlots) {
    currentSlots.unshift({ 'position': 0, id: 0 })
    currentSlots.push({ 'position': maxPosition, id: maxPosition });
    _currentSlots = currentSlots.sort(slotSorter);
}

/**
 * @description clean up the start and end items in the array.
 */
function cleanUpCurrentSlots() {
    return _currentSlots.slice(1, _currentSlots.length - 1);
}

/**
 * @description increment the index by 1 before caluclating the neighbours as we have added start and end postions.
 */
function setNeighbours(index) {
    if (index > (_currentSlots.length - 2) || index < 0) {
        throw 'Index is out of range from the number of slots.';
    }

    index = index + 1;
    if (_currentSlots.length > 0) {
        _previousSlot = index > 0 && index <= _currentSlots.length ? _currentSlots[index - 1] : undefined;
        _nextSlot = index >= 0 && index < _currentSlots.length ? _currentSlots[index] : undefined;
    }
}

/**
 * @description if the item is dragged and dropped at the same position skip recalculation
 */
function isAtSamePosition() {
    if (_newSlots[0] === null) {
        throw 'invalid object to insert';
    }

    return (get(_previousSlot, 'id') === _newSlots[0].id || get(_nextSlot, 'id') === _newSlots[0].id);
}

/**
 * @description clean up the slots array with existing items on re-arrange.
 */
function removeExistingSlots() {
    _newSlots.forEach(item => {
        let existingIndex = _currentSlots.findIndex(s => s.id === item.id);
        let existing = _currentSlots[existingIndex]
        if (existing) {
            _currentSlots.splice(existingIndex, 1);
        }
    });
}

/**
 * @description insert the new slots in the array and calculate the seed for the required items.
 * @param {*} seed
 */
function updateSlots(seed) {
    let index = _previousSlotIndex;

    _newSlots.forEach(item => {
        _currentSlots.splice(++index, 0, item);
    });

    let startIndex = _previousSlot ? _currentSlots.findIndex(s => s.id === _previousSlot.id) : 0;
    let endIndex = _nextSlot ? _currentSlots.findIndex(s => s.id === _nextSlot.id) : _currentSlots.length - 1;
    let position = _previousSlot ? get(_previousSlot, 'position') : 0;

    for (let i = startIndex + 1; i < endIndex; i++) {
        position = position + seed;
        let slot = _currentSlots[i];
        set(slot, 'position', position);
        if (get(slot, 'id')) {
            set(slot, '_patched', true);
        }
    }

    return _currentSlots;
}

/**
 * @description
 * 1. start with default seed on initial add
 * 2. use default seed when adding items to the end
 * @param {*} currentSlots
 * @param {*} newSlots
 * @param {*} previous
 * @param {*} next
 */
function getSeed() {
    let previousPosition = -1;
    let nextPosition = -1;

    if (_previousSlot) {
        previousPosition = get(_previousSlot, 'position');
        _previousSlotIndex = _currentSlots.findIndex(s => s.id === _previousSlot.id);
    }

    if (_nextSlot) {
        nextPosition = get(_nextSlot, 'position');
        _nextSlotIndex = _currentSlots.findIndex(s => s.id === _nextSlot.id);
    }

    let noOfSlots = _newSlots.length;

    if (previousPosition === -1 && nextPosition === -1) {
        if (isSeedValid(0, maxPosition, noOfSlots, defaultSeed)) {
            return defaultSeed;
        }
        else {
            return calculateSeed(0, maxPosition, noOfSlots);
        }
    }
    else if (nextPosition === -1) {
        if (isSeedValid(previousPosition, maxPosition, noOfSlots, defaultSeed)) {
            return defaultSeed;
        }
        else {
            let seed = calculateSeed(previousPosition, maxPosition, noOfSlots);
            if (!isSeedValid(previousPosition, maxPosition, noOfSlots, seed)) {
                seed = traverse();
            }
            return seed;
        }
    }
    else if (previousPosition === -1) {
        if (isSeedValid(0, nextPosition, noOfSlots, defaultSeed)) {
            return defaultSeed;
        }
        else {
            let seed = calculateSeed(0, nextPosition, noOfSlots);
            if (!isSeedValid(0, nextPosition, noOfSlots, seed)) {
                seed = traverse();
            }
            return seed;
        }
    }
    else {
        let seed = calculateSeed(previousPosition, nextPosition, noOfSlots);
        if (!isSeedValid(previousPosition, nextPosition, noOfSlots, seed)) {
            seed = traverse();
        }
        return seed;
    }
}

/**
 * @description traveserse up and down the list to reposition.
 * For templates created with old template positioning logic recalculate the position for all the slots.
 */
function traverse() {
    let seed = 0;
    do {
        _counter++;
        seed = shiftUp();
        if (isValid(seed)) {
            _previousSlot = _previousSlotIndex - _counter >= 0 ? _currentSlots[_previousSlotIndex - _counter] : undefined;
            break;
        } else {
            seed = shiftDown();
            if (isValid(seed)) {
                _nextSlot = (_nextSlotIndex + _counter < _currentSlots.length) ? _currentSlots[_nextSlotIndex + _counter] : undefined;
                break;
            }
        }
    } while ((_previousSlotIndex - _counter >= 0) || (_nextSlotIndex + _counter <= _currentSlots.length));

    if (seed === 0) {
        seed = defaultSeed;
        _previousSlot = undefined;
        _nextSlot = undefined;
    }
    return seed;
}

/**
 * @description traverse up if possible else return seed as zero
 */
function shiftUp() {
    if ((_previousSlotIndex - _counter) >= 0) {
        let previousPosition = get(_currentSlots[_previousSlotIndex - _counter], 'position');
        let nextPosition = get(_currentSlots[_nextSlotIndex], 'position');
        return calculateSeed(previousPosition, nextPosition, _noOfSlots + _counter);
    }
}

/**
 * @description traverse down if possible else return seed as zero
 */
function shiftDown() {
    if ((_nextSlotIndex + _counter) < _currentSlots.length) {
        let previousPosition = get(_currentSlots[_previousSlotIndex], 'position');
        let nextPosition = get(_currentSlots[_nextSlotIndex + _counter], 'position');
        return calculateSeed(previousPosition, nextPosition, _noOfSlots + _counter);
    }
}

/**
 * @description check if last position of the slot being added is less than its next sibling.
 * @param {number} start - start position
 * @param {number} end - end position
 * @param {number} noOfSlots - total no of slots to be added before the end position
 * @param {number} seed
 */
function isSeedValid(start, end, noOfSlots, seed) {
    return seed > 0 && start + (seed * noOfSlots) < end ? true : false;
}

/**
 * @description seed should always be greater than 0 to accomodate atleast one slot.
 * @param {number} seed
 */
function isValid(seed) {
    return seed > 0;
}

function calculateSeed(start, end, noOfSlots) {
    return parseInt((end - start) / (noOfSlots + 1));
}