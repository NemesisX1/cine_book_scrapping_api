export default interface TheaterNameModel {
    country: string,
    cities: {
        name: string,
        theaters: {
            slug: string,
            name: string,
        }[]
    }[]
}