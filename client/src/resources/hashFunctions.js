export const getHash = (object) => {
    return require('crypto').createHash('md5').update(JSON.stringify(object)).digest("hex")
}

/**
 * Checks hashes of 2 objects
 * @param {*} object1 First object to check
 * @param {*} object2 Second object to check
 * @returns Boolean if they are equal (not strong)
 */
export const areEqual = (object1, object2) => {
    return getHash(object1) === getHash(object2)
}