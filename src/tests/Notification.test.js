import React from "react";
import { render, waitFor } from "@testing-library/react";
import { act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Notifications from "../pages/Notifications";

describe("Notifications Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );
  });

  it("should render the Notifications component with empty notifications", async () => {
    await act(async () => {
      const { getByText } = render(
        <MemoryRouter>
          <Notifications />
        </MemoryRouter>
      );
    });

  });

  it("should render the Notifications component with notifications", async () => {
    const mockedNotifications = ["User1", "User2", "User3"];
    await act(async () => {
      global.fetch = jest.fn().mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockedNotifications),
        })
      );
    });
    const { getByText } = render(
      <MemoryRouter>
        <Notifications />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("User1 liked your post")).toBeInTheDocument();
      expect(getByText("User2 liked your post")).toBeInTheDocument();
      expect(getByText("User3 liked your post")).toBeInTheDocument();
    });
  });
});