const INITIAL_STATE = [{}];

export default (state = INITIAL_STATE,action) => {
    switch (action.type) {
        case 'addCart':
            return {...INITIAL_STATE,produk:action.payload.produk,qty:action.payload.qty};
        case 'removeCart':
            return {...INITIAL_STATE,produk: 0,};
        default:
            return state
    }
}
