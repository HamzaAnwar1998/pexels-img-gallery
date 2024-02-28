import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "pexels";
import Select from "react-select";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

// custom styles
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
    {
      value: 5,
      label: "05",
    },
    {
      value: 10,
      label: "10",
    },
    {
      value: 15,
      label: "15",
    },
    {
      value: 20,
      label: "20",
    },
  ];

  // states
  const [loading, setLoading] = useState(true);
  const [curatedPhotos, setCuratedPhotos] = useState(null);

  // states for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // get curated photos
  useEffect(() => {
    setLoading(true);
    const client = createClient(
      "IOXaS2Kata7fKWEGWkIhRkfIv93GRitHkTyaraZHRAxCC7kc9Ra2hLkg"
    );

    client.photos
      .curated({
        page: currentPage,
        per_page: perPage,
      })
      .then((res) => {
        console.log(res);
        // Check if the response page matches the requested page
        if (res.page === currentPage) {
          setCuratedPhotos(res.photos);
          setTotalPages(Math.ceil(res.total_results / perPage));
          // Do not update currentPage and perPage if the response is unexpected
          setCurrentPage(res.page);
          setPerPage(res.per_page);
        } else {
          // Handle unexpected response (optional)
          console.log("Unexpected API response:", res);
          setCuratedPhotos(null);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [currentPage, perPage]);

  return (
    <div className="background">
      {loading ? (
        <div className="white-text">Loading...Please Wait</div>
      ) : (
        <>
          <h1>Image Gallery Using React And Pexels API</h1>
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
              <label>Records per page</label>
              <Select
                value={perPageOptions.find(
                  (option) => option.value === perPage
                )}
                onChange={(option) => {
                  setCurrentPage(1);
                  setPerPage(option.value);
                }}
                options={perPageOptions}
                styles={styles}
                menuPlacement="top"
              />
            </div>
            <ResponsivePagination
              current={currentPage}
              total={totalPages}
              onPageChange={(value) => {
                setCurrentPage(value);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
