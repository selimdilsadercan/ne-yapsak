"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient, Unauthenticated } from "convex/react";
import Loading from "@/components/Loading";

interface Props {
  children: React.ReactNode;
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function ConvexProvider({ children }: Props) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} signInUrl="/" signUpUrl="/">
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>{children}</Unauthenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default ConvexProvider;
