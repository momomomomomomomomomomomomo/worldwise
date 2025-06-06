import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, isLoading, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  function handleDeleteCity(e) {
    e.preventDefault();
    deleteCity(id);
  }
  if (isLoading) return <Spinner />;
  return (
    <li>
      <Link
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
        className={`${styles.cityItem} ${
          currentCity.id === id ? styles["cityItem--active"] : ""
        }`}
      >
        <span className={styles.emoji + " emoji"}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>({formatDate(date)})</time>
        <button onClick={handleDeleteCity} className={styles.deleteBtn}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
