import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";
import Search from "../pages/Search";

jest.mock("axios");

describe("Search", () => {
  test("renders search form", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    expect(getByText("Who are we looking for?")).toBeInTheDocument();
  });

  test("displays \"No users found.\" when no users are returned", async () => {
    axios.post.mockResolvedValueOnce({ data: { users: [] } });

    const { getByPlaceholderText, getByRole, queryByText } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchInput = getByPlaceholderText("searchBox");
    const searchButton = getByRole("button", { name: "Search" });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "John" } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/search", { query: "John" });
      expect(queryByText("No users found.", { exact: false })).toBeInTheDocument();
    });
  });

  test("displays users and navigates to personal area on button click", async () => {
    const users = [
      { username: "user1" },
      { username: "user2" },
      { username: "user3" },
    ];

    axios.post.mockResolvedValueOnce({ data: { users } });

    const { getByPlaceholderText, getByRole } = render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    const searchInput = getByPlaceholderText("searchBox");
    const searchButton = getByRole("button", { name: "Search" });
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "John" } });
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:8000/search", { query: "John" });

      users.forEach((user) => {
        const userButton = getByRole("button", { name: user.username });
        expect(userButton).toBeInTheDocument();

        fireEvent.click(userButton);
        expect(localStorage.getItem("visitedUser")).toBe(user.username);
      });
    });
  });
});
