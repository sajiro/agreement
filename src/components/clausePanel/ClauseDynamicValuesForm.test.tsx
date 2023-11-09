import { RootState } from "store";
import React from "react";
import * as redux from "react-redux";
import { fireEvent, screen } from "@testing-library/react";
import { render } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import ClauseDynamicValuesForm, {
  ClauseDynamicValueFormProps,
} from "./ClauseDynamicValuesForm";
import stringsConst from "consts/strings";
import { IClauseContent, IClauseContentInfo } from "models/clauses";

jest.mock("consts/strings", () => ({
  clausePanel: {
    ClauseDynamicValuesForm: {
      intro: "The clause contains the following dynamic fields.",
    },
  },
}));

const props: ClauseDynamicValueFormProps = {
  clauseId: "123",
  revisionId: "456",
  dynamicPlaceholderContentInfo: {
    language: "",
    length: 1,
    disposition: "",
    lastModified: new Date(),
    status: "",
    sasUri: "",
    sasExpiration: new Date(),
    contents: {
      proposalDuration: "optional",
      proposalExpirationDate: "optional",
    },
  },
};

describe("Clause Dynamic Values Form", function () {
  it("renders the component", function () {
    render(<ClauseDynamicValuesForm {...props} />, {
      preloadedState: {} as RootState,
    });

    const text = screen.getByText(
      /The clause contains the following dynamic fields./i
    );
    expect(text).toBeInTheDocument();
  });
  it("renders the placeholder form", function () {
    render(<ClauseDynamicValuesForm {...props} />, {
      preloadedState: {} as RootState,
    });

    const formLabel = screen.getByText(/proposalDuration/i);
    expect(formLabel).toBeInTheDocument();
  });
  it("renders the placeholder form with 2 text Headers", function () {
    const newProps: ClauseDynamicValueFormProps = {
      clauseId: "123",
      revisionId: "abc",
      dynamicPlaceholderContentInfo: {
        language: "",
        length: 1,
        disposition: "",
        lastModified: new Date(),
        status: "",
        sasUri: "",
        sasExpiration: new Date(),
        contents: {
          Contact: [
            {
              Name: "optional",
              Email: "optional",
            },
            {
              Name: "optional",
              Email: "optional",
            },
          ],
        },
      },
    };
    render(<ClauseDynamicValuesForm {...newProps} />, {
      preloadedState: {} as RootState,
    });

    const formLabel = screen.queryAllByText(/Contact/i);
    expect(formLabel).toHaveLength(2);
  });
});
