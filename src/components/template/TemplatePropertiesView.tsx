/* eslint-disable react/function-component-definition */
import InfoCard from "components/shared/InfoCard";
import { getInfoItems } from "components/shared/SharedPropertiesView";
import WithLoading from "components/shared/WithLoading";
import { AgreementObjectType } from "models/agreements";
import stringsConst from "consts/strings";
import { ITemplateInfo } from "models/templates";

export type TemplatePropertiesViewProps = {
  // eslint-disable-next-line react/require-default-props
  templateInfo?: ITemplateInfo;
};

// eslint-disable-next-line react/function-component-definition
const TemplatePropertiesView = ({
  templateInfo,
}: TemplatePropertiesViewProps) => {
  const infoItems = getInfoItems(AgreementObjectType.template, templateInfo);

  // eslint-disable-next-line react/function-component-definition
  // eslint-disable-next-line react/no-unstable-nested-components
  const TemplateDescription = () => {
    const textStyles = {
      title: {
        marginBottom: "4px",
        lineHeight: "16px",
        fontSize: "12px",
        fontWeight: 600,
      },
      body: {
        maxWidth: "400px",
        lineHeight: "20px",
        fontSize: "14px",
      },
    };
    if (!templateInfo?.template?.description) {
      return null;
    }

    return (
      <div className="template-description">
        <div className="description-title" style={textStyles.title}>
          {stringsConst.template.TemplatePropertiesView.descriptionHeading}
        </div>
        <div className="description-body" style={textStyles.body}>
          {templateInfo?.template?.description}
        </div>
      </div>
    );
  };

  return (
    <>
      <InfoCard
        infoItems={infoItems}
        dataAutomationId="templateProperties-infoCard"
      />
      <TemplateDescription />
    </>
  );
};

export const TemplatePropertiesViewWithLoading = WithLoading(
  TemplatePropertiesView
);

export default TemplatePropertiesView;
