export default class Response<T> {
    readonly data; 

    constructor(data: T)
    {
        this.data = data;
    }
}