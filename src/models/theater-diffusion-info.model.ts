export default interface TheaterDiffusionInfoModel {
    theater: string,
    dates: {
        weekDay: string,
        weekNumber: string,
        hours: string[],
    }[]

}