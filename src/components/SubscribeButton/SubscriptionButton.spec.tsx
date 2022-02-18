import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'
import { SubscribeButton } from '.'


jest.mock("next-auth/react");
jest.mock("next/router");

describe("SubscribeButton Component", () => {
  it("Should render correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'});

    render(<SubscribeButton />)

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("Should redirect user to sign in if not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({data: null, status: 'unauthenticated'});
    const signInMocked = mocked(signIn);

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText("Subscribe now")

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled();
  });

  it("Should redirect user to posts in if authenticated", () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocker = mocked(useRouter);
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "Virtus",
          email: "virtus@email.com"
        },
        activeSubscription: 'fake-active',
        expires: 'fake-expires'
      }, status: 'authenticated'
    })

    useRouterMocker.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText("Subscribe now")

    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalledWith('/posts');
  });
});