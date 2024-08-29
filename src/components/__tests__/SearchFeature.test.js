import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "../LandingPage";
import AllProductsComponent from "../AllProductsComponent";
import Mock_products_data from "../../Mocks/Mock_products_data.json";
import "@testing-library/jest-dom";

it("Should load Landing page Navbar", () => {
  render(
    <BrowserRouter>
      <LandingPage />
      <Routes>
        <Route
          path="/"
          element={
            <AllProductsComponent
              products={Mock_products_data}
              isProductLoading={false}
              showSearchBar={true}
              inputRef={null}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );

  const cardsBeforeSearch = screen.getAllByTestId("test-card")
  expect(cardsBeforeSearch.length).toBe(12);

  const searchInput = screen.getByTestId("search-input");
  expect(searchInput).toBeInTheDocument();
  const searchBtn = screen.getByTestId("search-btn");
  expect(searchBtn).toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "jacket" } });
  fireEvent.click(searchBtn);

  // screen should load 6 cards
  const cardsAfterSearch = screen.getAllByTestId("test-card")
  expect(cardsAfterSearch.length).toBe(6);
});
