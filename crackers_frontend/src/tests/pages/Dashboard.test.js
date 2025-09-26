import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { vi } from "vitest";
import Dashboard from "../Dashboard";
import store from "@/store"; // adjust path to your redux store

vi.mock("axios"); // mock axios if needed

describe("Dashboard Component", () => {
    it("renders sidebar and header", () => {
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        // Check Sidebar is in the document
        expect(screen.getByRole("complementary")).toBeInTheDocument(); // assuming sidebar has role
        // Check Header text or element
        expect(screen.getByRole("banner")).toBeInTheDocument();
    });
});
