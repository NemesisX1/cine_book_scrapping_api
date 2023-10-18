export default interface TheaterInfosModel {
    name: string,
    lang: string,
    location: string,
    locationUrl: string,
    pricing: {
        people: string,
        price: string,
    }[],
    media: {
        title: string,
        link: string,
    }[],
}