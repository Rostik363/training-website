function Nutrition() {
  return (
    <main className="container px-4 py-4 flex-grow-1">
      <section>
        <h2 className="h2 text-success mb-4">Харчування ракунів</h2>
        <p>Тваринки харчуються тільки листям і корою евкаліпта:</p>
        <ul className="list-group">
          <li className="list-group-item">У Новому Південному Велсі ракун вживає листя блакитного та сірого евкаліптів.</li>
          <li className="list-group-item">У штаті Вікторія — евкаліпт «манна».</li>
          <li className="list-group-item">Тварини практично не п’ють воду, адже їх улюблене листя містять більше 90% рідини, необхідної для них.</li>
        </ul>
      </section>
    </main>
  );
}

export default Nutrition;