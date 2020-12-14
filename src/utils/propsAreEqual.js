import isEqual from 'lodash.isequal'

const propsAreEqual = (prevProps, nextProps) => {
    if (isEqual(prevProps, nextProps)) {
        return true
    }
    return false
}

export default propsAreEqual
