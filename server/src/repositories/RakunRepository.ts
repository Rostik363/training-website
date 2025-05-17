import { injectable } from 'inversify';
import { Rakun, IRakun } from '../models/rakun';

// Клас-репозиторій для роботи з ракунівуми
// Анотація injectable дозволяє впровадити цей репозиторій через IoC контейнер
@injectable()
export class RakunRepository {
    // Метод для отримання всіх ракунів з бази даних
    public async findAll(): Promise<IRakun[]> {
        return Rakun.find();
    }

    // Метод для пошуку ракуни за унікальним ідентифікатором
    public async findById(id: string): Promise<IRakun | null> {
        return Rakun.findById(id);
    }

    // Метод для створення нової ракуни в базі даних
    public async create(rakunData: IRakun): Promise<IRakun> {
        const rakun = new Rakun(rakunData);
        return rakun.save();
    }

    // Метод для видалення ракунів за ідентифікатором
    public async delete(id: string): Promise<boolean> {
        const result = await Rakun.findByIdAndDelete(id);
        return result !== null;
    }

    // Метод для повного оновлення даних про ракуніву (заміна всіх полів)
    public async update(id: string, rakunData: IRakun): Promise<IRakun | null> {
        return Rakun.findByIdAndUpdate(id, rakunData, { new: true });
    }

    // Метод для часткового оновлення даних про ракуніву (оновлення лише вказаних полів)
    public async patch(id: string, rakunData: Partial<IRakun>): Promise<IRakun | null> {
        return Rakun.findByIdAndUpdate(id, { $set: rakunData }, { new: true });
    }
}
