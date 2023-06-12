import {
  render, screen, fireEvent, waitFor, act
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import RegistrationForm from "../pages/RegistrationForm";

test("renders registration form", () => {
  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  // Verify that the form elements are rendered
  const usernameInput = screen.getByPlaceholderText("User Name");
  const lastnameInput = screen.getByPlaceholderText("Last Name");
  const firstnameInput = screen.getByPlaceholderText("First Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByText("Sign Up");

  expect(usernameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
  expect(lastnameInput).toBeInTheDocument();
  expect(firstnameInput).toBeInTheDocument();

});
test("updates input field values", () => {
  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  const firstNameInput = screen.getByPlaceholderText("First Name");
  const lastNameInput = screen.getByPlaceholderText("Last Name");
  const usernameInput = screen.getByPlaceholderText("User Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");

  fireEvent.change(firstNameInput, { target: { value: "John" } });
  fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  fireEvent.change(usernameInput, { target: { value: "johndoe" } });
  fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "Test1234" } });
  expect(firstNameInput.value).toBe("John");
  expect(lastNameInput.value).toBe("Doe");
  expect(usernameInput.value).toBe("johndoe");
  expect(emailInput.value).toBe("john.doe@example.com");
  expect(passwordInput.value).toBe("Test1234");
});
test("submits registration form", async () => {
  const axiosPostMock = jest.spyOn(axios, "post").mockResolvedValueOnce({ data: { status: "OK" } });

  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  const usernameInput = screen.getByPlaceholderText("User Name");
  const lastnameInput = screen.getByPlaceholderText("Last Name");
  const firstnameInput = screen.getByPlaceholderText("First Name");
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByText("Sign Up");
  await act(async () => {
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(lastnameInput, { target: { value: "Doe" } });
    fireEvent.change(firstnameInput, { target: { value: "John" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Test1234" } });
    fireEvent.click(submitButton);
  });
  await waitFor(() => {
    expect(axiosPostMock).toHaveBeenCalledTimes(1);
    expect(axiosPostMock).toHaveBeenCalledWith("http://localhost:8000/", {
      firstName: "John",
      lastName: "Doe",
      username: "testuser",
      email: "test@example.com",
      password: "Test1234",
      birthdate: "",
    });
  });
});
test("displays error message for invalid first name", async () => {
  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  const firstnameInput = screen.getByPlaceholderText("First Name");
  const submitButton = screen.getByText("Sign Up");
  await act(async () => {

    fireEvent.change(firstnameInput, { target: { value: "123" } });
    fireEvent.click(submitButton);
  });
  await waitFor(() => {
    const invalidInput = screen.getByPlaceholderText("First Name").classList.contains("input-invalid");
    expect(invalidInput).toBe(true);
  });
});

test("displays error message for invalid last name", async () => {
  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  const lastnameInput = screen.getByPlaceholderText("Last Name");
  const submitButton = screen.getByText("Sign Up");
  await act(async () => {

    fireEvent.change(lastnameInput, { target: { value: "Doe123" } });
    fireEvent.click(submitButton);
  });
  await waitFor(() => {
    const invalidInput = screen.getByPlaceholderText("Last Name").classList.contains("input-invalid");
    expect(invalidInput).toBe(true);
  });
});

test("displays error message for invalid password", async () => {
  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  const passwordInput = screen.getByPlaceholderText("Password");
  const submitButton = screen.getByText("Sign Up");
  await act(async () => {

    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);
  });
  await waitFor(() => {
    const invalidInput = screen.getByPlaceholderText("Password").classList.contains("input-invalid");
    expect(invalidInput).toBe(true);
  });
});

test("displays error message for invalid email", async () => {
  render(
    <MemoryRouter>
      <RegistrationForm />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText("Email");
  const submitButton = screen.getByText("Sign Up");
  await act(async () => {

    fireEvent.change(emailInput, { target: { value: "test@example" } });
    fireEvent.click(submitButton);
  });
  await waitFor(() => {
    const invalidInput = screen.getByPlaceholderText("Email").classList.contains("input-invalid");
    expect(invalidInput).toBe(true);
  });
});
