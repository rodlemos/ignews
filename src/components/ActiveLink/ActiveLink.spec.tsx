import { render, screen } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/"
      }
    }
  }
})

describe("Active link", () => {
  it("Should be able to render the link component", ()=> {
    render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    expect(screen.getByText("Home")).toBeInTheDocument();
  })

  it("Should be able to render link active class", ()=> {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText("Home")).toHaveClass("active");
  })  
});