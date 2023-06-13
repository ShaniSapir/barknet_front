import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import CreatePost from "../components/Create_post";

jest.mock("axios");

describe("CreatePost Component", () => {
  test("renders the create post form", () => {
    render(<CreatePost />);



    const newPostLabel = screen.getByText("NEW POST");
    expect(newPostLabel).toBeInTheDocument();

    const chooseHashtagLabel = screen.getByLabelText("Choose Hashtag");
    expect(chooseHashtagLabel).toBeInTheDocument();

    const uploadImageLabel = screen.getByLabelText("Upload Image");
    expect(uploadImageLabel).toBeInTheDocument();

    const fileInput = screen.getByLabelText("Upload Image");
    expect(fileInput).toBeInTheDocument();

    const captionLabel = screen.getByLabelText("Caption");
    expect(captionLabel).toBeInTheDocument();

    const captionInput = screen.getByLabelText("Caption");
    expect(captionInput).toBeInTheDocument();

    const createPostButton = screen.getByRole("button", { name: "Create Post" });
    expect(createPostButton).toBeInTheDocument();
  });

  test("updates input field values", () => {
    render(<CreatePost />);
    const hashtagSelect = screen.getByLabelText("Choose Hashtag");
    const captionInput = screen.getByLabelText("Caption");

    fireEvent.change(hashtagSelect, { target: { value: "Fashion" } });
    expect(hashtagSelect.value).toBe("Fashion");

    fireEvent.change(captionInput, { target: { value: "My awesome caption" } });
    expect(captionInput.value).toBe("My awesome caption");
  });
});
