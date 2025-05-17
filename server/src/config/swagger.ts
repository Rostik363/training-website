// Експорт специфікації Swagger/OpenAPI для документації про API
export const swaggerSpec = {
    // Версія специфікації OpenAPI
    openapi: '3.0.0',
    // Загальна інформація про API
    info: {
        title: 'API Сайту про Ракунів',
        version: '1.0.0',
        description: 'Документація API для Сайту про Ракунів',
    },
    // Налаштування серверів для тестування API
    servers: [
        {
            url:
                process.env.CODESPACE_NAME !== undefined
                    ? `https://${process.env.CODESPACE_NAME}-5000.app.github.dev`
                    : 'http://localhost:5000',
            description: 'Development server',
        },
    ],
    // Визначення роутерів API та операцій з ними
    paths: {
        '/api/rakuns': {
            // GET запит для отримання всіх ракунів
            get: {
                summary: 'Отримати всіх ракунів',
                responses: {
                    '200': {
                        description: 'Список всіх ракунів',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Rakun' },
                                },
                            },
                        },
                    },
                },
            },

            // POST запит для створення нового ракуніву
            post: {
                summary: 'Створити нового ракуніву',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Rakun' },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: "Створений об'єкт ракуніву",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного ракуніву за ID
        '/api/rakuns/{id}': {
            // GET запит для отримання ракуніву за ID
            get: {
                summary: 'Отримати ракуніву за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID ракуніву',
                        feedingHabits: '',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт ракуніву",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                    '404': { description: 'Ракуніву не знайдено' },
                },
            },

            // PUT запит для повного оновлення ракуніву за ID
            put: {
                summary: 'Повністю оновити ракуніву',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID ракуніву',
                        feedingHabits: '',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Rakun' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт ракуніву",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                    '404': { description: 'Ракуніву не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення ракуніву за ID
            patch: {
                summary: 'Частково оновити ракуніву',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID ракуніву',
                        feedingHabits: '',
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/Rakun' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: "Оновлений об'єкт ракуніву",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                    '404': { description: 'Ракуніву не знайдено' },
                },
            },
            // DELETE запит для видалення даних про ракуніву за ID
            delete: {
                summary: 'Видалити дані про ракуніву',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID ракуніву',
                        feedingHabits: '',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Ракуніву не знайдено' },
                },
            },
        },
    },

    // Визначення компонентів для повторного використання
    components: {
        // Схеми даних
        schemas: {
            // Схема об'єкта Ракун
            Rakun: {
                type: 'object',
                required: ['name', 'age', 'height', 'weight', 'gender'],
                properties: {
                    name: {
                        type: 'string',
                        description: "Ім'я ракуніву",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік ракуніву у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота ракуніву в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага ракуніву в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать ракуніву',
                    },
                    description: {
                        type: 'string',
                        description: "Опис ракуніву (необов'язкове поле)",
                    },
                    feedingHabits: {
                        type: 'string',
                        description: 'Кількість зїдання  евкалипта в день',
                    },
                },
            },
        },
    },
};
