import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic'

jest.mock("../../services/prismic.ts");

const posts = [
  {
    slug: "testing-post",
    title: "Post Test",
    excerpt: "Text here",
    updatedAt: "01 de Abril de 2021"
  }
]

describe("Posts page", () => {
  it("should renders correctly", () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText("Post Test")).toBeInTheDocument();
  });

  it("should load inital data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "testing-post",
            data: {
              title: [{ type: "heading", text: "Post Test" }],
              content: [{ type: "paragraph", text: "Text here" }],
            },
            last_publication_date: "04-01-2021"
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        posts: [{
          slug: "testing-post",
          title: "Post Test",
          excerpt: "Text here",
          updatedAt: "01 de abril de 2021"
        }]
      }
    }));
  });
})