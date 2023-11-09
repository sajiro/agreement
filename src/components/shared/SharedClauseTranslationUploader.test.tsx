import React from "react";
import { screen, render } from "@testing-library/react";
import SharedClauseTranslationUploader from "./SharedClauseTranslationUploader";

const props = {
  isCustomClause: false,
  disabled: false,
  uploadedTranslations: [],
  updateUploadedTranslations: jest.fn(),
};

describe("Clause Translation Uploader", function () {
  it("renders the component", function () {
    render(<SharedClauseTranslationUploader {...props} />);

    const text = screen.getByText(/Upload new translations/i);
    expect(text).toBeInTheDocument();
  });
});

describe("Custom Clause Translation Uploader", function () {
  props.isCustomClause = true;

  it("renders the component", function () {
    render(<SharedClauseTranslationUploader {...props} />);

    const text = screen.getByText(/Upload new translations/i);
    expect(text).toBeInTheDocument();
  });
});
