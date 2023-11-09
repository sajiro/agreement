import React from "react";
import { screen, within } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import { RootState } from "store";
import ClauseTranslationUploader from "components/shared/SharedClauseTranslationUploader";
import ClauseTranslationsForm from "./ClauseTranslationsForm";
import ClauseTranslationRemover from "./ClauseTranslationRemover";

jest.mock("components/shared/SharedClauseTranslationUploader", () => () => (
  <div data-testid="clauseTranslationUploader">
    <p>Test</p>
  </div>
));

jest.mock("./ClauseTranslationRemover", () => () => (
  <div data-testid="clauseTranslationRemover">
    <p>Test</p>
  </div>
));

const props = {
  isLoadingTranslations: true,
};

describe("Clause Dynamic Values Form", function () {
  it("renders the ClauseTranslationUploader component", function () {
    const { getByTestId } = render(<ClauseTranslationsForm {...props} />, {
      preloadedState: {} as RootState,
    });

    const clauseTranslationsForm = getByTestId("clauseTranslationsForm");
    const clauseTranslationUploader = within(
      clauseTranslationsForm
    ).getAllByTestId("clauseTranslationUploader");
    expect(clauseTranslationUploader.length).toBe(1);
  });

  it("renders the ClauseTranslationRemover component", function () {
    const { getByTestId } = render(<ClauseTranslationsForm {...props} />, {
      preloadedState: {
        clausePanelForms: {
          translationsForm: {
            existingTranslations: ["test"],
          },
        },
      } as RootState,
    });

    const clauseTranslationsForm = getByTestId("clauseTranslationsForm");
    const clauseTranslationRemover = within(
      clauseTranslationsForm
    ).getAllByTestId("clauseTranslationRemover");
    expect(clauseTranslationRemover.length).toBe(1);
  });
});
