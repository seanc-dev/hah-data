module.exports = {

    sumArray: function (array) {

        for (let i = 0; i < array.length; i++) if(typeof Number(array[i]) !== 'number') return new Error("Array item at index " + i + " is not a number");

        let sum = array.reduce((acc, val, i) => {
            acc += val
            return acc;
        }, 0)

        return sum;

    }

}