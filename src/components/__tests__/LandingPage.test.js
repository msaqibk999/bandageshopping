import { render, screen } from "@testing-library/react";
import { BrowserRouter } from 'react-router-dom';
import { LandingPage } from "../LandingPage";
import "@testing-library/jest-dom";

it("Should load Landing page Navbar", () => {
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );
  const navBar = screen.getByRole("navigation");

  expect(navBar).toBeInTheDocument();
});
