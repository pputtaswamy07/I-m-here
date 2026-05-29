import { useEffect, useState } from "react";

import "../styles/location.css";


function LocationAutocomplete({

  value,

  onChange

}) {

  const [query, setQuery] =
    useState(value || "");

  const [results, setResults] =
    useState([]);

  const [showDropdown, setShowDropdown] =
    useState(false);


  useEffect(() => {

    const fetchLocations = async () => {

      if (query.length < 2) {

        setResults([]);

        return;
      }

      try {

        const response = await fetch(

          `https://nominatim.openstreetmap.org/search?` +

          `q=${query},Germany&format=json&limit=5`
        );

        const data =
          await response.json();


        setResults(data);

      } catch (error) {

        console.log(error);
      }
    };


    const timer = setTimeout(
      fetchLocations,
      300
    );

    return () =>
      clearTimeout(timer);

  }, [query]);


  return (

    <div className="location-wrapper">

      <input
        type="text"
        placeholder="Enter location"
        value={query}
        onChange={(e) => {

          setQuery(e.target.value);

          setShowDropdown(true);
        }}
      />


      {showDropdown &&
        results.length > 0 && (

        <div className="location-dropdown">

          {results.map((place) => (

            <div
              key={place.place_id}
              className="location-item"
              onClick={() => {

                setQuery(place.display_name);

                onChange(
                  place.display_name
                );

                setShowDropdown(false);
              }}
            >

              {place.display_name}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default LocationAutocomplete;