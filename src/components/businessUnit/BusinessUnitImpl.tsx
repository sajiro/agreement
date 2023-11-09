import {
  CommandBar,
  ICommandBarItemProps,
  ICommandBarStyles,
} from "@fluentui/react";
import customTheme from "helpers/customTheme";
import useBusinessUnit from "hooks/useBusinessUnit";
import { useEffect } from "react";

const minWidth: number = 80;

const commandBarStyles: Partial<ICommandBarStyles> = {
  root: {
    "&::after": {
      border: "0px",
      borderWidth: "0px",
      borderStyle: "none",
    },
    minWidth: `${minWidth}px`,
    marginLeft: "15px",
    marginTop: "17px",
    paddingLeft: "20px",
    float: "left",
    ".ms-Button-label": {
      fontWeight: 600,
      fontSize: "18px",
    },
  },
  primarySet: {
    ".ms-Button-label": {
      color: customTheme.bodyColor,
    },
  },
};

function BusinessUnitImpl({
  setPadding,
}: {
  setPadding: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { businessUnitName, businessUnits, setBusinessUnit } =
    useBusinessUnit();

  const BUItems: ICommandBarItemProps[] = [
    {
      key: businessUnitName,
      text: businessUnitName,
      subMenuProps:
        businessUnits!.length === 1
          ? undefined
          : {
              items: businessUnits!.map((bu) => ({
                text: bu,
                key: bu,
                onClick: () => {
                  setBusinessUnit(bu);
                },
              })),
            },
      disabled: businessUnits!.length === 1,
    },
  ];

  useEffect(() => {
    const maxBUOptionlength = [...businessUnits!].sort(
      (a: string, b: string) => a.length - b.length
    )[businessUnits!.length - 1].length;
    const maxBUPaddingLength: number = minWidth + maxBUOptionlength;
    const buPadding = `0 0 0 ${maxBUPaddingLength}px`;
    setPadding(buPadding);
  }, [businessUnits]);

  return (
    <div
      data-automation-id="select-business-unit" 
      style={{ position: "relative", zIndex: 100 }}
    >
      <CommandBar
        items={BUItems}
        overflowItems={undefined}
        overflowButtonProps={undefined}
        farItems={undefined}
        ariaLabel="Inbox actions"
        primaryGroupAriaLabel="Email actions"
        farItemsGroupAriaLabel="More actions"
        styles={commandBarStyles}
      />
    </div>
  );
}

export default BusinessUnitImpl;
