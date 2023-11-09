import axios from "axios";
import { config } from "config";
import { useCallback } from "react";
import { getAuthenticationToken } from "services/authentication";

const useDocumentPreview = () => {
  const generateIFramePreview = useCallback(
    async (fileName: string): Promise<{ isError: boolean; content: string; }> => {
      try {
        const authenticationToken = await getAuthenticationToken(config.authentication.scopes);
        const headers = { headers: { authorization: `bearer ${authenticationToken}` } };
        const url = `${config.wopiHostBaseUrl}/officehost/templates/files/${fileName}?wopi_action=embedview`;
        const response = await axios.get<string>(url, headers);
        const isError = response.status !== 200;
        return { isError, content: isError ? `status code: ${response.status}` : response.data };
      } catch {
        // Request failed to send 
        return { isError: true, content: "error sending request" };
      }
    }, []);

  return { generateIFramePreview };
};

export default useDocumentPreview;
