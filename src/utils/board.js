/**
 *
 * @param {any} element item to be added into array
 * @param {Number} index if -1 element is placed at the end of the array else, in the specified index
 * @param {Array} array Source array
 * @returns [] new array with element in provided index
 */
export const moveElementToIndex = (element, index, array) => {
    if (index === -1) {
        return [...array, element];
    }
    return [
        ...array.slice(0, index),
        element,
        ...array.slice(index, array.length),
    ];
};
