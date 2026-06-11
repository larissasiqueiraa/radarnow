import "./PlaceCard.css";
import { Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PlaceCard({
  id,
  nome,
  categoria,
  distancia,
  status,
  comentario,
  confirmacoes,
  tempo,
  cor,
  imagem,
}) {
  const navigate = useNavigate();

  return (
    <article
      className="place-card"
      onClick={() => navigate(`/local/${id}`)}
    >
      <div className={`place-image ${imagem}`}></div>

      <div className="place-content">
        <div className="place-top">
          <div>
            <h2>{nome}</h2>
            <p>{categoria}</p>
          </div>

          <span className="distance">{distancia}</span>
        </div>

        <div className="status-line">
          <span className={`status-dot ${cor}`}></span>
          <strong>{status}</strong>
        </div>

        <p className="comment">{comentario}</p>

        <div className="place-footer">
          <span>
            <Users size={13} />
            {confirmacoes}
          </span>

          <span>
            <Clock size={13} />
            {tempo}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PlaceCard;