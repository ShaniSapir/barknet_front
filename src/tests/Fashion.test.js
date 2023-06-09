import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";
import Fashion from "../pages/explore_pages/Fashion";
import Post from "../components/Post";

describe("Fashion Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve([]),
    }));
  });

  it("should render the Fashion component with empty posts", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Fashion />
      </MemoryRouter>
    );
  });

  it("should render the Fashion component with posts", async () => {
    const mockedPosts = [
      {
        postID: 1,
        username: "user1",
        picture: "picture1.jpg",
        caption: "Caption 1",
        hashtag: "Fashion",
        likesCount: 10,
      },
      {
        postID: 2,
        username: "user2",
        picture: "picture2.jpg",
        caption: "Caption 2",
        hashtag: "Fashion",
        likesCount: 5,
      },
    ];

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(mockedPosts),
    }));

    const { getByText, getAllByTestId, queryByText } = render(
      <MemoryRouter>
        <Fashion />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Fashion")).toBeInTheDocument();
      expect(getByText("user1")).toBeInTheDocument();
      expect(getByText("Caption 1")).toBeInTheDocument();
      expect(getByText("10")).toBeInTheDocument();
      expect(getByText("user2")).toBeInTheDocument();
      expect(getByText("Caption 2")).toBeInTheDocument();
      expect(getByText("5")).toBeInTheDocument();
    });
  });

  it("should render the Navbar and ExploreNavbar components", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <Fashion />
      </MemoryRouter>
    );

    expect(getByRole("navigation")).toBeInTheDocument();
  });

  jest.mock("axios");

  describe("Post Component", () => {
    it("should render the Post component with initial likes count", () => {
      const post = {
        postID: 1,
        username: "user1",
        picture: "picture1.jpg",
        caption: "Caption 1",
        hashtag: "Fashion",
        likesCount: 10,
      };

      const { getByText, getByAltText } = render(
        <Post
          postID={post.postID}
          username={post.username}
          picture={post.picture}
          caption={post.caption}
          hashtag={post.hashtag}
          likesCount={post.likesCount}
        />
      );

      expect(getByText("user1")).toBeInTheDocument();
      expect(getByText("Caption 1")).toBeInTheDocument();
      expect(getByText((content, element) => element.tagName.toLowerCase() === "p" && content.startsWith("#"))).toBeInTheDocument();
      expect(getByText("10")).toBeInTheDocument();
    });

    it("should update the likes count when the like button is clicked", async () => {
      const post = {
        postID: 1,
        username: "user1",
        picture: "picture1.jpg",
        caption: "Caption 1",
        hashtag: "Fashion",
        likesCount: 10,
      };
      jest.mock("axios");

      const { getByText, getByRole } = render(
        <MemoryRouter>
          <Post
            postID={post.postID}
            username={post.username}
            picture={post.picture}
            caption={post.caption}
            hashtag={post.hashtag}
            likesCount={post.likesCount}
          />
        </MemoryRouter>
      );

      const likeButton = getByRole("button");
      const likesCountElement = getByText("10");

      expect(likesCountElement).toBeInTheDocument();

      act(() => {
        fireEvent.click(likeButton);
      });
    });
  });
});
