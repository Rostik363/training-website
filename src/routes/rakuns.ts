import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { RakunRepository } from '../repositories/RakunRepository';

// Створюємо новий обробник HTTP-запитів Express
const router = Router();
// Отримуємо екземпляр репозиторію ракунів з контейнера інверсії залежностей
const rakunRepository = container.get(RakunRepository);

// Обробка HTTP-запиту GET / - отримання всіх записів ракунів
router.get('/', (async (_req: Request, res: Response) => {
    try {
        // Отримуємо всі записи ракунів з бази даних через репозиторій
        const rakuns = await rakunRepository.findAll();
        res.json(rakuns);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту GET /:id - отримання запису одного зракуна за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук зракуна за ідентифікатором
        const rakun = await rakunRepository.findById(req.params.id);
        if (rakun) {
            res.json(rakun);
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис зракуна не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту POST / - створення нового запису зракуна
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис зракуна з даних запиту
        const newRakun = await rakunRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного зракуна
        res.status(201).json(newRakun);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PUT /:id - повне оновлення запису зракуна
router.put('/:id', (async (req: Request, res: Response) => {
    try {
        // Перевірка наявності всіх обов'язкових полів для PUT запиту
        const requiredFields = ['name', 'age', 'height', 'weight', 'gender'];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        // Якщо є відсутні поля, повертаємо помилку 400 Bad Request
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Відсутні обов'язкові поля: ${missingFields.join(', ')}`,
            });
        }

        // Оновлюємо зракуна з вказаним ID
        const rakun = await rakunRepository.update(req.params.id, req.body);
        if (rakun) {
            return res.json(rakun);
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис зракуна не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту PATCH /:id - часткове оновлення запису зракуна
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису зракуна - передаються лише ті поля, які потрібно змінити
        const rakun = await rakunRepository.patch(req.params.id, req.body);
        if (rakun) {
            res.json(rakun);
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис зракуна не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Обробка HTTP-запиту DELETE /:id - видалення запису зракуна
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про зракуна за ID
        const rakun = await rakunRepository.delete(req.params.id);
        if (rakun) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про зракуна видалено' });
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про зракуна не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
