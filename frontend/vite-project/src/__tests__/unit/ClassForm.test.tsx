import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import ClassForm from "../../components/ClassForm";
import { useCreateClassMutation } from "../../api/classApi";
import { render } from "../testUtils"; // Make sure your render function wraps with necessary providers

// Mock the API hook
vi.mock("../../api/classApi", () => ({
  useCreateClassMutation: vi.fn(),
}));

describe("ClassForm Component", () => {
  it("should display an error message when class creation fails due to existing class", async () => {
    const createClassMock = vi.fn().mockImplementation(() => ({
      unwrap: () =>
        Promise.reject({ data: { message: "Class already exists." } }),
    }));

    (useCreateClassMutation as any).mockReturnValue([createClassMock]);

    const onSubmit = vi.fn();

    render(<ClassForm onSubmit={onSubmit} errorMessage="" />);

    await waitFor(() => {
      expect(screen.getByLabelText(/class name/i)).toBeInTheDocument();
    });

    // Fill in the class name
    fireEvent.input(screen.getByLabelText(/class name/i), {
      target: { value: "Math" }, // Assuming "Math" is an existing class
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      // Check if the error message is displayed
      expect(screen.getByText("Class already exists.")).toBeInTheDocument();
    });

    // Ensure the create class function was called
    expect(createClassMock).toHaveBeenCalled();
  });
});
