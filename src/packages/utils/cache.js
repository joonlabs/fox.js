/**
 * A cache prevents unnecessary execution of code when a value didn't change or the result of that code isn't needed.
 * Does not work when the value can be `undefined`
 */
export class Cache {
    value;
    #boundValue;

    /**
     * Creates a new cache
     * @param {function(*): void} validateFunc Gets called when a new value has to be validated.
     * @param {function(*, *): boolean} [equalityFunc] Gets called to compare if a new value is equal to the old one. Defaults to `===`.
     * @param {*} [initialValue=undefined] The initial value. Defaults to `undefined`.
     */
    constructor(validateFunc, equalityFunc = (val1, val2) => val1 === val2, initialValue = undefined) {
        this.validateFunc = validateFunc
        this.equalityFunc = equalityFunc
        this.value = initialValue
        this.#boundValue = initialValue
    }

    /**
     * Checks if the currently set value is different from the new value and calls the validation function if needed.
     * @param {*} [newValue] Pass a new value without having to set `value` separately.
     */
    validate(newValue) {
        if (newValue !== undefined) this.value = newValue

        if (!this.equalityFunc(this.value, this.#boundValue)) {
            this.validateFunc(this.value)
            this.#boundValue = this.value
        }

        return this.value
    }

    /**
     * Resets the bound value and forces the next validation to run the validation function
     */
    invalidate() {
        this.#boundValue = undefined
    }
}