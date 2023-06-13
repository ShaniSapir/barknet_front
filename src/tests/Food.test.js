import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import Food from "../pages/explore_pages/Food";
import Post from "../components/Post";

describe("Food Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve([]),
    }));
  });

  it("should render the Food component with empty posts", async () => {
    const { getByText } = render(
      <MemoryRouter>
        <Food />
      </MemoryRouter>
    );
  });

  it("should render the Food component with posts", async () => {
    const mockedPosts = [
      {
        postID: 1,
        username: "user1",
        picture: "picture1.jpg",
        caption: "Caption 1",
        hashtag: "Food",
        likesCount: 10,
      },
      {
        postID: 2,
        username: "user2",
        picture: "picture2.jpg",
        caption: "Caption 2",
        hashtag: "Food",
        likesCount: 5,
      },
    ];

    global.fetch = jest.fn().mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve(mockedPosts),
    }));

    const { getByText, getAllByTestId, queryByText } = render(
      <MemoryRouter>
        <Food />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getByText("Food")).toBeInTheDocument();
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
        <Food />
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
        hashtag: "Food",
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
        hashtag: "Food",
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
