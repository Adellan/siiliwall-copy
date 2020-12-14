export const add3Dots = (name, nameLimit) => {
    const dots = '...'
    if (name.length > nameLimit) {
        name = name.substring(0, nameLimit) + dots
    }
    return name
}