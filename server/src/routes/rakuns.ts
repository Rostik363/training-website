import { Router, Request, Response } from 'express';
import { container } from '../config/container';
import { RakunRepository } from '../repositories/RakunRepository';

// Створюємо новий роутер Express
const router = Router();
// Отримуємо екземпляр репозиторію ракунів з контейнера інверсії залежностей
const rakunRepository = container.get(RakunRepository);

// Роутер для HTTP метода GET / - отримання всіх записів ракунів
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

// Роутер для HTTP метода GET /:id - отримання запису одного ракуніву за ідентифікатором
router.get('/:id', (async (req: Request, res: Response) => {
    try {
        // Пошук ракуніву за ідентифікатором
        const rakun = await rakunRepository.findById(req.params.id);
        if (rakun) {
            res.json(rakun);
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис ракуніву не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода POST / - створення нового запису ракуніву
router.post('/', (async (req: Request, res: Response) => {
    try {
        // Створюємо новий запис ракуни з даних запиту
        const newRakun = await rakunRepository.create(req.body);
        // Повертаємо статус 201 (Created) і дані створеного ракуніву
        res.status(201).json(newRakun);
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PUT /:id - повне оновлення запису ракуніву
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

        // Оновлюємо ракунів з вказаним ID
        const rakun = await rakunRepository.update(req.params.id, req.body);
        if (rakun) {
            return res.json(rakun);
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            return res.status(404).json({ message: 'Запис ракуніву не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        return res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода PATCH /:id - часткове оновлення запису ракуніву
router.patch('/:id', (async (req: Request, res: Response) => {
    try {
        // Часткове оновлення запису ракунів - передаються лише ті поля, які потрібно змінити
        const rakun = await rakunRepository.patch(req.params.id, req.body);
        if (rakun) {
            res.json(rakun);
        } else {
            // Якщо ракун не знайдений, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис ракуніву не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(400).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

// Роутер для HTTP метода DELETE /:id - видалення запису ракуніву
router.delete('/:id', (async (req: Request, res: Response) => {
    try {
        // Видаляємо дані про ракуніву за ID
        const rakun = await rakunRepository.delete(req.params.id);
        if (rakun) {
            // У разі успіху повертаємо повідомлення про видалення
            res.json({ message: 'Запис про ракуніву видалено' });
        } else {
            // Якщо ракун не знайдена, повертаємо 404 помилку
            res.status(404).json({ message: 'Запис про ракуніву не знайдено' });
        }
    } catch (error) {
        // Обробка помилки
        const errorMessage = error instanceof Error ? error.message : 'Виникла невідома помилка';
        res.status(500).json({ message: errorMessage });
    }
}) as unknown as (req: Request, res: Response) => void);

export default router;
