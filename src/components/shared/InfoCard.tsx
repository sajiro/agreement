import { FontSizes, mergeStyleSets } from "@fluentui/react";
import customTheme from "helpers/customTheme";

const styles = mergeStyleSets({
  infoCard: {
    ...customTheme.frame,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    width: "fit-content",
    marginBottom: customTheme.largeSpacing,
  },
  infoRow: {
    display: "flex",
    justifyContent: "flex-start",
  },
  infoText: {
    fontSize: FontSizes.size12,
    fontWeight: "600",
    width: "90px",
  },
  infoValue: {
    fontSize: FontSizes.size14,
  },
});

type InfoItem = { key: string; value?: string | JSX.Element };

// eslint-disable-next-line
const InfoCard = ({
  infoItems,
  keyColumnWidth,
  dataAutomationId,
}: {
  infoItems: InfoItem[];
  keyColumnWidth?: string;
  dataAutomationId?: string;
}) => (
  <div 
    data-automation-id={dataAutomationId}
    className={styles.infoCard}
  >
    {infoItems.map((item, idx) => (
      <div key={`${item.key}-${idx}`} className={styles.infoRow}>
        <div
          data-automation-id='infoCard-key'
          className={styles.infoText}
          style={keyColumnWidth ? { width: `${keyColumnWidth}px` } : {}}
        >
          {item.key}:
        </div>
        <div 
          data-automation-id='infoCard-value'
          className={styles.infoValue}
        >
          {item.value}
        </div>
      </div>
    ))}
  </div>
);

export default InfoCard;
