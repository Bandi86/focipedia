import type { Metadata } from "next";
import { pageTitle } from "../../../lib/seo";

export const metadata: Metadata = {
  title: pageTitle("Irányítópult"),
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 