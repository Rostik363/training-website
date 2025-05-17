import npm run server:start{ Schema, model } from 'mongoose';

// Інтерфейс для об'єкта "Ракун"
interface IRakun {
    name: string; // Ім'я ракуни
    age: number; // Вік ракуни у роках
    height: number; // Висота ракуни в сантиметрах
    weight: number; // Вага ракуни в кілограмах
    gender: 'male' | 'female'; // Стать ракуни: 'male' - самець, 'female' - самка
    description?: string; // Опис ракуни (необов'язкове поле)
    feedingHabits: string; // Частота пошуку їжі
    dateAdded: Date; // Дата додавання запису до бази даних
}

// Схема MongoDB для моделі "Ракун"
const rakunSchema = new Schema<IRakun>({
    name: {
        type: String,
        required: true, // Поле є обов'язковим
    },
    age: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    height: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    weight: {
        type: Number,
        required: true, // Поле є обов'язковим
    },
    gender: {
        type: String,
        required: true, // Поле є обов'язковим
        enum: ['male', 'female'], // Допустимі значення: 'male' або 'female'
    },
    description: String, // Необов'язкове текстове поле
    dateAdded: {
        type: Date,
        default: Date.now, // Значення за замовчуванням - поточна дата і час
    },
    feedingHabits: {
        type: String,
        required: true, // Поле є обов'язковим
    },
});

// Створення моделі Mongoose на основі схеми
export const Rakun = model<IRakun>('Rakun', rakunSchema);
export type { IRakun }; // Експортуємо інтерфейс для використання в інших файлах
