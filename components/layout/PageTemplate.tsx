"use client";

import { useAuth } from "@clerk/nextjs";
import Loading from "@/components/Loading";

interface PageTemplateProps {
  children: React.ReactNode;
}

function PageTemplate({ children }: PageTemplateProps) {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}

export { PageTemplate };
