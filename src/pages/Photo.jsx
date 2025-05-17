import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Photo() {
  const images = [
    { src: '/images/1200px-afternoon-nap-147513865jpeg.webp', alt: 'Ракун на дереві 1' },
    { src: '/images/australia-2017-45-42510471610jpg.webp', alt: 'Ракун на дереві 2' },
    { src: '/images/everyday-carry-flickr-3bsjpg.webp', alt: 'Ракун в лісі' },
    { src: '/images/rakun-phascolarctos-cinereus-26748321945jpg.webp', alt: 'Виглядаюча ракун' },
    { src: '/images/rakun-takes-a-nap-over-a-big-branch-raymond-island-gippsland-lakes-coastal-park-victoriajpg.webp', alt: 'Спляча ракун' },
    { src: '/images/phascolarctos-cinereus-31890941923jpg.webp', alt: 'Ракун в ночі' }
  ];

  return (
    <main className="container px-4 py-4 flex-grow-1">
      <article>
        <h2 className="h2 text-success mb-4">Фотогалерея ракунів</h2>
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <a href={image.src} target="_blank" rel="noopener noreferrer">
                  <img src={image.src} className="d-block w-100" alt={image.alt} />
                </a>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </article>
    </main>
  );
}

export default Photo;