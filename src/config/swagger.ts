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
    // Визначення кінцевих точок (endpoints) REST API та операцій з ними
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

            // POST запит для створення нового зракуна
            post: {
                summary: 'Створити нового зракуна',
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
                        description: "Створений об'єкт зракуна",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                },
            },
        },

        // Операції для конкретного зракуна за ID
        '/api/rakuns/{id}': {
            // GET запит для отримання зракуна за ID
            get: {
                summary: 'Отримати зракуна за ID',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зракуна',
                        feedingHabits: '',
                    },
                ],
                responses: {
                    '200': {
                        description: "Об'єкт зракуна",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                    '404': { description: 'Ракуна не знайдено' },
                },
            },

            // PUT запит для повного оновлення зракуна за ID
            put: {
                summary: 'Повністю оновити зракуна',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зракуна',
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
                        description: "Оновлений об'єкт зракуна",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                    '404': { description: 'Ракуна не знайдено' },
                },
            },
            // PATCH запит для часткового оновлення зракуна за ID
            patch: {
                summary: 'Частково оновити зракуна',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зракуна',
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
                        description: "Оновлений об'єкт зракуна",
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Rakun' },
                            },
                        },
                    },
                    '404': { description: 'Ракуна не знайдено' },
                },
            },
            // DELETE запит для видалення даних про зракуна за ID
            delete: {
                summary: 'Видалити дані про зракуна',
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: { type: 'string' },
                        description: 'ID зракуна',
                        feedingHabits: '',
                    },
                ],
                responses: {
                    '200': { description: 'Повідомлення про успішне видалення' },
                    '404': { description: 'Ракуна не знайдено' },
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
                        description: "Ім'я зракуна",
                    },
                    age: {
                        type: 'number',
                        description: 'Вік зракуна у роках',
                    },
                    height: {
                        type: 'number',
                        description: 'Висота зракуна в сантиметрах',
                    },
                    weight: {
                        type: 'number',
                        description: 'Вага зракуна в кілограмах',
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female'],
                        description: 'Стать зракуна',
                    },
                    description: {
                        type: 'string',
                        description: "Опис коалу (необов'язкове поле)",
                    },
                    eatenEucalyptus: {
                        type: 'string',
                        description:
                            'методи та частота пошуку їжі, одне зі списку [засідка, переслідування, сезонне накопичення запасів',
                    },
                },
            },
        },
    },
};
