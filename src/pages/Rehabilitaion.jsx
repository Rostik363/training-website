import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { API_BASE_URL } from '../config/api';
import { Toast } from 'bootstrap';

// Компонент для управління ракунівами, які перебувають на реабілітації, через API
function Rehabilitation() {  // Стан для зберігання даних та стану інтерфейсу
  const [rakuns, setKoalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Стан для модального вікна видалення
  const [rakunToDelete, setKoalaToDelete] = useState(null); // Ідентифікатор ракуніви для видалення
  const [currentKoala, setCurrentKoala] = useState(null);
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });
  
  // Посилання до елемента спливаючих сповіщень toast
  const toastRef = useRef(null);
  // Стан форми для додавання/редагування ракунів
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: 'male',
    description: '',
    feedingHabits : ''
  });

  // При рендерингу компонента, отримуємо всіх ракунів
  useEffect(() => {
    document.title = 'Реабілітація ракунів - Сайт про ракунів';
    fetchKoalas();
  }, []);

  // Показуємо toast повідомлення, коли змінюється toastMessage
  useEffect(() => {
    if (toastMessage.text && toastRef.current) {
      const toastElement = new Toast(toastRef.current);
      toastElement.show();
    }
  }, [toastMessage]);
  
  // Отримуємо всіх ракунів з API
  const fetchKoalas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/rakuns`);
      setKoalas(Array.isArray(response.data) ? response.data : []);

    } catch (err) {
      setError(`Помилка завантаження даних: ${err.message}`);
      console.error('Помилка при отриманні даних про ракунів:', err);
      setKoalas([]);

    } finally {
      setLoading(false);
    }
  };

  // Обробляємо зміни вводу у формі
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Конвертуємо числові значення з рядків у числа
    if (['age', 'height', 'weight'].includes(name)) {
      processedValue = value === '' ? '' : Number(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  // Відкриваємо модальне вікно для додавання нової ракуніви
  const handleShowAddModal = () => {
    setFormData({
      name: '',
      age: '',
      height: '',
      weight: '',
      gender: 'male',
      description: ''
    });
    setShowAddModal(true);
  };

  // Відкриваємо модальне вікно для редагування ракуніви
  const handleShowEditModal = (rakun) => {
    setCurrentKoala(rakun);
    setFormData({
      name: rakun.name,
      age: rakun.age,
      height: rakun.height,
      weight: rakun.weight,
      gender: rakun.gender,
      description: rakun.description || ''
    });
    setShowEditModal(true);
  };

  // Додаємо нову ракуна
  const handleAddKoala = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/rakuns`, formData);
      const newKoala = response.data;
      setKoalas([...rakuns, newKoala]);
      setShowAddModal(false);
      setToastMessage({ text: `Ракуніву "${newKoala.name}" успішно додано!`, type: 'success' });

    } catch (err) {
      setError(`Помилка при створенні: ${err.message}`);
      setToastMessage({ text: `Помилка при створенні: ${err.message}`, type: 'danger' });
      console.error('Помилка при додаванні ракуніви:', err);

    } finally {
      setLoading(false);
    }
  };

  // Оновлюємо існуючу ракуна
  const handleUpdateKoala = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await axios.put(`${API_BASE_URL}/rakuns/${currentKoala._id}`, formData);
      const updatedKoala = response.data;
      setKoalas(rakuns.map(rakun => 
        rakun._id === currentKoala._id ? updatedKoala : rakun
      ));
      setShowEditModal(false);
      setToastMessage({ text: `Дані про ракуна"${updatedKoala.name}" оновлено!`, type: 'success' });

    } catch (err) {
      setError(`Помилка при оновленні: ${err.message}`);
      setToastMessage({ text: `Помилка при оновленні: ${err.message}`, type: 'danger' });
      console.error('Помилка при оновленні ракуніви:', err);
      
    } finally {
      setLoading(false);
    }
  };
   
  // Показуємо модальне вікно підтвердження видалення
  const handleShowDeleteModal = (rakun) => {
    setKoalaToDelete(rakun);
    setShowDeleteModal(true);
  };

  // Видаляємо ракуна
  const handleDeleteKoala = async () => {
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/rakuns/${rakunToDelete._id}`);
      setKoalas(rakuns.filter(rakun => rakun._id !== rakunToDelete._id));
      setToastMessage({ text: `Ракуніву "${rakunToDelete.name}" успішно видалено!`, type: 'success' });
      setShowDeleteModal(false); // Закриваємо модальне вікно
      setKoalaToDelete(null); // Очищаємо дані ракуніви для видалення

    } catch (err) {
      setError(`Помилка при видаленні: ${err.message}`);
      setToastMessage({ text: `Помилка при видаленні: ${err.message}`, type: 'danger' });
      console.error('Помилка при видаленні ракуніви:', err);

    } finally {
      setLoading(false);
    }
  };

  // Форматуємо дату для відображення
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };
  
  return (
    <main className="container px-4 py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 text-success">Реабілітація ракунів</h1>
        <button 
          className="btn btn-success" 
          onClick={handleShowAddModal}
          disabled={loading}
        >
          Додати ракуна
        </button>
      </header>

      {/* Повідомлення про помилку */}
      {error && (
        <section className="alert alert-danger mb-4" role="alert">
          {error}
        </section>
      )}
      
      {/* Toast для повідомлень */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div 
          ref={toastRef}
          className={`toast align-items-center text-white bg-${toastMessage.type} border-0`} 
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
          data-bs-delay="3000"
        >
          <div className="d-flex">
            <div className="toast-body">
              {toastMessage.text}
            </div>
            <button 
              type="button" 
              className="btn-close btn-close-white me-2 m-auto" 
              data-bs-dismiss="toast" 
              aria-label="Закрити"
            ></button>
          </div>
        </div>
      </div>

      {/* Таблиця ракунів */}
      {loading && !error && (
        <div className="text-center my-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Завантаження...</span>
          </div>
          <p className="mt-2">Завантаження записів ракунів...</p>
        </div>
      )}
      
      {!loading && rakuns.length === 0 && (
        <section className="alert alert-info">
          Немає доступних записів про ракунів у реабілітації. Додайте першу ракуна!
        </section>
      )}
      
      {!loading && rakuns.length > 0 && (
        <section className="table-responsive">
          <table className="table table-striped table-bordered table-hover vertical-align-middle">
            <thead>
              <tr>
                <th>Ім'я</th>
                <th>Вік (роки)</th>
                <th>Висота (см)</th>
                <th>Вага (кг)</th>
                <th>Стать</th>
                <th>Опис</th>
                <th>К-ть з'їденого евкаліпту за день (кг)</th>
                <th>Дата додавання</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {rakuns.map(rakun => (
                <tr key={rakun._id}>
                  <td>{rakun.name}</td>
                  <td>{rakun.age}</td>
                  <td>{rakun.height}</td>
                  <td>{rakun.weight}</td>
                  <td>{rakun.gender === 'male' ? 'Самець' : 'Самиця'}</td>
                  <td>{rakun.description}</td>
                  <td>{rakun.feedingHabits }</td>
                  <td>{rakun.dateAdded ? formatDate(rakun.dateAdded) : 'Н/Д'}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleShowEditModal(rakun)}
                      disabled={loading}
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleShowDeleteModal(rakun)}
                      disabled={loading}
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Модальне вікно для додавання нової ракуніви */}
      <div 
        className={`modal fade ${showAddModal ? 'show' : ''}`} 
        id="addKoalaModal" 
        tabIndex="-1" 
        aria-labelledby="addKoalaModalLabel" 
        aria-hidden="true"
        style={{ display: showAddModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="addKoalaModalLabel">Додати нову ракуна</h2>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleAddKoala}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="height" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="weight" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select 
                        className="form-select" 
                        id="gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самиця</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea 
                        className="form-control" 
                        id="description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="feedingHabits " className="col-sm-3 col-form-label">Кількість з'їденого листя евкаліпту за день, кг</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="feedingHabits " 
                        name="feedingHabits " 
                        value={formData.feedingHabits } 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                </fieldset>
                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowAddModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Додати ракуна'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна додавання */}
      {showAddModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowAddModal(false)}></div>
      )}

      {/* Модальне вікно для редагування існуючої ракуніви */}
      <div 
        className={`modal fade ${showEditModal ? 'show' : ''}`} 
        id="editKoalaModal" 
        tabIndex="-1" 
        aria-labelledby="editKoalaModalLabel" 
        aria-hidden="true"
        style={{ display: showEditModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="editKoalaModalLabel">Редагувати ракуна</h2>
              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              <form onSubmit={handleUpdateKoala}>
                <fieldset>
                  <div className="row mb-3">
                    <label htmlFor="edit-name" className="col-sm-3 col-form-label">Ім'я</label>
                    <div className="col-sm-9">
                      <input 
                        type="text" 
                        className="form-control" 
                        id="edit-name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-age" className="col-sm-3 col-form-label">Вік (роки)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-height" className="col-sm-3 col-form-label">Висота (см)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-height" 
                        name="height" 
                        value={formData.height} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-weight" className="col-sm-3 col-form-label">Вага (кг)</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="edit-weight" 
                        name="weight" 
                        value={formData.weight} 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-gender" className="col-sm-3 col-form-label">Стать</label>
                    <div className="col-sm-9">
                      <select 
                        className="form-select" 
                        id="edit-gender" 
                        name="gender" 
                        value={formData.gender} 
                        onChange={handleInputChange}
                        required
                      >
                        <option value="male">Самець</option>
                        <option value="female">Самка</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-description" className="col-sm-3 col-form-label">Опис</label>
                    <div className="col-sm-9">
                      <textarea 
                        className="form-control" 
                        id="edit-description" 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={3}
                      ></textarea>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <label htmlFor="edit-feedingHabits " className="col-sm-3 col-form-label">Кількість з'їденого листя евкаліпту за день, кг</label>
                    <div className="col-sm-9">
                      <input 
                        type="number" 
                        className="form-control" 
                        id="feedingHabits " 
                        name="feedingHabits " 
                        value={formData.feedingHabits } 
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                </fieldset>                <footer className="d-flex justify-content-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={() => setShowEditModal(false)}>
                    Скасувати
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Зачекайте...
                      </>
                    ) : 'Зберегти зміни'}
                  </button>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна редагування */}
      {showEditModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowEditModal(false)}></div>
      )}

      {/* Модальне вікно для підтвердження видалення ракуніви */}
      <div 
        className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
        id="deleteKoalaModal" 
        tabIndex="-1" 
        aria-labelledby="deleteKoalaModalLabel" 
        aria-hidden="true"
        style={{ display: showDeleteModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title h5" id="deleteKoalaModalLabel">Підтвердження видалення</h2>
              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Закрити"></button>
            </header>
            <div className="modal-body">
              {rakunToDelete && (
                <p>Ви впевнені, що хочете видалити ракуна <strong>{rakunToDelete.name}</strong>?</p>
              )}
            </div>
            <footer className="modal-footer">              <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Скасувати
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={handleDeleteKoala}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Видалення...
                  </>
                ) : 'Видалити'}
              </button>
            </footer>
          </div>
        </div>
      </div>
      
      {/* Фон для модального вікна видалення */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show" 
             onClick={() => setShowDeleteModal(false)}></div>
      )}
    </main>
  );
}

export default Rehabilitation;