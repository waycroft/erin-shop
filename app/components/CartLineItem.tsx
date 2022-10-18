export type CartLineItemInterface = {
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
        <h2 className="card-title">{item.merchandise.title}</h2>
        <p>(description)</p>
        <div className="card-actions justify-end">
          <input type="number" className="input input-bordered" defaultValue={item.quantity}/>
          <button className="btn btn-primary">Remove</button>
        </div>
      </div>
    </div>
  );
}
