import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils';
import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe';

jest.mock("next-auth/react", ()=> {
  return {
    useSession: ()=> [null, false]
  }
});

jest.mock("next/router");
jest.mock('../../services/stripe.ts');

describe("Home page", () => {
  it("should renders correctly", () => {
    render(<Home product={{priceId: 'fake-id', amount: "R$ 10,00"}}/>)

    expect(screen.getByText("for R$ 10,00/month")).toBeInTheDocument();
  });

  it("should load initial data", async() => {
    const stripePricesRetriveMocked = mocked(stripe.prices.retrieve);

    stripePricesRetriveMocked.mockResolvedValueOnce({
      id: "fake-id",
      unit_amount: 1000
    } as any);

    const response = await getStaticProps({})

    expect(response).toEqual(expect.objectContaining({
      props: {
        product: {
          priceId: "fake-id",
          amount: "$10.00"
        }
      }
    }));
  })
})