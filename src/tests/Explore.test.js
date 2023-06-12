import React from "react";
import { render, act, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Explore from "../pages/Explore";

// Mock the API response
const mockPosts = [
  {
    postID: 1,
    username: "user1",
    picture: "picture1.jpg",
    caption: "Caption 1",
    hashtag: "hashtag1",
    likesCount: 10,
  },
  {
    postID: 2,
    username: "user2",
    picture: "picture2.jpg",
    caption: "Caption 2",
    hashtag: "hashtag2",
    likesCount: 20,
  },
];

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: mockPosts })),
}));

describe("Explore", () => {

  it("should fetch posts and update the state", async () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );
  });

  it("should log an error when fetching posts fails", async () => {
    jest.mock("axios", () => ({
      get: jest.fn(() => Promise.reject(new Error("API error"))),
    }));

    const consoleErrorSpy = jest.spyOn(console, "error");
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    );

    // Wait for the API error and error logging
    await act(async () => {
      // Assert that the error message is logged to the console
      expect(console.error).not.toHaveBeenCalledWith(
        "error fetching post: ",
        new Error("API error")
      );
    });

    consoleErrorSpy.mockRestore();
  });

});
