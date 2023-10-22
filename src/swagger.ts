import { config } from 'dotenv';
import path from 'path';
import swaggerAutogen from 'swagger-autogen';

config();

const doc = {
    info: {
        version: '',      // by default: '1.0.0'
        title: 'Canal Olympia Scrapping REST API',        // by default: 'REST API'
        description: '',  // by default: ''
        license: {
            name: 'MIT Licence',
            url: 'https://github.com/NemesisX1/canal_olympia_scrapping_api/blob/main/LICENSE.md'
        }
    },
    tags: [
        {
            name: '/',             // Tag name
            description: ''       // Tag description
        },
        
        {
            name: 'Theaters',             // Tag name
            description: 'Fetch theaters informations'       // Tag description
        },

        {
            name: 'Movies',             // Tag name
            description: 'Fetch movies informations'       // Tag description
        },

    ],
    basePath: '/',  // by default: '/'
    schemes: [],   // by default: ['http']
    consumes: [],  // by default: ['application/json']
    produces: [],  // by default: ['application/json']
    securityDefinitions: {},  // by default: empty object

    definitions: {
       
        TheaterMovie: {
            title: 'The Creator',
            slug: 'the-creator',
            genre: 'Horror',
            duration: '1h20',
            releaseDate: '10-10-2023',
            descriptionBrief: 'This is a nice movie',
            trailerLink: 'https://example.com',
        },

        TheaterMovieBrief: {
            title: 'The Creator',
            slug: 'the-creator',
            date: '10-10-2023',
            hour: '1h12',
            language: 'en',
            img: 'https://example.com',
            url: 'https://example.com',
        },

        TheaterMovieDiffusionInfo: {
            theater: 'wologuede',
            dates: [
                {
                    weekDay: 'Mar',
                    weekNumber: '23',
                    hours: [
                        '10:40', '10:50'
                    ],
                }
            ]
        },

        TheaterInfos: {
            name: 'wologuede',
            lang: 'en',
            location: 'Cotonou',
            locationUrl: 'https://example.com',
            pricing: [{
                people: 'Children',
                price: '1500 XOF',
            }],
            media: [{
                title: 'Canal Olympia',
                link: 'https://example.com',
            }],
        }

    },          // by default: empty object (Swagger 2.0)
    components: {}
} // update doc

const outputFile = './docs/swagger-output.json';

const endpointsFiles = [
    path.join(__dirname, 'app.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, {
    ...doc,
    host: process.env.BASE_API_URL
});