import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { mocked } from 'ts-jest/utils';
import { SignInButton } from '.';


jest.mock("next-auth/react");

describe("SignInButton Component", () => {
  it("Should render user not signed in state button", ()=> {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'})

    render(
      <SignInButton />
    )

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("Should render user signed in state button", ()=> {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({data: {
      user: {name: "Virtus", email: "virtus@email.com"}, expires: 'fake-expires'
    }, status: 'authenticated'})
    
    render(
      <SignInButton />
    )

    expect(screen.getByText("Virtus")).toBeInTheDocument();
  }) 
});