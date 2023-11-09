import React from "react";
import { RootState } from "store";
import { render, screen } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import DocumentViewer, { DocumentViewerProps } from "./DocumentViewer";

const props: DocumentViewerProps = {
  fileName: "filename",
};

describe("DocumentViewer", () => {
  it("renders when no error is present", () => {
    const setStateMock = jest.fn();
    const useStateMockError: any = () => [undefined, setStateMock];
    jest.spyOn(React, "useState").mockImplementationOnce(useStateMockError);
    const setStateMock2 = jest.fn();
    const useStateMockIframe: any = () => ["iframe content", setStateMock2];
    jest.spyOn(React, "useState").mockImplementationOnce(useStateMockIframe);
    render(<DocumentViewer {...props} />, {
      preloadedState: {} as RootState,
    });
    const iframeTitle = screen.getByTitle("clause preview");
    expect(iframeTitle).toBeInTheDocument();
    const message = screen.queryByText("Error Message");
    expect(message).toBeNull();
  });
  it("renders an error if error is received", () => {
    const setStateMock = jest.fn();
    const useStateMockError: any = () => ["Error Message", setStateMock];
    jest.spyOn(React, "useState").mockImplementationOnce(useStateMockError);
    const setStateMock2 = jest.fn();
    const useStateMockIframe: any = () => ["iframe content", setStateMock2];
    jest.spyOn(React, "useState").mockImplementationOnce(useStateMockIframe);
    render(<DocumentViewer {...props} />, {
      preloadedState: {} as RootState,
    });
    const errorMessage = screen.getByText("Error Message");
    expect(errorMessage).toBeInTheDocument();
    const message = screen.queryByTitle("clause preview");
    expect(message).toBeNull();
  });
});
