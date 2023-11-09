import { Link, mergeStyles, Shimmer } from "@fluentui/react";
import ColumnDisplay from "components/shared/ColumnDisplay";
import useTranslationInfoProvider from "hooks/clause/useTranslationInfoProvider";
import { ITemplateRevisionSlotItem } from "models/slot";
import React, { useCallback, useState } from "react";

const linkClass = mergeStyles({
  lineHeight: 20,
  marginTop: 5,
  fontSize: 12,
});

export type TranslationsProps = {
  partId: string;
};

function Translations({ partId }: TranslationsProps) {
  const [show, setShow] = useState(false);
  const { data, isSuccess } = useTranslationInfoProvider(partId);

  const ClickShow = () => {
    setShow(!show);
  };

  const getLanguages = useCallback(() => {
    const result = data.map(
      (x: ITemplateRevisionSlotItem) => x.languageDisplay
    );
    const tmp = [...result].slice(0, 15);
    return !show ? tmp : result;
  }, [show, data]);

  if (!isSuccess)
    return (
      <div style={{ width: "100%" }}>
        <Shimmer width="90%" />
      </div>
    );

  return (
    <div>
      <ColumnDisplay
        styled={{ padding: 0, fontSize: 12 }}
        minWidth={120}
        maxColumnCount={3}
        minValuesPerColumn={5}
        noValuesMessage="-"
        values={getLanguages()}
      />
      {data && data?.length > 15 && (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link onClick={ClickShow} underline className={linkClass}>
          {!show ? `show all ${data?.length}` : "hide"}
        </Link>
      )}
    </div>
  );
}

export default React.memo(Translations);
