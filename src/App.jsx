/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "pexels";
import Select from "react-select";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

// custom select styles mainly color changes
const styles = {
  menuList: (base) => ({
    ...base,

    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#e1e1e9",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#b1b1b9",
    },
  }),
  control: (base, state) => ({
    ...base,
    border: state.isFocused ? "1px solid #52afa2" : "1px solid #cccccc",
    boxShadow: state.isFocused ? "0px 0px 1px #52afa2" : "none",
    "&:hover": {
      border: "1px solid #52afa2",
      boxShadow: "0px 0px 1px #52afa2",
    },
  }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    backgroundColor: isSelected
      ? "#52afa2"
      : isFocused
      ? "rgba(102, 195, 182, 0.2)"
      : base.backgroundColor,
    color: isSelected ? "white" : "black",
    "&:active": {
      backgroundColor: isSelected ? "#52afa2" : "rgba(102, 195, 182, 0.2)",
    },
  }),
};

function App() {
  // per page options array
  const perPageOptions = [
    { value: 5, label: "05" },
    { value: 10, label: "10" },
    { value: 15, label: "15" },
    { value: 20, label: "20" },
  ];

  // genral states
  const [loading, setLoading] = useState(true);
  const [curatedPhotos, setCuratedPhotos] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // global client declaration
  const client = createClient(
    "IOXaS2Kata7fKWEGWkIhRkfIv93GRitHkTyaraZHRAxCC7kc9Ra2hLkg"
  ); // my api key

  useEffect(() => {
    setLoading(true);
    if (query !== "") {
      client.photos
        .search({
          query,
          page: currentPage,
          per_page: perPage,
        })
        .then((res) => {
          if (res.page === currentPage) {
            // if the response is correct
            setCuratedPhotos(res.photos);
            setCurrentPage(res.page);
            setTotalPages(Math.ceil(res.total_results / perPage)); // 800 instead of 8000
            setPerPage(res.per_page);
          } else {
            console.log("Unexpected API Response", res);
            setCuratedPhotos(null); // incase server returns wrong result
          }
        })
        .catch((err) => {
          console.log(err);
          setCuratedPhotos(null);
        })
        .finally(() => setLoading(false));
    } else {
      client.photos
        .curated({
          page: currentPage,
          per_page: perPage,
        })
        .then((res) => {
          if (res.page === currentPage) {
            // if the response is correct
            setCuratedPhotos(res.photos);
            setCurrentPage(res.page);
            setTotalPages(Math.ceil(res.total_results / perPage)); // 800 instead of 8000
            setPerPage(res.per_page);
          } else {
            console.log("Unexpected API Response", res);
            setCuratedPhotos(null); // incase server returns wrong result
          }
        })
        .catch((err) => {
          console.log(err);
          setCuratedPhotos(null);
        })
        .finally(() => setLoading(false));
    }
  }, [currentPage, perPage]);

  // search states
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState(null);

  // handle search with debounce
  const handleSearch = (value) => {
    setQuery(value);
    // clear any existing timer
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      // hit api at this point
      if (value.length > 3) {
        setLoading(true);
        client.photos
          .search({
            query: value,
            page: currentPage,
            per_page: perPage,
          })
          .then((res) => {
            if (res.page === currentPage) {
              // if the response is correct
              setCuratedPhotos(res.photos);
              setCurrentPage(res.page);
              setTotalPages(Math.ceil(res.total_results / perPage)); // 800 instead of 8000
              setPerPage(res.per_page);
            } else {
              console.log("Unexpected API Response", res);
              setCuratedPhotos(null); // incase server returns wrong result
            }
          })
          .catch((err) => {
            console.log(err);
            setCuratedPhotos(null);
          })
          .finally(() => setLoading(false));
      }
    }, 2000); // 2 seconds
    setTimer(newTimer); // create a new timer
  };

  return (
    <div className="background">
      {loading ? (
        <div className="white-text">Loading...Please Wait</div>
      ) : (
        <>
          <h1>Image Gallery Using React And Pexels API</h1>
          <input
            type="text"
            className="search-input"
            placeholder="Search For Photos, eg: nature"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {curatedPhotos && curatedPhotos.length > 0 ? (
            <div className="imgs-container">
              {curatedPhotos.map((data) => (
                <div className="img-div" key={data.id}>
                  <img src={data.src.landscape} alt={data.alt} />
                </div>
              ))}
            </div>
          ) : (
            <div className="white-text">No Photos Found</div>
          )}
          <div className="per-page-and-pagination">
            <div className="per-page">
              <label>Photos Per Page</label>
              <Select
                value={perPageOptions.find(
                  (option) => option.value === perPage
                )}
                onChange={(option) => {
                  setCurrentPage(1);
                  setPerPage(option.value);
                }}
                options={perPageOptions}
                menuPlacement="top"
                styles={styles}
              />
            </div>
            <ResponsivePagination
              current={currentPage}
              total={totalPages}
              onPageChange={(value) => setCurrentPage(value)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
