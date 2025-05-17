function Morphology() {
  return (
    <main className="container px-4 py-4">
      <article>
        <section>
          <h3 className="h3 text-success">Зовнішній вигляд</h3>
          <p>Ракун — невелика тварина зі збитим тілом.</p>
        </section>
        <section>
          <h3 className="h3 text-success">Особливості будови</h3>
          <ul>
            <li>Довжина тіла становить 60—82 см; маса від 5 до 16 кг.</li>
            <li>Хвіст дуже короткий, ззовні непомітний. Голова велика та широка, зі сплюснутим «обличчям».</li>
            <li>Вуха великі, з колоподібними кінчиками, покриті хутром. Очі маленькі. Ніс без волосся, чорний. На морді знаходяться мішки.</li>
          </ul>
        </section>
        <figure className="text-center">
          <img src="/images/everyday-carry-flickr-3bsjpg.webp" alt="Ракун в лісі" className="img-fluid rounded my-4"/>
          <figcaption className="text-muted">Ракун в лісі</figcaption>
        </figure>
      </article>
    </main>
  );
}

export default Morphology;