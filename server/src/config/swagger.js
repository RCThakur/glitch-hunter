
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Glitch Hunter API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Glitch Hunter game',
    },
    servers: [
      {
        url: 'http://localhost:4001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              description: 'User\'s unique username'
            },
            experience: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  difficulty: {
                    type: 'number',
                    description: 'Difficulty level ID'
                  },
                  level: {
                    type: 'string',
                    description: 'Level ID'
                  }
                }
              }
            },
            currentDifficulty: {
              type: 'number',
              description: 'Current difficulty level'
            },
            currentLevel: {
              type: 'string',
              description: 'Current level ID'
            },
            gameIsPaused: {
              type: 'boolean',
              description: 'Game pause status'
            },
            time: {
              type: 'number',
              description: 'Time spent in game'
            }
          }
        },
        Level: {
          type: 'object',
          properties: {
            name: {
              type: 'number',
              description: 'Level number'
            },
            bots: {
              type: 'number',
              description: 'Number of bots in level'
            },
            bullets: {
              type: 'number',
              description: 'Number of bullets available'
            },
            difficulty: {
              type: 'number',
              description: 'Difficulty level ID'
            },
            defaultTime: {
              type: 'number',
              description: 'Default time for the level'
            }
          }
        },
        Difficulty: {
          type: 'object',
          properties: {
            _id: {
              type: 'number',
              description: 'Difficulty ID'
            },
            name: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Difficulty name'
            }
          }
        },
        Preferences: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'User ID'
            },
            volume: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Volume level'
            },
            sfx: {
              type: 'boolean',
              description: 'Sound effects enabled/disabled'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    './server.js',
    './src/Routes/AuthRoutes.js',
    './src/Routes/DifficultyRoutes.js',
    './src/Routes/LeaderBoardRoute.js',
    './src/Routes/LevelRoutes.js',
    './src/Routes/UserRoute.js'
  ],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
