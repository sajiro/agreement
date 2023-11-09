import { IUploadedTranslation } from "models/translations";
import * as translations from "./translations";
// import stringsConst from "consts/strings";

jest.mock("consts/strings", () => ({
  translations: {
    invalidMimeTypeErrorMessage:
      "Invalid file type. Only '.docx' are supported",
    maxFileSizeErrorMessage: "File size exceeds maximum limit of ",
    languageNotSupportedErrorMessage: "Language not supported",
    invalidFileNameErrorMessage:
      "File name should be suffixed with language locale",
  },
}));

describe("getTranslationIndex function", () => {
  test("language in first position", () => {
    const translationsArray = [
      { key: "en-us", text: "English (US)" },
      { key: "da-dk", text: "Danish" },
    ];
    const locale = "en-us";
    const getResults = translations.getTranslationIndex(
      translationsArray,
      locale
    );
    expect(getResults).toEqual(0);
  });
  test("language in second position", () => {
    const translationsArray = [
      { key: "da-dk", text: "Danish" },
      { key: "en-us", text: "English (US)" },
    ];
    const locale = "en-us";
    const getResults = translations.getTranslationIndex(
      translationsArray,
      locale
    );
    expect(getResults).toEqual(1);
  });
});

describe("translationFormHasChanges function", () => {
  test("we have uploaded and removed translations", () => {
    const uploadedTranslations = [
      { fileName: "abc", fileType: "doc", blobUrl: "http://blob.com/1" },
      { fileName: "def", fileType: "doc", blobUrl: "http://blob.com/2" },
    ];
    const removedTranslations = ["en-gb"];
    const getResults = translations.translationFormHasChanges(
      uploadedTranslations,
      removedTranslations
    );
    expect(getResults).toEqual(true);
  });
  test("we have uploaded and removed translations", () => {
    const uploadedTranslations: IUploadedTranslation[] = [];
    const removedTranslations = ["en-gb"];
    const getResults = translations.translationFormHasChanges(
      uploadedTranslations,
      removedTranslations
    );
    expect(getResults).toEqual(true);
  });
  test("we have uploaded and removed translations", () => {
    const uploadedTranslations = [
      { fileName: "abc", fileType: "doc", blobUrl: "http://blob.com/1" },
      { fileName: "def", fileType: "doc", blobUrl: "http://blob.com/2" },
    ];
    const removedTranslations: string[] = [];
    const getResults = translations.translationFormHasChanges(
      uploadedTranslations,
      removedTranslations
    );
    expect(getResults).toEqual(true);
  });
  test("we have no translations", () => {
    const uploadedTranslations: IUploadedTranslation[] = [];
    const removedTranslations: string[] = [];
    const getResults = translations.translationFormHasChanges(
      uploadedTranslations,
      removedTranslations
    );
    expect(getResults).toEqual(false);
  });
});

describe("clearUnneededTranslations", () => {
  it("should be called once", () => {
    global.URL.revokeObjectURL = jest.fn();
    const existingTranslations = [
      { fileName: "test", fileType: "doc", blobUrl: "http://blob.com" },
    ];
    const resultingTranslations = [
      { fileName: "test2", fileType: "doc", blobUrl: "http://blob.com" },
    ];
    translations.clearUnneededTranslations(
      existingTranslations,
      resultingTranslations
    );
    expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });
});

describe("getTranslationLanguageFromFileName", () => {
  it("should fail if not a word doc", () => {
    const fileName = "test.pdf";
    const getResults =
      translations.getTranslationLanguageFromFileName(fileName);
    expect(getResults).toBeFalsy();
  });

  it("should return country code from word doc name", () => {
    const fileName = "contents_en-us.docx";
    const getResults =
      translations.getTranslationLanguageFromFileName(fileName);
    expect(getResults).toEqual("en-us");
  });

  it("should return lower cased country code from word doc name", () => {
    let fileName = "contents_En-Us.docx";
    let getResults = translations.getTranslationLanguageFromFileName(fileName);
    expect(getResults).toEqual("en-us");

    fileName = "contents_en-US.docx";
    getResults = translations.getTranslationLanguageFromFileName(fileName);
    expect(getResults).toEqual("en-us");

    fileName = "contents_EN-US.docx";
    getResults = translations.getTranslationLanguageFromFileName(fileName);
    expect(getResults).toEqual("en-us");
  });
});

describe("getLanguageFromUrl", () => {
  it("should return country code from URL", () => {
    const url =
      "https://test-site.com/v1/part/test-part-id/revision/test-revision-id/content/en-us";
    const getResults = translations.getLanguageFromUrl(url);

    expect(getResults).toEqual("en-us");
  });
});

describe("getDisplayNameForLanguage", () => {
  it("should return correct display name for country code", () => {
    const countries = [
      { key: "da-dk", text: "Danish" },
      { key: "de-de", text: "German" },
      { key: "en-gb", text: "English (UK)" },
      { key: "en-us", text: "English (US)" },
    ];

    const getResults = countries.map((country) =>
      translations.getDisplayNameForLanguage(country.key)
    );

    expect(getResults[0]).toEqual("Danish");
    expect(getResults[1]).toEqual("German");
    expect(getResults[2]).toEqual("English (UK)");
    expect(getResults[3]).toEqual("English (US)");
  });
});

describe("getTranslationIndex", () => {
  it("should return correct index ", () => {
    const translationsArr = [
      { key: "da-dk", text: "Danish" },
      { key: "en-us", text: "English (US)" },
    ];
    const locale = "en-us";
    const getResults = translations.getTranslationIndex(
      translationsArr,
      locale
    );
    expect(getResults).toEqual(1);
  });
  it("should return correct index ", () => {
    const translationsArr = [
      { key: "da-dk", text: "Danish" },
      { key: "de-de", text: "German" },
      { key: "en-us", text: "English (US)" },
    ];
    const locale = "en-us";
    const getResults = translations.getTranslationIndex(
      translationsArr,
      locale
    );
    expect(getResults).toEqual(2);
  });
});

describe("sortByLanguageName", () => {
  it("should sort language correctly ", () => {
    const clauseContents = [
      {
        language: "ja-jp",
        length: 12515,
        disposition: "",
        contents: {},
        lastModified: new Date("2021-10-22T20:55:24.0361323Z"),
        status: "",
        sasUri: "",
        sasExpiration: new Date("2021-10-22T20:55:24.0361323Z"),
      },
      {
        language: "de-de",
        length: 12515,
        disposition: "",
        contents: {},
        lastModified: new Date("2021-10-22T20:55:24.0361323Z"),
        status: "",
        sasUri: "",
        sasExpiration: new Date("2021-10-22T20:55:24.0361323Z"),
      },
    ];

    const sortLanguage = translations.sortByLanguageName(clauseContents);
    expect(sortLanguage).toEqual([
      {
        language: "de-de",
        length: 12515,
        disposition: "",
        contents: {},
        lastModified: new Date("2021-10-22T20:55:24.0361323Z"),
        status: "",
        sasUri: "",
        sasExpiration: new Date("2021-10-22T20:55:24.0361323Z"),
      },
      {
        language: "ja-jp",
        length: 12515,
        disposition: "",
        contents: {},
        lastModified: new Date("2021-10-22T20:55:24.0361323Z"),
        status: "",
        sasUri: "",
        sasExpiration: new Date("2021-10-22T20:55:24.0361323Z"),
      },
    ]);
  });
});

describe("uploadTranslations", () => {
  window.URL.createObjectURL = jest.fn();

  it("should not return an error if all checks are valid", () => {
    let files = [
      {
        name: "fileName_en-us.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "test_fileName_en-us.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "multiple_underscore_fileName_en-us.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "mult iplespace with_underscore_fileName_en-us.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "UPPERCASE_FILENAME_en-us.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "fileName_ja-jp.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "_en-GB.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 4000,
      },
    ];
    const getResults = translations.uploadTranslations(files as any[]);
    getResults.forEach((element) => {
      expect(element.hasOwnProperty("errorMessage")).toBeFalsy();
    });
  });

  it("should show file size error message if file to large", () => {
    let files = [
      {
        name: "fileName_ja-jp.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 7000000,
      },
    ];

    const getResults = translations.uploadTranslations(files as any[]);
    getResults.forEach((element) => {
      expect(element.errorMessage).toEqual(
        "File size exceeds maximum limit of 5000000"
      );
    });
  });
  it("should show file type error message if file is wrong type", () => {
    let files = [
      {
        name: "fileName_ja-jp.docx",
        type: "wrong type",
        size: 4000,
      },
    ];
    const getResults = translations.uploadTranslations(files as any[]);
    getResults.forEach((element) => {
      expect(element.errorMessage).toEqual(
        "Invalid file type. Only '.docx' are supported"
      );
    });
  });
  it("should show file name error message if file name is incorrect", () => {
    let files = [
      {
        name: "fileName.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 4000,
      },
    ];
    const getResults = translations.uploadTranslations(files as any[]);
    getResults.forEach((element) => {
      expect(element.errorMessage).toEqual(
        "File name should be suffixed with language locale"
      );
    });
  });
  it("should show language locale error message if language is incorrect", () => {
    let files = [
      {
        name: "fileName_ja-jk.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 4000,
      },
      {
        name: "MCA_DPA_Addendum____March_2022en-GB.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 4000,
      },
    ];
    const getResults = translations.uploadTranslations(files as any[]);
    getResults.forEach((element) => {
      expect(element.errorMessage).toEqual("Language not supported");
    });
  });
  it("should show language locale error message if language is incorrect", () => {
    let files = [
      {
        name: "fileName_en-us.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "fileName_ja-jk.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      {
        name: "fileName.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 3000,
      },
      { name: "fileName_en-us.docx", type: "wrongMimeType", size: 3000 },
      { name: "fileName2.docx", type: "wrongMimeType", size: 3000 },
      {
        name: "fileName_ja-jp.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 7000000,
      },
    ];
    const getResults = translations.uploadTranslations(files as any[]);
    let errors = 0;
    getResults.forEach((element) => {
      if (element.hasOwnProperty("errorMessage")) {
        errors++;
      }
    });
    expect(errors).toBe(5);
  });
});
