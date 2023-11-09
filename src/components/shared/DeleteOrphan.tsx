import {
  FontIcon,
  mergeStyleSets,
  PrimaryButton,
  Stack,
  StackItem,
} from "@fluentui/react";
import customTheme from "helpers/customTheme";
import useAgreementObjectDialog from "hooks/useAgreementObjectDialog";
import { AgreementObjectType } from "models/agreements";

const styles = mergeStyleSets({
  title: customTheme.titleTwo,
  content: {
    paddingTop: customTheme.mediumSpacing,
  },
  button: {
    marginTop: customTheme.smallSpacing,
  },
  textContent: {
    width: "400px",
  },
});

function DeleteOrphan({
  objectType,
  id,
}: {
  objectType: AgreementObjectType;
  id: string;
}) {
  const typeToLowerCase = objectType
    .replace(/([A-Z])/g, " $1")
    .trim()
    .toLowerCase();

  const isCustomClause = objectType === AgreementObjectType.customClause;

  const { openDeletionDialog } = useAgreementObjectDialog();

  const onDelete = () => {
    openDeletionDialog({
      title: `Delete ${typeToLowerCase}?`,
      objectType,
      objectId: id,
      revisionId: "",
    });
  };

  return (
    <Stack horizontal className={styles.content}>
      <StackItem>
        <FontIcon
          aria-label="Error"
          iconName="ErrorBadge"
          style={{
            color: customTheme.errorIcon,
            fontSize: "24px",
            width: 36,
            height: 36,
          }}
        />
      </StackItem>
      <StackItem className={styles.textContent}>
        <div className={styles.title}>Broken {typeToLowerCase}</div>
        <p>
          Occasionally, an error during creation can leave a {typeToLowerCase}{" "}
          in a corrupted state. That&apos;s what has happened here.
        </p>
        {isCustomClause ? (
          <p>The only recourse here is to create a new one.</p>
        ) : (
          <>
            <p>
              The only recourse is to delete the {typeToLowerCase} and create a
              new one.
            </p>
            <PrimaryButton
              className={styles.button}
              text={`Delete ${typeToLowerCase}`}
              onClick={onDelete}
            />
          </>
        )}
      </StackItem>
    </Stack>
  );
}

export default DeleteOrphan;
