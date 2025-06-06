// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from "./Button";
import Spinner from "./Spinner";
import ButtonBack from "./ButtonBack";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
const baseURL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState(null);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  useEffect(
    function () {
      if (!lat || !lng) return;
      const controller = new AbortController();
      const signal = controller.signal;
      async function fetchData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError(null);
          const res = await fetch(
            `${baseURL}?latitude=${lat}&longitude=${lng}`,
            { signal }
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "That dosn't seem to be a City. Click somwhere else 😶‍🌫️"
            );
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(convertToEmoji(data.countryCode));
        } catch (err) {
          if (err.name === "AbortError") {
            console.log(`Fetch Aborted for: ${lat},${lng}`);
          } else {
            console.error(err);
            setGeocodingError(err.message);
          }
        } finally {
          if (!signal.aborted) setIsLoadingGeocoding(false);
        }
      }
      fetchData();
      return () => controller.abort();
    },
    [lat, lng]
  );
  if (isLoadingGeocoding) return <Spinner />;
  if (!lat || !lng) return <Message message="start by clicking on the map" />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={`${styles.flag} emoji`}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button onClick={handleSubmit} type={"primary"}>
          Add
        </Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
