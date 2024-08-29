import { render, screen } from "@testing-library/react";
import { Card } from "../Card";
import { BrowserRouter } from "react-router-dom";
import Mock_card_data from "../../Mocks/Mock_card_data.json"
import "@testing-library/jest-dom";

it("Should render Card component with mock data",() => {
    render(
        <BrowserRouter>
        <Card product={Mock_card_data}/>
        </BrowserRouter>
    )

    const category = screen.getByText("apparel");
    expect(category).toBeInTheDocument();
})