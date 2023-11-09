import InfoCard from "components/shared/InfoCard";
import WithLoading from "components/shared/WithLoading";
import { FormatDate } from "helpers/dates";
import { IConstraint } from "models/constraints";
import stringsConst from "consts/strings";

function ConstraintInfoCard({ constraint }: { constraint: IConstraint|undefined; }) {
  const infoItems = [
    {
      key: stringsConst.common.infoItems.name,
      value: constraint!.name,
    },
    {
      key: stringsConst.common.infoItems.friendlyName,
      value: constraint!.display?constraint!.display : "-",
    },
    {
      key: stringsConst.common.infoItems.lastModifiedKey,
      value: FormatDate(constraint!.modifiedDate),
    },
    {
      key: stringsConst.common.infoItems.modifiedByKey,
      value: constraint!.modifiedBy,
    },
  ];

  return <InfoCard infoItems={infoItems} />;
}

export const ConstraintInfoCardWithLoading = WithLoading(ConstraintInfoCard);

export default ConstraintInfoCard;
