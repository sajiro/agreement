import {
  addMonths,
  DatePicker,
  Dropdown,
  IComboBoxOption,
  IDropdownOption,
  IPanelStyles,
  mergeStyles,
  Panel,
  PanelType as FluentPanelType,
  Toggle,
  FontIcon,
} from "@fluentui/react";
import countries from "consts/countries";
import stringsConst from "consts/strings";

import customTheme from "helpers/customTheme";
import { FormatDate } from "helpers/dates";
import useTemplatePreview from "hooks/template/useTemplatePreview";
import { ItemplatePreviewConfig } from "models/templateMutation";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { ISlotConstraint } from "models/slot";
import { useConst } from "@fluentui/react-hooks";
import { useGetSlotTreeQuery } from "services/slot";
import _ from "lodash";
import { resultSlotActions } from "store/ResultSlotSlice";
import CustomComboBox from "./customComboBox";
import CustomCheckBox from "./customComboBox/checkbox";

const customPanel: Partial<IPanelStyles> = {
  header: {
    paddingLeft: 17,
  },
  content: {
    padding: "0 0 0 17px",
  },
  main: {
    marginTop: 98,
    backgroundColor: customTheme.gridPaneBackgroundColor,
    boxShadow:
      "0px 0.3px 0.9px rgba(0, 0, 0, 0.1), 0px 1.6px 3.6px rgba(0, 0, 0, 0.13)",
  },
};

const containerClass = mergeStyles({
  /*   height: "calc(100vh - 214px)", */
  overflow: "auto",
  marginTop: 15,
  paddingBottom: 21,
  paddingRight: 17,
  ".title": {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 28,
  },
  ".mBottom": {
    marginBottom: 16,
  },
  ".spinnerMargin": {
    marginTop: 20,
  },
});

const includeListClass = mergeStyles({
  listStyle: "none",
  padding: 0,
  li: {
    marginBottom: 12,
    ".ms-Checkbox-text": {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: 240,
    },
  },
});

const toggleContainerClass = mergeStyles({
  marginTop: 15,
  paddingBottom: 12,
  borderBottom: `1px solid ${customTheme.divBorderColor}`,
  ".info": {
    fontSize: 12,
    marginBottom: 0,
  },
});

const noSlotsClass = mergeStyles({
  display: "flex",
  paddingBottom: 12,
  // height: "calc(100vh - 214px)",
  ".iconInfo": {
    fontSize: 16,
    color: customTheme.messageLink,
    marginTop: 17,
  },
  ".infoText": {
    marginRight: 35,
    marginLeft: 5,
  },
});

const headerClassName = mergeStyles({
  fontSize: 16,
});

export type PreviewPanelProps = {
  isPanelOpen: boolean;
  templateId: string;
  revisionId: string;
  pivotName: string;
};

type ContextType = {
  [key: string]: string | number;
};

type ErrorValueList = {
  combos: ISlotConstraint[];
  includes: ISlotConstraint[];
};

function previewPanel({
  isPanelOpen,
  pivotName,
  ...templateInfo
}: PreviewPanelProps) {
  const initDate = new Date();
  const now = useConst(new Date(Date.now()));
  const minDate = useConst(addMonths(now, 0));
  const dispatch = useDispatch();

  const {
    currentData: slotTree,
    isLoading,
    isFetching,
  } = useGetSlotTreeQuery(templateInfo);

  const [ArrIncludes, setArrIncludes] = useState<ISlotConstraint[]>([]);
  const [ArrCombos, setArrCombos] = useState<ISlotConstraint[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfigUpdated, setIsConfigUpdated] = useState(false);
  const [noValueList, setNoValueList] = useState<ErrorValueList>({
    combos: [],
    includes: [],
  });
  const [previewConfig, setPreviewConfig] = useState<ItemplatePreviewConfig>({
    languagelocale: "en-us",
    asofdate: initDate.toISOString(),
    context: {},
    IncludeTestRevision: false,
  });

  const [context, setContext] = useState<ContextType>({});
  const currentConfig = useSelector(
    (state: RootState) => state.templateEditPreview
  );

  const { setConfig } = useTemplatePreview();
  const triggered = useSelector((state: RootState) => state.resultSlotSlice);

  useEffect(() => {
    const nullCombosSet = new Set(noValueList.combos);
    const nullCombos = ArrCombos.filter((obj) => !nullCombosSet.has(obj));
    const nullIncludesSet = new Set(noValueList.includes);
    const nullIncludes = ArrIncludes.filter((obj) => !nullIncludesSet.has(obj));
    setArrIncludes(nullIncludes);
    setArrCombos(nullCombos);
  }, [noValueList]);

  useEffect(() => {
    if (triggered.isTriggered) {
      dispatch(resultSlotActions.setTriggered({ isTriggered: false }));
      setIsConfigUpdated(true);
      setTimeout(() => {
        setIsConfigUpdated(false);
      }, 0);
    }
  }, [currentConfig]);

  useEffect(() => {
    setPreviewConfig({
      ...currentConfig,
      context: isDeleting ? context : { ...currentConfig.context, ...context },
    });
    setIsDeleting(false);
  }, [context]);

  useEffect(() => {
    setConfig({
      languagelocale: previewConfig.languagelocale,
      asofdate: previewConfig.asofdate,
      context: previewConfig.context,
      IncludeTestRevision: previewConfig.IncludeTestRevision,
    });
  }, [previewConfig]);

  useEffect(() => {
    if (!isLoading && !isFetching && !slotTree!.isLoading) {
      if (!_.isEqual(previewConfig.context, currentConfig.context)) {
        setPreviewConfig({ ...currentConfig });
      }
      const slots = Object.values(slotTree!.nodes);
      const constraints = slots
        ?.map((obj) => obj.constraints)
        .flat(1)
        .filter((con, i, arr) => arr.findIndex((t) => t.key === con.key) === i)
        .sort((a, b) =>
          (a.keyDisplay ?? a.key) < (b.keyDisplay ?? b.key) ? -1 : 1
        );

      const ArrIncludesTmp: ISlotConstraint[] = [];
      const ArrCombosTmp: ISlotConstraint[] = [];

      constraints?.forEach((elem: ISlotConstraint) => {
        if (elem.value.toLowerCase() === "true") {
          ArrIncludesTmp.push(elem);
        } else {
          ArrCombosTmp.push(elem);
        }
      });

      setArrIncludes(ArrIncludesTmp);
      setArrCombos(ArrCombosTmp);
    }
  }, [slotTree, isFetching, isLoading]);

  const onDateSelected = (date: Date | null | undefined) => {
    if (date) {
      setPreviewConfig({ ...currentConfig, asofdate: date.toISOString() });
    }
  };

  const onChangeCheckbox = (
    _ev?: React.FormEvent<HTMLElement | HTMLInputElement>,
    isChecked?: boolean
  ) => {
    const currentBox = _ev?.currentTarget.title as string;
    if (isChecked) {
      setPreviewConfig({
        ...currentConfig,
        context: { ...currentConfig.context, [currentBox]: isChecked },
      });
    } else {
      const { [currentBox]: removeProp, ...updated } = currentConfig.context;
      setPreviewConfig({
        ...currentConfig,
        context: updated,
      });
    }
  };

  const onFormatDate = (date?: Date): string => {
    const Today = moment().startOf("day").toString();
    const dateObj = moment(date).startOf("day");
    return dateObj.toString() === Today
      ? stringsConst.common.Today
      : FormatDate(date);
  };

  const onOptionSelected = (
    option: IComboBoxOption | undefined,
    id: string | undefined
  ) => {
    const currentId = id as string;
    if (option) {
      setContext({
        [currentId]: option.key,
      });
    } else {
      const { [currentId]: removeProp, ...updated } = currentConfig.context;
      setContext(updated);
      setIsDeleting(true);
    }
  };

  const onChangeLanguage = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption | undefined
  ): void => {
    if (item) {
      setPreviewConfig({
        ...currentConfig,
        languagelocale: item.key as string,
      });
    }
  };

  const triggerNoValues = (
    item: ISlotConstraint | undefined,
    isInclude?: boolean
  ) => {
    setNoValueList({
      combos: isInclude
        ? [...noValueList.combos]
        : [...noValueList.combos, item!],
      includes: isInclude
        ? [...noValueList.includes, item!]
        : [...noValueList.includes],
    });
  };

  const onToggle = (
    ev: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ): void => {
    setPreviewConfig({
      ...currentConfig,
      IncludeTestRevision: checked as boolean,
    });
    dispatch(resultSlotActions.setShowTestClauses({ toggle: true }));
  };

  return (
    <Panel
      styles={customPanel}
      headerText={stringsConst.templateEdit.previewPanel.AssemblySettings}
      hasCloseButton={false}
      isFooterAtBottom
      type={FluentPanelType.custom}
      customWidth="320px"
      closeButtonAriaLabel={stringsConst.common.close}
      isOpen={isPanelOpen}
      isBlocking={false}
      headerClassName={headerClassName}
      focusTrapZoneProps={{
        disabled: true,
      }}
      layerProps={{
        styles: {
          root: {
            zIndex: "10",
          },
        },
      }}
    >
      {!isLoading &&
        !isFetching &&
        !slotTree!.isLoading &&
        pivotName === "Structure" &&
        (ArrIncludes.length !== 0 || ArrCombos.length !== 0) && (
          <div className={toggleContainerClass}>
            <p className="info">
              {stringsConst.templateEdit.previewPanel.clausesRendered}
            </p>
          </div>
        )}
      {!isConfigUpdated && pivotName !== "Structure" && (
        <div className={toggleContainerClass}>
          <Toggle
            defaultChecked={currentConfig.IncludeTestRevision}
            onChange={onToggle}
            onText={stringsConst.templateEdit.previewPanel.ShowTestClauses}
            offText={stringsConst.templateEdit.previewPanel.ShowTestClauses}
          />
        </div>
      )}
      {ArrIncludes.length === 0 &&
        ArrCombos.length === 0 &&
        pivotName === "Structure" &&
        !isLoading &&
        !isFetching &&
        !slotTree!.isLoading && (
          <div className={noSlotsClass}>
            <FontIcon iconName="Info" className="iconInfo" />
            <p className="infoText">
              {stringsConst.templateEdit.previewPanel.noSettings}
            </p>
          </div>
        )}
      {!isConfigUpdated &&
        !(
          ArrIncludes.length === 0 &&
          ArrCombos.length === 0 &&
          pivotName === "Structure"
        ) && (
          <div className={containerClass}>
            {pivotName !== "Structure" && (
              <>
                <DatePicker
                  minDate={minDate}
                  className="mBottom"
                  label={stringsConst.common.Date}
                  placeholder={stringsConst.common.Today}
                  value={new Date(currentConfig?.asofdate)}
                  showGoToToday={false}
                  onSelectDate={onDateSelected}
                  formatDate={onFormatDate}
                />
                <Dropdown
                  data-automation-id="assemblyPanel-language-dropdown"
                  className="mBottom"
                  placeholder={stringsConst.common.selectAnOption}
                  label={stringsConst.common.Language}
                  defaultSelectedKey={currentConfig.languagelocale}
                  options={countries}
                  onChange={onChangeLanguage}
                />
              </>
            )}
            {ArrCombos.map((item, idx) => (
              <div key={`${item.key}-${idx}`}>
                <CustomComboBox
                  item={item}
                  idQuery={item.keyId}
                  id={item.key}
                  placeholder={stringsConst.common.selectAnOption}
                  clear
                  className="mBottom"
                  label={item.keyDisplay === "" ? item.key : item.keyDisplay}
                  options={[]}
                  selectedKey={currentConfig.context[item.key] ?? ""}
                  onOptionSelected={onOptionSelected}
                  triggerNoValues={triggerNoValues}
                />
              </div>
            ))}

            {ArrIncludes.length !== 0 && (
              <p className="title">
                {stringsConst.templateEdit.previewPanel.Include}
              </p>
            )}
            <ul
              className={includeListClass}
              data-automation-id="constrainttruevaluelist"
            >
              {ArrIncludes.map((item, idx) => (
                <li key={`${item.key}-${idx}`}>
                  <CustomCheckBox
                    item={item}
                    label={item.keyDisplay === "" ? item.key : item.keyDisplay}
                    checked={currentConfig.context[item.key]}
                    id={item.keyId}
                    title={item.keyDisplay === "" ? item.key : item.keyDisplay}
                    onChangeCheckbox={onChangeCheckbox}
                    triggerNoValues={triggerNoValues}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
    </Panel>
  );
}

export default React.memo(previewPanel);
