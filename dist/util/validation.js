export function validate(validatableInput) {
    const { value, max, maxLength, min, minLength, required } = validatableInput;
    let isValid = true;
    // validations for string values
    if (required)
        isValid = isValid && value.toString().trim().length !== 0;
    if (minLength != null && typeof value === "string")
        isValid = isValid && value.length > minLength;
    if (maxLength != null && typeof value === "string")
        isValid = isValid && value.length < maxLength;
    // validations for number values
    if (min != null && typeof value === "number")
        isValid = isValid && value >= min;
    if (max != null && typeof value === "number")
        isValid = isValid && value <= max;
    return isValid;
}
