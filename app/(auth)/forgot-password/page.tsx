import { SearchParams } from "next/dist/server/request/search-params";
import ForgotPasswordForm from "./_components/forgot-password-form";

const ForgotPasswordPage = async (props: {
  searchParams: Promise<SearchParams>;
}) => {
  const email = (await props.searchParams).email as string;

  return (
    <div>
      <ForgotPasswordForm email={email} />
    </div>
  );
};

export default ForgotPasswordPage;
