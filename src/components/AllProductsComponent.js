import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { GetCart } from "../utils/GetCart";
import { GetToken } from "../utils/Login_logoutUser";
import { Card } from "./Card";
import { CartContext } from "./LandingPage";
import Loader from "./Loader";
import styles from "../cssModules/LandingPage.module.css";

const AllProductsComponent = ({
  products,
  isProductLoading,
  showSearchBar,
  inputRef,
}) => {
  const { setCartItems } = useContext(CartContext);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const loaderContainerLength = window.innerWidth <= 1024 ? "100vw" : "44vw";
  const navigate = useNavigate();

  useEffect(() => {
    let alertTimeout;
    if (isProductLoading) {
      alertTimeout = setTimeout(() => {
        alert(
          "Server spinned down due to inactivity, Please wait for a minute."
        );
      }, 7000);
    }
    return () => clearTimeout(alertTimeout);
  }, [isProductLoading]);

  useEffect(() => {
    (async () => {
      if (GetToken()) {
        await GetCart().then((res) => {
          setCartItems(res);
          return res;
        });
      }
    })();
  }, [setCartItems]);

  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    let sortedProducts = [...filteredProducts];
    if (option === "option1") {
      setFilteredProducts(products);
      return;
    } else if (option === "option2") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (option === "option3") {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sortedProducts);
  };

  const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeout);
    };
  };

  const searchFunction = useCallback(
    (value) => {
      if (value.trim() === "") {
        setSuggestions([]);
        setFilteredProducts(products);
        return;
      }
      const newList = filter(value);
      setSuggestions(newList);
    },
    // eslint-disable-next-line
    [products]
  );

  // eslint-disable-next-line
  const debouncedSearchFunction = useCallback(debounce(searchFunction, 500), [
    searchFunction,
  ]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearch(value);
    debouncedSearchFunction(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilteredProducts(filter(search));
    setSuggestions([]);
  };

  const handlePoductClick = (event) => {
    const productElement = event.target.closest("[data-id]");
    if (productElement) {
      const id = productElement.dataset.id;
      navigate("/product/" + id);
    }
  };

  const filter = (searchString) => {
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchString.toLowerCase()) ||
        product.meta.description
          .toLowerCase()
          .includes(searchString.toLowerCase())
    );
  };

  const handleSuggestionClick = (id) => {
    navigate("/product/" + id);
  };

  let productList = filteredProducts.map((item) => (
    <div key={item.id}>
      <Card product={item} />
    </div>
  ));

  return (
    <>
      {showSearchBar && (
        <section className={styles.searchContainer}>
          <form
            onSubmit={handleSubmit}
            ref={inputRef}
            className={styles.formContainer}
          >
            <section className={styles.search}>
              <input
                type="text"
                placeholder="Search for products here..."
                onChange={handleSearch}
                value={search}
                className={styles.searchBar}
              />
              {suggestions.length > 0 &&
                suggestions.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className={styles.suggestion}
                    onClick={() => handleSuggestionClick(product.id)}
                  >
                    <i
                      style={{ display: "inline-block", marginRight: "0.2rem" }}
                      className="fa-solid fa-magnifying-glass-plus"
                    ></i>{" "}
                    {product.name}
                  </div>
                ))}
            </section>
            <button type="submit" className={`${styles.searchBtn} addbtn`}>
              Search
            </button>
          </form>
        </section>
      )}
      {isProductLoading ? (
        <div style={{ minHeight: "70rem" }}>
          <Loader
            containerHeight={loaderContainerLength}
            loaderSize="2.5rem"
            borderSize="0.4rem"
          />
        </div>
      ) : productList.length ? (
        <div className={styles.allProductsContainer}>
          <select
            id="options"
            value={selectedOption}
            onChange={handleOptionChange}
            className={styles.sort}
            ref={inputRef}
          >
            <option value="" disabled hidden>
              {" "}
              Sort by{" "}
            </option>
            <option value="option1">Featured</option>
            <option value="option2">Price low to high</option>
            <option value="option3">Price high to low</option>
          </select>
          <div
            className={styles.productsContainer}
            onClick={(event) => handlePoductClick(event)}
          >
            {" "}
            {productList}{" "}
          </div>
        </div>
      ) : (
        <h2 className={styles.empty}>No Product Matched</h2>
      )}
    </>
  );
};

export default AllProductsComponent;
