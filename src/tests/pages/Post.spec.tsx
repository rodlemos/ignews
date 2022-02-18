import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/react';
import { mocked } from 'ts-jest/utils';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock("next-auth/react");
jest.mock("../../services/prismic.ts");

const post = {
  slug: "testing-post",
  title: "Post Test",
  content: "<p>Text here</p>",
  updatedAt: "01 de abril de 2021"
}

describe("Post page", () => {
  it("should renders correctly", () => {
    render(<Post post={post} />)

    expect(screen.getByText("Post Test")).toBeInTheDocument();
    expect(screen.getByText("Text here")).toBeInTheDocument();
  });

  it("should redirects user if not subscribed", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: {
        slug: "testing-post"
      }
    } as any);

    expect(response).toEqual(expect.objectContaining({
      redirect: expect.objectContaining({ destination: "/" })
    }));
  });

  it("should load inital datal", async () => {
    const getSessionMocked = mocked(getSession);
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

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription"
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "testing-post"
      }
    } as any);

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