import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Messages from "../pages/Messages";
import { act } from "react-dom/test-utils";

describe("Messages Component", () => {
  it("should render the Messages component", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );

    expect(getByRole("button", { name: "Go to WhatsApp Web" })).toBeInTheDocument();
  });

  it("should open WhatsApp Web when the button is clicked", () => {
    window.open = jest.fn(); // Mock the window.open method

    const { getByRole } = render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );

    const whatsappButton = getByRole("button", { name: "Go to WhatsApp Web" });
    act(() => {
      fireEvent.click(whatsappButton);
    });
    expect(window.open).toHaveBeenCalledWith("https://web.whatsapp.com/", "_blank");
  });

  it("should render the Navbar component", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <Messages />
      </MemoryRouter>
    );

    expect(getByRole("navigation")).toBeInTheDocument();
  });
});
