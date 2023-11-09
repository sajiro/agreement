import { AnyAaaaRecord } from "dns";
import useTranslationInfoProvider from "hooks/clause/useTranslationInfoProvider";
import { RootState } from "store";
import { render, screen, fireEvent } from "test/customRender"; // adjust for relative path to *your* test-utils directory
import Translations, { TranslationsProps } from "../translations";

jest.mock("hooks/clause/useTranslationInfoProvider", () => jest.fn());

let mockApiResponse: any = [
  {
    language: "fi-fi",
    length: 12496,
    disposition:
      "attachment; filename*=UTF-8''TestClauseACV2EffDate%283d234a08-58c7-4414-b00e-1a31d1003afd%29__%2809bbd9ab-081b-4948-ae6b-237ac2a84de0%29__fi-fi.docx",
    contents: {},
    lastModified: "2022-06-10T23:42:43Z",
    status: "Unknown",
    sasUri:
      "https://l2otemplateintcy4.blob.core.windows.net/templatescontainer/Part/3d234a08-58c7-4414-b00e-1a31d1003afd/fi-fi/09bbd9ab-081b-4948-ae6b-237ac2a84de0?sv=2016-05-31&sr=b&sig=xTSosTKM%2Ft%2BbuybHlmTuOsg4VmoenTE%2FMdIkj3QlcEM%3D&st=2022-06-11T00%3A35%3A49Z&se=2022-06-11T00%3A41%3A49Z&sp=r",
    sasExpiration: "2022-06-11T00:41:49.7160629Z",
    languageDisplay: "Finnish",
  },
  {
    language: "de-de",
    length: 12448,
    disposition:
      "attachment; filename*=UTF-8''TestClauseACV2EffDate%283d234a08-58c7-4414-b00e-1a31d1003afd%29__%2809bbd9ab-081b-4948-ae6b-237ac2a84de0%29__de-de.docx",
    contents: {},
    lastModified: "2022-06-10T23:42:42Z",
    status: "Unknown",
    sasUri:
      "https://l2otemplateintcy4.blob.core.windows.net/templatescontainer/Part/3d234a08-58c7-4414-b00e-1a31d1003afd/de-de/09bbd9ab-081b-4948-ae6b-237ac2a84de0?sv=2016-05-31&sr=b&sig=%2Ftg%2BFgbrwTvuli%2BEC9TPYqV8w5na4rJYm8ChSn8FmU4%3D&st=2022-06-11T00%3A35%3A49Z&se=2022-06-11T00%3A41%3A49Z&sp=r",
    sasExpiration: "2022-06-11T00:41:49.7160629Z",
    languageDisplay: "German",
  },
];

const props: TranslationsProps = {
  partId: "3d234a08-58c7-4414-b00e-1a31d1003afd",
};

describe("translations", () => {
  it("does not render if unsuccessful call returned", function () {
    (useTranslationInfoProvider as jest.Mock).mockReturnValue({
      data: mockApiResponse,
      isSuccess: false,
    });
    render(<Translations {...props} />, {
      preloadedState: {} as RootState,
    });

    const translation = screen.queryByText("Finnish");
    expect(translation).not.toBeInTheDocument();
  });
  it("renders the correct languages", function () {
    (useTranslationInfoProvider as jest.Mock).mockReturnValue({
      data: mockApiResponse,
      isSuccess: true,
    });
    render(<Translations {...props} />, {
      preloadedState: {} as RootState,
    });

    const translation = screen.getByText("Finnish");
    expect(translation).toBeInTheDocument();
    const translation2 = screen.getByText("German");
    expect(translation2).toBeInTheDocument();
  });
  it("renders the show hide correctly", function () {
    const mockApiResponse = [
      {
        languageDisplay: "Bulgarian",
      },
      {
        languageDisplay: "Chinese (Taiwan)",
      },
      {
        languageDisplay: "Croatian",
      },
      {
        languageDisplay: "Czech",
      },
      {
        languageDisplay: "Danish",
      },
      {
        languageDisplay: "English (US)",
      },
      {
        languageDisplay: "Estonian",
      },
      {
        languageDisplay: "Finnish",
      },
      {
        languageDisplay: "French",
      },
      {
        languageDisplay: "German",
      },
      {
        languageDisplay: "Greek",
      },
      {
        languageDisplay: "Hungarian",
      },
      {
        languageDisplay: "Italian",
      },
      {
        languageDisplay: "Korean",
      },
      {
        languageDisplay: "Japanese",
      },
      {
        languageDisplay: "Latvian",
      },
    ];

    (useTranslationInfoProvider as jest.Mock).mockReturnValue({
      data: mockApiResponse,
      isSuccess: true,
    });
    render(<Translations {...props} />, {
      preloadedState: {} as RootState,
    });

    const showText = screen.getByText("show all 16");
    expect(showText).toBeInTheDocument();
    fireEvent.click(showText);
    const hideText = screen.getByText("hide");
    expect(hideText).toBeInTheDocument();
  });
});
