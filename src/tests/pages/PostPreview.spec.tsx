import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock("next-auth/react");
jest.mock("next/router");
jest.mock("../../services/prismic.ts");

const post = {
  slug: "testing-post",
  title: "Post Test",
  content: "<p>Text here</p>",
  updatedAt: "01 de abril de 2021"
}

describe("PostPreview page", () => {
  const useSessionMocked = mocked(useSession);
  useSessionMocked.mockReturnValueOnce({ data: null, status: 'unauthenticated' })

  it("should renders correctly", () => {
    render(<Post post={post} />)

    expect(screen.getByText("Post Test")).toBeInTheDocument();
    expect(screen.getByText("Text here")).toBeInTheDocument();
    expect(screen.getByText("Want to continue reading?")).toBeInTheDocument();
  });

  it("should redirects user to full post if subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({ data: {
      activeSubscription: "fake-active-subscription"
    }, status: 'authenticated' } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<Post post={post} />)

    expect(pushMocked).toHaveBeenCalledWith("/posts/testing-post");
  });

  it("should load inital datal", async () => {
    const getPrismicClientMoked = mocked(getPrismicClient);

    getPrismicClientMoked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "Post Test" }],
          content: [{ type: "paragraph", text: "Text here" }]
        },
        last_publication_date: "04-01-2021"
      })
    } as any);

    const response = await getStaticProps({params: {slug: "testing-post"} });

    expect(response).toEqual(expect.objectContaining({
      props: {
        post: {
          slug: "testing-post",
          title: "Post Test",
          content: "<p>Text here</p>",
          updatedAt: "01 de abril de 2021"
        }
      }
    }));
  });
});