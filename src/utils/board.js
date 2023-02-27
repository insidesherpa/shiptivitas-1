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
