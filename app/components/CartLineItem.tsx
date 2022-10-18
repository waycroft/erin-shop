type CartLineItemInterface = {
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

export default function CartLineItem({ item }: { item: CartLineItemInterface }) {
  return (
    <div className="card card-side bg-base-400">
      <figure>
        <img src="https://placeimg.com/200/180/nature" alt="Movie" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">New movie is released!</h2>
        <p>Click the button to watch on Jetflix app.</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div>
      </div>
    </div>
  );
}
