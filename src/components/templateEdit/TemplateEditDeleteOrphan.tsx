import { CommandButton, VerticalDivider, Text } from "@fluentui/react";
import DeleteOrphan from "components/shared/DeleteOrphan";
import icons from "components/shared/Icons";
import customTheme from "helpers/customTheme";
import useRouter from "hooks/useRouter";
import { AgreementObjectType } from "models/agreements";

function TemplateEditDeleteOrphan({ id, name }: { id: string; name: string }) {
  const { back } = useRouter();

  return (
    <div>
      <div style={customTheme.editTemplateHeading}>
        <CommandButton
          style={{ height: "100%", marginRight: 10, marginLeft: 10 }}
          iconProps={icons.back}
          onClick={back}
        />
        <VerticalDivider />
        <Text
          style={{ margin: "0px 20px", fontWeight: 500 }}
          variant="mediumPlus"
        >
          {name}
        </Text>
      </div>
      <div style={{ marginLeft: 75, marginTop: 16 }}>
        <DeleteOrphan objectType={AgreementObjectType.template} id={id} />
      </div>
    </div>
  );
}

export default TemplateEditDeleteOrphan;
