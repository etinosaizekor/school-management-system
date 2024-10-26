import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import Classes from "../pages/ClassList";
import { useCreateClassMutation, useGetClassesQuery } from "../api/classApi";
import { render } from "./testUtils";

// Mock the API hooks
vi.mock("../api/classApi", () => ({
  useCreateClassMutation: vi.fn(),
  useGetClassesQuery: vi.fn(),
}));

const mockClasses = [
  { id: 1, className: "Math", Students: [] },
  { id: 2, className: "Science", Students: [{ id: 1, name: "John Doe" }] },
];

const updatedClasses = [
  ...mockClasses,
  { id: 3, className: "History", Students: [] },
];

describe("Classes Component", () => {
  it("should add a new class to the screen after creation", async () => {
    const createClassMock = vi.fn().mockImplementation((classData) => ({
      unwrap: () =>
        Promise.resolve({
          id: 3,
          className: classData.className, // Return the className from the input
          Students: [],
        }),
    }));

    // Mock the API hooks' return values
    (useCreateClassMutation as any).mockReturnValue([createClassMock]);
    (useGetClassesQuery as any).mockReturnValue({
      data: { items: updatedClasses },
      isLoading: false,
      isSuccess: true,
    });

    render(<Classes />);

    // Verify initial classes are rendered
    expect(screen.getByText("Math")).toBeInTheDocument();
    expect(screen.getByText("Science")).toBeInTheDocument();

    // Open the create class modal
    fireEvent.click(screen.getByText("Create New Class"));

    await waitFor(() => {
      expect(screen.getByLabelText(/class name/i)).toBeInTheDocument();
    });

    // Fill in the form and submit
    fireEvent.input(screen.getByLabelText(/class name/i), {
      target: { value: "History" },
    });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // // Wait for the new class to appear on the screen
    await waitFor(() => {
      expect(screen.getByText("History")).toBeInTheDocument();
    });

    // Ensure that the mutation was called with the correct data
    expect(createClassMock).toHaveBeenCalledWith(
      expect.objectContaining({
        className: "History",
        studentIds: [],
      })
    );
  });
});
