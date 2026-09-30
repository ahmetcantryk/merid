import { redirect } from "next/navigation";

export default function DocsIndex(): never {
  redirect("/tr/docs/introduction");
}
