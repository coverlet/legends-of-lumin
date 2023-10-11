/**
 * Returns weightet random key from an object
 * bases on `chance` property
 * @param chanceObject
 * @param number
 * @returns
 */

export const getRandomItems = (chanceObject: any, number: number) => {
    const keys = Object.keys(chanceObject);
    let totalChance = 0;
    const chanceMap = {} as any;
    const result = [];

    keys.forEach((k) => {
        totalChance += chanceObject[k].chance;
        chanceMap[k] = totalChance;
    });

    while (result.length < number) {
        const rand = Math.random() * totalChance;
        result.push(
            Object.keys(chanceMap).find((item) => {
                return chanceMap[item] > rand;
            })
        );
    }

    return result;
};
