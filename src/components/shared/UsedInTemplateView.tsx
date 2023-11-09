import { Link } from "@fluentui/react"
import { routeDefinitions } from "router";
import useRouter from "hooks/useRouter";

type TemplateLinkInfo = {
    templateId: string,
    templateName: string
}
function UsedInTemplateView({ templateId, templateName }: TemplateLinkInfo) {
    const { goToRoute } = useRouter();
    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link
            key={templateId}
            onClick={() =>
                goToRoute(
                    routeDefinitions.TemplateEdit.getRouteInfo({
                        templateId,
                    })
                )
            }
        >
            {templateName}
        </Link>)
}
export default UsedInTemplateView