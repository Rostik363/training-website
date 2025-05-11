import 'reflect-metadata';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import { Rakun } from '../src/models/rakun';
import { container } from '../src/config/container';
import { TYPES } from '../src/types/types';
import { IDatabase } from '../src/interfaces/IDatabase';
import { MONGODB_URI } from '../src/config/env';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

// Тести API вебдодатку сайту про ракунів
describe('API вебдодатку сайту про ракунів', () => {
    // Отримуємо екземпляр бази даних з контейнера
    const database = container.get<IDatabase>(TYPES.IDatabase);
    // Створюємо спеціальний URI для тестової бази даних
    const testMongoURI = MONGODB_URI.replace(/\/[^/]*$/, '/rasuns-test');

    // Перед запуском тестів підключаємось до тестової бази даних
    before(async () => {
        await database.connect(testMongoURI);
        console.log('Підключено до тестової бази даних:', testMongoURI);
    });

    // Після всіх тестів очищуємо базу даних і відключаємося
    after(async () => {
        try {
            // Видаляємо тестову базу даних
            await mongoose.connection.db.dropDatabase();
            console.log('Тестову базу даних "rakuns-test" успішно видалено');
        } catch (error) {
            // Обробляємо можливі помилки
            console.log(
                'Помилка видалення тестової бази даних:',
                error instanceof Error ? error.message : 'Невідома помилка',
            );
        } finally {
            // В будь-якому разі відключаємося від бази даних
            await database.disconnect();
            console.log('Відключено від тестової бази даних');
        }
    });

    // Тести для перевірки підключення до бази даних
    describe('Підключення до бази даних', () => {
        it('має перевірити підключення до тестової бази даних', () => {
            expect(database.isConnected()).to.be.true;
            expect(database.getConnectionUri()).to.equal(testMongoURI);
            console.log('Підключення до бази даних успішно перевірено');
        });
    });

    // Перед кожним тестом очищуємо колекцію ракунів
    beforeEach(async () => {
        await Rakun.deleteMany({});
    });

    // Тести для створення запису про нового зракуна (POST-запит)
    describe('POST /api/rakuns', () => {
        it('має створити запис про нового зракуна', done => {
            // Тестові дані зракуна
            const rakun = {
                name: 'Вухань',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'male' as const,
                description: 'Сірий Ракун',
                feedingHabits:
                    'методи та частота пошуку їжі, одне зі списку [засідка, переслідування, сезонне накопичення запасів',
            };

            // Виконуємо POST-запит для створення запису про зракуна
            chai.request(app)
                .post('/api/rakuns')
                .send(rakun)
                .end((err, res) => {
                    if (err !== null && err !== undefined) {
                        return done(err);
                    }
                    // Перевіряємо відповідь
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('name', rakun.name);
                    expect(res.body).to.have.property('age', rakun.age);
                    expect(res.body).to.have.property('height', rakun.height);
                    expect(res.body).to.have.property('weight', rakun.weight);
                    expect(res.body).to.have.property('gender', rakun.gender);
                    expect(res.body).to.have.property('description', rakun.description);
                    expect(res.body).to.have.property('dateAdded');
                    expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
                    done();
                });
        });
    });

    // Тести для отримання всіх записів ракунів (GET-запит)
    describe('GET /api/rakuns', () => {
        it('має отримати всіх эракунів', async () => {
            // Створюємо тестовий запис коалу
            const testRakun = new Rakun({
                name: 'Білан',
                age: 3,
                height: 35,
                weight: 3.2,
                gender: 'male',
                description: 'Білий коала',
                feedingHabits: 'сезонне накопичення запасів',
            });
            await testRakun.save();

            // Виконуємо GET-запит для отримання всіх записів коал
            const res = await chai.request(app).get('/api/rakuns');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body.length).to.equal(1);
            expect(res.body[0]).to.have.property('name', 'Білан');
            expect(res.body[0]).to.have.property('gender', 'male');
            expect(res.body[0]).to.have.property('description', 'Білий коала');
            expect(res.body[0]).to.have.property('dateAdded');
            expect(res.body[0]).to.have.property('feedingHabits', 'сезонне накопичення запасів');
            expect(new Date(res.body[0].dateAdded)).to.be.instanceOf(Date);
        });
    });
    // Тести для отримання запису конкретного зракуна за ID (GET-запит)
    describe('GET /api/rakuns/:id', () => {
        it('має отримати конкретного зракуна за id', async () => {
            // Створюємо запис тестового зракуна
            const testRakun = new Rakun({
                name: 'Косий',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Коричневий ракун',
                feedingHabits: 'сезонне накопичення запасів',
            });
            const savedRakun = await testRakun.save();

            // Виконуємо GET-запит для отримання запису зракуна за ID
            const res = await chai.request(app).get(`/api/rakuns/${String(savedRakun._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Косий');
            expect(res.body).to.have.property('age', 1);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Коричневий ракун');
            expect(res.body).to.have.property('feedingHabits', 'сезонне накопичення запасів');
        });

        it('має повернути 404 для неіснуючого зракуна', async () => {
            // Виконуємо GET-запит для неіснуючого ID зракуна
            const res = await chai.request(app).get('/api/rakuns/654321654321654321654321');
            expect(res).to.have.status(404);
        });
    });

    // Тести для повного оновлення запису про зракуна (PUT-запит)
    describe('PUT /api/rakuns/:id', () => {
        it('має повністю оновити запис про зракуна', async () => {
            // Створюємо тестового зракуна
            const testRakun = new Rakun({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                feedingHabits: 'сезонне накопичення запасів',
            });
            const savedRakun = await testRakun.save();

            // Дані для оновлення зракуна
            const updatedData = {
                name: 'Оновлений',
                age: 2,
                height: 30,
                weight: 2.5,
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит для повного оновлення запису про зракуна
            const res = await chai
                .request(app)
                .put(`/api/rakuns/${String(savedRakun._id)}`)
                .send(updatedData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            expect(res.body).to.have.property('height', 30);
            expect(res.body).to.have.property('weight', 2.5);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it("має завершитися невдачею при відсутності обов'язкових полів", async () => {
            // Створюємо тестового зракуна
            const testRakun = new Rakun({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                feedingHabits: 'сезонне накопичення запасів',
            });
            const savedRakun = await testRakun.save();

            // Неповні дані для оновлення (відсутні обов'язкові поля)
            const incompleteData = {
                name: 'Оновлений',
                age: 2,
                // height і weight відсутні
                gender: 'female',
                description: 'Оновлений опис',
            };

            // Виконуємо PUT-запит з неповними даними
            const res = await chai
                .request(app)
                .put(`/api/rakuns/${String(savedRakun._id)}`)
                .send(incompleteData);

            // Перевіряємо, що запит завершився з помилкою
            expect(res).to.have.status(400);

            // Перевіряємо, що ракун не змінився
            const unchangedRakun = await Rakun.findById(savedRakun._id);
            expect(unchangedRakun).to.have.property('name', 'Оригінальний');
            expect(unchangedRakun).to.have.property('height', 25);
            expect(unchangedRakun).to.have.property('weight', 1.8);
        });
    });

    // Тести для часткового оновлення запису про зракуна (PATCH-запит)
    describe('PATCH /api/rakuns/:id', () => {
        it('має частково оновити запис про зракуна', async () => {
            // Створюємо тестового зракуна
            const testRakun = new Rakun({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                feedingHabits: 'сезонне накопичення запасів',
            });
            const savedRakun = await testRakun.save();

            // Дані для часткового оновлення
            const patchData = {
                name: 'Частково оновлений',
                age: 3,
                description: 'Оновлений опис',
                feedingHabits: 'сезонне накопичення запасів',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/rakuns/${String(savedRakun._id)}`)
                .send(patchData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Частково оновлений');
            expect(res.body).to.have.property('age', 3);
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'male');
            expect(res.body).to.have.property('description', 'Оновлений опис');
            expect(res.body).to.have.property('dateAdded');
            expect(new Date(res.body.dateAdded)).to.be.instanceOf(Date);
        });

        it('демонструє різницю між PATCH і PUT з частковими оновленнями', async () => {
            // Створюємо тестового зракуна
            const testRakun = new Rakun({
                name: 'Оригінальний',
                age: 1,
                height: 25,
                weight: 1.8,
                gender: 'male',
                description: 'Початковий опис',
                feedingHabits: 'сезонне накопичення запасів',
            });
            const savedRakun = await testRakun.save();

            // Ті самі неповні дані, що не спрацювали з PUT, мають працювати з PATCH
            const partialData = {
                name: 'Оновлений',
                age: 2,
                // height і weight навмисно відсутні
                gender: 'female',
                description: 'Оновлений опис',
                feedingHabits: 'сезонне накопичення запасів',
            };

            // Виконуємо PATCH-запит
            const res = await chai
                .request(app)
                .patch(`/api/rakuns/${String(savedRakun._id)}`)
                .send(partialData);

            // Перевіряємо результат
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('name', 'Оновлений');
            expect(res.body).to.have.property('age', 2);
            // Ці поля мають зберегти свої початкові значення
            expect(res.body).to.have.property('height', 25);
            expect(res.body).to.have.property('weight', 1.8);
            expect(res.body).to.have.property('gender', 'female');
            expect(res.body).to.have.property('description', 'Оновлений опис');
        });
    });

    // Тести для отримання метаданих (HEAD-запит)
    describe('HEAD /api/rakuns', () => {
        it('має повернути заголовки метаданих', async () => {
            // Виконуємо HEAD-запит
            const res = await chai
                .request(app)
                .head('/api/rakuns')
                .set('Accept', 'application/json');

            // Перевіряємо статус відповіді
            expect(res).to.have.status(200);

            // Виводимо отримані заголовки
            console.log('Заголовки:');
            console.log('-----------------');
            Object.entries(res.headers).forEach(([key, value]) => {
                console.log(`${key}: ${String(value)}`);
            });

            // Перевіряємо наявність необхідних заголовків
            expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
            expect(res.headers['x-powered-by']).to.equal('Express');
            expect(res.headers['content-length']).to.equal('2');
        });
    });

    // Тести для видалення запису зракуна (DELETE-запит)
    describe('DELETE /api/rakuns/:id', () => {
        it('має видалити запис про зракуна', async () => {
            // Створюємо тестового зракуна
            const testRakun = new Rakun({
                name: 'Стрибунець',
                age: 2,
                height: 28,
                weight: 2.1,
                gender: 'female',
                description: 'Чорний ракун',
                feedingHabits: 'сезонне накопичення запасів',
            });
            const savedRakun = await testRakun.save();

            // Виконуємо DELETE-запит
            const res = await chai.request(app).delete(`/api/rakuns/${String(savedRakun._id)}`);
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Запис про зракуна видалено');

            // Перевіряємо, що запис про зракуна дійсно видалено з бази
            const findRakun = await Rakun.findById(savedRakun._id);
            expect(findRakun).to.be.null;
        });
    });
});
