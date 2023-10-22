export default interface TheaterMovieDiffusionInfoModel {
    theater: string,
    dates: {
        weekDay: string,
        weekNumber: string,
        hours: string[],
    }[]

}