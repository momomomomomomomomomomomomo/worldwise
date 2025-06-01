import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
function CountryList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message />;
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
