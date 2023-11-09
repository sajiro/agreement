import React from "react";
import { screen, render } from "@testing-library/react";
import ClauseTranslationRemover from "./ClauseTranslationRemover";

type ClauseTranslationRemoverProps = {
  disabled: boolean;
  existingTranslations: string[] | undefined;
  removedTranslations: string[] | undefined;
  successfullyUploadedTranslations: string[] | undefined;
  successfullyRemovedTranslations: string[] | undefined;
  updateRemovedTranslations: (removedTranslations: string[]) => void;
};

const props: ClauseTranslationRemoverProps = {
  disabled: false,
  existingTranslations: [],
  removedTranslations: [],
  successfullyUploadedTranslations: [],
  successfullyRemovedTranslations: [],
  updateRemovedTranslations: jest.fn(),
};

describe("Clause Translation Remover", function () {
  it("renders the component", function () {
    render(<ClauseTranslationRemover {...props} />);

    const text = screen.getByText(/Delete existing translations/i);
    expect(text).toBeInTheDocument();
  });
});
