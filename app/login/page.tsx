"use client"

import { getProviders, signIn } from "next-auth/react";

export default async function LoginPage() {
  const providers = await getProviders();

  return (
    <div>
      <h1>Login</h1>
      {providers &&
        Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
    </div>
  );
}
