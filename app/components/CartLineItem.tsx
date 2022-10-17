export type CartLineItem = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
    };
    image: {
      url: string;
      altText: string;
    };
  };
};

export default function CartLineItem() {


}