import { mergeStyleSets } from "@fluentui/react";
import stringsConst from "consts/strings";
import customTheme from "helpers/customTheme";

const styles = mergeStyleSets({
  title: customTheme.titleOne,
  desc: {
    color: customTheme.disabledGrey,
  },
});

// eslint-disable-next-line
const NoItemSelectedDisplay = ({ itemType }: { itemType: string }) => (
  <>
    <div
      data-automation-id="no-item-selected" 
      className={styles.title}
    >
      {stringsConst.shared.NoItemSelectedDisplay.title}
    </div>
    <p className={styles.desc}>
      {stringsConst.shared.NoItemSelectedDisplay.content({ itemType })}
    </p>
  </>
);

export default NoItemSelectedDisplay;
