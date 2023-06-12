import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Home from "../pages/Home";
import Post from "../components/Post";

jest.mock("axios");

describe("Home Component", () => {
  it("should render the Home component and fetch posts", async () => {
    const mockedPosts = [
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
        likesCount: 5,
      },
    ];

    axios.post.mockResolvedValueOnce({ data: mockedPosts });

    const { getByText, getByAltText } = render(<MemoryRouter><Home /></MemoryRouter>);

    await waitFor(() => {
      expect(getByText("user1")).toBeInTheDocument();
      expect(getByText("Caption 1")).toBeInTheDocument();
      expect(getByText("#hashtag1")).toBeInTheDocument();
      expect(getByText("10")).toBeInTheDocument();

      expect(getByText("user2")).toBeInTheDocument();
      expect(getByText("Caption 2")).toBeInTheDocument();
      expect(getByText("#hashtag2")).toBeInTheDocument();
      expect(getByText("5")).toBeInTheDocument();
    });
  });
});

describe("Post Component", () => {
  it("should render the Post component with initial likes count", () => {
    const post = {
      postID: 1,
      username: "user1",
      picture: "picture1.jpg",
      caption: "Caption 1",
      hashtag: "hashtag1",
      likesCount: 10,
    };

    const { getByText } = render(
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
    expect(getByText("#hashtag1")).toBeInTheDocument();
    expect(getByText("10")).toBeInTheDocument();
  });

  it("should update the likes count when the like button is clicked", async () => {
    const post = {
      postID: 1,
      username: "user1",
      picture: "picture1.jpg",
      caption: "Caption 1",
      hashtag: "hashtag1",
      likesCount: 10,
    };

    axios.post.mockResolvedValueOnce({ data: { data: 11 } });

    const { getByText, getByRole } = render(
      <MemoryRouter>
        <Post
          postID={post.postID}
          username={post.username}
          picture={post.picture}
          caption={post.caption}
          hashtag={post.hashtag}
          likesCount={post.likesCount}
        /></MemoryRouter>
    );

    const likeButton = getByRole("button");
    const likesCountElement = getByText("10");

    expect(likesCountElement).toBeInTheDocument();

    likeButton.click();

    await waitFor(() => {
      expect(getByText("11")).toBeInTheDocument();
    });
  });
});
