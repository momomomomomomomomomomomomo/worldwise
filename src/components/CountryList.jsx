import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import { useCities } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message={"add your visited countries"} />;
  const countriesSet = new Set(cities.map((city) => city.country));
  const countries = cities
    .filter((city) => countriesSet.has(city.country))
    .map((city) => ({ country: city.country, emoji: city.emoji }));
  console.log(countries);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.emoji} />
      ))}
    </ul>
  );
}

export default CountryList;
